"""
Main FastAPI server and routes
"""

import os
from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv

# Load environment variables from .env file in parent directory
env_path = Path(__file__).parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

# Import routers and middleware (after loading env vars)
from routers import trends
from middleware.rate_limiter import rate_limiter

# Create the FastAPI application with enhanced Swagger UI
app = FastAPI(
    title="Trend Compass API",
    description="""
    AI-Powered Trend Forecasting & Audience Analysis
    
    Combining Qloo's cultural affinity data with Gemini LLM for rich, strategic insights.
    This API provides endpoints for:
    - `/api/trends/analyze` - Analyze trending topics and forecast their trajectory
    - `/api/audience/analyze` - Generate detailed audience insights and demographics
    - `/api/status` - Check API service status and integrations
    
    """,
    version="1.0.0",
    contact={
        "name": "Trend Compass Contact",
        "url": "https://github.com/nishanajihah/trend-compass-ai",
    },
    license_info={
        "name": "MIT License",
        "url": "https://opensource.org/licenses/MIT"
    },
    docs_url="/docs",  # Enable Swagger UI at /docs
    redoc_url="/redoc"  # Enable ReDoc at /redoc
)

# Configure CORS to allow frontend to communicate with the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For hackathon purposes; restrict this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add rate limiting middleware
@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    """Apply rate limiting to API endpoints"""
    
    # Skip rate limiting for health checks and docs
    if request.url.path in ["/", "/health", "/docs", "/redoc", "/openapi.json"]:
        response = await call_next(request)
        return response
    
    # Check rate limit for API endpoints
    if request.url.path.startswith("/api/"):
        rate_limit_response = rate_limiter.check_rate_limit(request)
        if rate_limit_response:
            return rate_limit_response
    
    # Continue with request
    response = await call_next(request)
    
    # Add rate limit headers to response
    if request.url.path.startswith("/api/"):
        remaining = rate_limiter.get_remaining_requests(request)
        response.headers["X-RateLimit-Limit"] = str(rate_limiter.max_requests_per_day)
        response.headers["X-RateLimit-Remaining"] = str(remaining)
    
    return response

# Include routers for different endpoints
app.include_router(trends.router)

# Mount static files (Vite build output)
dist_path = Path(__file__).parent.parent / "dist"
print(f"🔍 Looking for frontend build at: {dist_path}")
print(f"📁 Dist folder exists: {dist_path.exists()}")

if dist_path.exists():
    print("✅ Frontend build found - setting up static file serving")
    app.mount("/assets", StaticFiles(directory=str(dist_path / "assets")), name="assets")

    # Catch-all route to serve frontend (must be last)
    @app.get("/{path:path}")
    async def serve_frontend(path: str):
        """Serve the frontend for all non-API routes"""
        
        # Skip API routes, docs, and health checks
        if (path.startswith("api/") or 
            path.startswith("docs") or 
            path.startswith("redoc") or 
            path.startswith("openapi.json") or
            path == "health"):
            return JSONResponse(status_code=404, content={"error": "Not found"})
        
        # Serve index.html for all other routes (SPA routing)
        index_file = dist_path / "index.html"
        if index_file.exists():
            print(f"📄 Serving frontend: {path} -> index.html")
            return FileResponse(str(index_file))
        else:
            return JSONResponse(status_code=404, content={"error": "Frontend index.html not found"})

else:
    print("❌ Frontend build not found - serving API info at root")
    # If dist folder doesn't exist, show helpful message at root
    @app.get("/", tags=["Health"])
    async def root_no_frontend():
        """Root endpoint when frontend is not built."""
        return {
            "message": "🔮 Trend Compass API",
            "description": "AI-Powered Trend Forecasting & Audience Insights",
            "status": "active - frontend not built",
            "version": "1.0.0",
            "docs": "/docs",
            "note": "Run 'npm run build' to build the frontend",
            "build_path_checked": str(dist_path),
            "endpoints": {
                "trend_analysis": "/api/trends/analyze",
                "audience_insights": "/api/audience/analyze"
            }
        }

# Health check endpoints (available regardless of frontend build status)
@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint for service monitoring."""
    return {
        "status": "healthy",
        "service": "trend-compass-api",
        "version": "1.0.0"
    }

# API info endpoint
@app.get("/api", tags=["Health"])
async def api_info():
    """API information endpoint."""
    return {
        "message": "🔮 Trend Compass API",
        "description": "AI-Powered Trend Forecasting & Audience Insights",
        "status": "active",
        "version": "1.0.0",
        "docs": "/docs",
        "endpoints": {
            "trend_analysis": "/api/trends/analyze",
            "audience_insights": "/api/audience/analyze"
        }
    }

# Development endpoint to reset rate limits
@app.post("/api/reset-rate-limits", tags=["Development"])
async def reset_rate_limits():
    """Reset rate limits for development purposes."""
    try:
        rate_limiter.reset_all_limits()
        return {
            "status": "success",
            "message": "Rate limits have been reset. You now have 15 fresh requests.",
            "max_requests": rate_limiter.max_requests_per_day
        }
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={
                "status": "error",
                "message": f"Failed to reset rate limits: {str(e)}"
            }
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
