from .base_model import BaseModel
import random
from typing import Any

class Module(BaseModel):
    """
    Mock Detector implementation for testing.
    """
    def __init__(self):
        print("Mock Detector Module Initialized")

    def preprocess(self, data: Any) -> Any:
        # Mock preprocessing: just pass through or log
        print(f"Preprocessing data: {data}")
        return data

    def predict(self, data: Any) -> dict:
        # Generate a random risk score
        risk_score = random.uniform(0, 1)
        return {
            "model": "MockDetector",
            "risk_score": risk_score,
            "status": "success",
            "input_received": data
        }
