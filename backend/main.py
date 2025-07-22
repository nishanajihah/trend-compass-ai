"""
main.py - Main FastAPI Application Entry Point

This file initializes and configures the FastAPI application for the Trend Compass tool.
It sets up CORS, imports routers, loads environment variables, and starts the server.
"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Import routers
from routers import trends

# Load environment variables from .env file
load_dotenv()

# Create the FastAPI application
app = FastAPI(
    title="Trend Compass API",
    description="AI-powered trend forecasting and audience insights tool",
    version="1.0.0"
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
