"""
Main FastAPI server and routes
"""

import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from dotenv import load_dotenv

# Load environment variables from .env file in parent directory
env_path = Path(__file__).parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

# Import routers (after loading env vars)
from backend.routers import trends

# Create the FastAPI application with enhanced Swagger UI
app = FastAPI(
    title="🔮 Trend Compass API",
    description="""
    AI-Powered Trend Forecasting & Audience Insights
    
    Combining Qloo's cultural affinity data with Gemini LLM for rich, strategic insights.
    This API provides two main endpoints:
    - `/trends/analyze` - Analyze trending topics and forecast their trajectory
    - `/trends/audience` - Generate detailed audience insights and demographics
    """,
    version="1.0.0",
    contact={
        "name": "Trend Compass Team",
        "url": "https://github.com/nishanajihah/trend-compass-ai",
        "email": "support@trendcompass.ai"
    },
    license_info={
        "name": "MIT License",
        "url": "https://opensource.org/licenses/MIT"
    },
    docs_url=None,  # Disable default docs
    redoc_url=None  # Disable redoc
)

# Configure CORS to allow frontend to communicate with the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For hackathon purposes; restrict this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers for different endpoints
app.include_router(trends.router)

# Health check endpoint
@app.get("/", tags=["Health"])
async def root():
    """Root endpoint with API status and welcome message."""
    return {
        "message": "🔮 Welcome to Trend Compass API",
        "description": "AI-Powered Trend Forecasting & Audience Insights",
        "status": "active",
        "version": "1.0.0",
        "docs": "/docs",
        "endpoints": {
            "trend_analysis": "/trends/analyze",
            "audience_insights": "/trends/audience"
        }
    }

# Health check endpoint for monitoring
@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint for service monitoring."""
    return {
        "status": "healthy",
        "service": "trend-compass-api",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
