from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    # API Settings
    PROJECT_NAME: str = "Echelon Modular API"
    CORS_ORIGINS: List[str] = ["*"]
    
    # Plugin Settings
    # This list will contain the names of the modules to be loaded dynamically
    # Use ACTIVE_MODEL for the specific plugin that handles predictions
    ACTIVE_MODULES: List[str] = ["verify"]
    ACTIVE_MODEL: str = "mock_detector"
    
    # Model/Resource Paths
    MODEL_PATH: str = "./models"
    
    # Security
    API_KEY: str = "default_secret_key"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

settings = Settings()
