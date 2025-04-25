# app/core/config.py
import os
from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    """Application settings."""
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Fact Check API"
    DESCRIPTION: str = "API for fact-checking claims against scientific research"
    
    # API Keys
    GEMINI_API_KEY: str = Field(..., description="Google Gemini API key")
    SERP_API_KEY: str = Field(..., description="SERP API key")
    
    # LLM Settings
    GEMINI_MODEL: str = "gemini-2.0-flash"
    
    # Service settings
    PAPER_SEARCH_LIMIT: int = 5
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Create settings instance
settings = Settings()