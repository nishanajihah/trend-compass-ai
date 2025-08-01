"""
This is the file that Render's auto-detection is looking for.
It will import our actual FastAPI app.
"""

import os
import sys
from pathlib import Path

# Get the project root directory
project_root = Path(__file__).parent

# Add backend to Python path
backend_path = project_root / 'backend'
sys.path.insert(0, str(backend_path))

# Change to backend directory
os.chdir(str(backend_path))

# Import the FastAPI app
try:
    from main import app as fastapi_app
    
    # Create a simple WSGI adapter for FastAPI
    def application(environ, start_response):
        """
        WSGI adapter that works with FastAPI
        """
        # For WSGI compatibility, we'll use uvicorn's ASGI-to-WSGI adapter
        from uvicorn.middleware.wsgi import WSGIMiddleware
        from uvicorn._types import ASGIApplication
        
        # Convert FastAPI (ASGI) to WSGI
        wsgi_app = WSGIMiddleware(fastapi_app)
        return wsgi_app(environ, start_response)

except ImportError as e:
    print(f"Error importing FastAPI app: {e}")
    print(f"Current working directory: {os.getcwd()}")
    print(f"Backend path: {backend_path}")
    print(f"Backend exists: {backend_path.exists()}")
    
    # Create a fallback WSGI app that shows the error
    def application(environ, start_response):
        status = '500 Internal Server Error'
        headers = [('Content-type', 'text/plain')]
        start_response(status, headers)
        return [f'Error importing FastAPI app: {e}'.encode('utf-8')]
