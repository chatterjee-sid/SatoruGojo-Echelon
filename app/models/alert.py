from sqlalchemy import Column, Integer, String, Float, DateTime, JSON
from app.core.database import Base
import datetime

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    source_IP = Column(String)
    threat_type = Column(String)
    severity_score = Column(Float)
    metadata_json = Column(JSON)  # Renamed from metadata to avoid conflict with Base.metadata
