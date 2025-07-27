"""
Main app file - Sets up the FastAPI server and routes
"""

import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables from .env file in parent directory
env_path = Path(__file__).parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

# Import routers (after loading env vars)
from routers import trends

# Create the FastAPI application with enhanced Swagger UI
app = FastAPI(
    title="🔍 Trend Compass API",
    description="""
    ## AI-Powered Trend Forecasting & Audience Insights
    
    **Trend Compass** combines Qloo's cultural affinity data with Google's Gemini AI 
    to provide rich, strategic insights for marketers and creators.
    
    ### Features:
    - 📈 **Trend Analysis**: Analyze emerging trends with cultural context
    - 👥 **Audience Insights**: Deep dive into target audience preferences
    - 🤖 **AI-Powered**: Enhanced by Google Gemini LLM
    - 🎯 **Cultural Data**: Powered by Qloo's cultural affinity engine
    
    ### How to Use:
    1. Choose an endpoint below
    2. Click "Try it out"
    3. Enter your data
    4. Click "Execute" to see results
    """,
    version="1.0.0",
    contact={
        "name": "Trend Compass Team",
        "url": "https://github.com/nishanajihah/trend-compass-ai",
    },
    license_info={
        "name": "MIT License",
    },
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

# Add a simple root endpoint
@app.get("/")
async def root():
    """Root endpoint to verify API is running."""
    return {
        "message": "Welcome to Trend Compass API",
        "status": "online",
        "documentation": "/docs"
    }

# Run the application with uvicorn when this file is executed directly
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    uvicorn.run("main:app", host=host, port=port, reload=True)
