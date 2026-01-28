from fastapi import FastAPI, HTTPException, Body, WebSocket, WebSocketDisconnect, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.utils.loader import load_module_class
from app.core.websocket_manager import manager
from app.core.database import engine, get_db, Base
from app.models.alert import Alert
from sqlalchemy.orm import Session
from typing import Any, Dict, List
import logging
import datetime

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.PROJECT_NAME)

# Global storage for instantiated modules
loaded_modules: Dict[str, Any] = {}

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    logger.info("Initializing dynamic modules...")
    
    # Load all general modules
    for module_name in settings.ACTIVE_MODULES:
        try:
            module_path = f"app.modules.{module_name}"
            module_cls = load_module_class(module_path)
            loaded_modules[module_name] = module_cls()
            logger.info(f"Module {module_name} initialized.")
        except Exception as e:
            logger.error(f"Could not load module {module_name}: {e}")

    # Explicitly load the active prediction model if not already in ACTIVE_MODULES
    if settings.ACTIVE_MODEL not in loaded_modules:
        try:
            module_path = f"app.modules.{settings.ACTIVE_MODEL}"
            module_cls = load_module_class(module_path)
            loaded_modules[settings.ACTIVE_MODEL] = module_cls()
            logger.info(f"Active Prediction Model '{settings.ACTIVE_MODEL}' initialized.")
        except Exception as e:
            logger.error(f"Could not load active model {settings.ACTIVE_MODEL}: {e}")

@app.get("/")
async def root():
    return {
        "message": "Server is running", 
        "active_modules": list(loaded_modules.keys()),
        "current_prediciton_model": settings.ACTIVE_MODEL
    }

@app.post("/predict")
async def predict(request: Request, payload: dict = Body(...), db: Session = Depends(get_db)):
    """
    Dynamic prediction route. Uses the model defined in settings.ACTIVE_MODEL.
    Saves the result to the database.
    """
    model_name = settings.ACTIVE_MODEL
    model_instance = loaded_modules.get(model_name)
    source_ip = request.client.host

    if not model_instance:
        raise HTTPException(status_code=500, detail=f"Model {model_name} is not loaded.")

    try:
        # Enforce the Plugin Pattern (BaseModel interface)
        processed_data = model_instance.preprocess(payload.get("data"))
        result = model_instance.predict(processed_data)
        
        risk_score = result.get("risk_score", 0)
        
        # Save to Database
        new_alert = Alert(
            source_IP=source_ip,
            threat_type=model_name,
            severity_score=risk_score,
            metadata_json=result
        )
        db.add(new_alert)
        db.commit()
        
        # Phase 4: High-risk alert broadcasting
        if risk_score > 0.8:
            alert_msg = {
                "type": "HIGH_RISK_ALERT",
                "model": model_name,
                "risk_score": risk_score,
                "data": payload.get("data")
            }
            await manager.broadcast_alert(alert_msg)
            
        return result
    except AttributeError:
        raise HTTPException(status_code=500, detail=f"Loaded module {model_name} does not implement the required interface (preprocess/predict).")
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/history")
async def get_history(db: Session = Depends(get_db)):
    """
    Returns the last 50 alerts sorted by timestamp descending.
    """
    alerts = db.query(Alert).order_by(Alert.timestamp.desc()).limit(50).all()
    return alerts

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint for real-time alerts.
    """
    await manager.connect(websocket)
    try:
        while True:
            # Just keep the connection alive (or handle incoming messages)
            data = await websocket.receive_text()
            # Echo or handle client messages if needed
    except WebSocketDisconnect:
        manager.disconnect(websocket)
