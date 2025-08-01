"""
WSGI module for the your_application package.
This is what 'gunicorn your_application.wsgi' will import.
"""

import os
import sys
from pathlib import Path

def get_wsgi_application():
    """Return the WSGI application for our FastAPI app"""
    
    # Get the project root (parent of your_application directory)
    project_root = Path(__file__).parent.parent
    backend_path = project_root / 'backend'
    
    # Add backend to Python path
    sys.path.insert(0, str(backend_path))
    
    # Change to backend directory  
    os.chdir(str(backend_path))
    
    try:
        # Import FastAPI app
        from main import app as fastapi_app
        
        # Since Render expects WSGI but we have ASGI (FastAPI),
        # we'll run uvicorn programmatically instead
        print("🚀 Starting FastAPI with uvicorn...")
        
        import uvicorn
        port = int(os.environ.get('PORT', 8000))
        
        # This will start the server
        uvicorn.run(
            fastapi_app, 
            host="0.0.0.0", 
            port=port,
            log_level="info"
        )
        
        # This line should never be reached, but just in case:
        return lambda environ, start_response: []
        
    except Exception as e:
        print(f"❌ Error starting FastAPI: {e}")
        import traceback
        traceback.print_exc()
        
        # Return an error WSGI app
        def error_app(environ, start_response):
            status = '500 Internal Server Error'
            headers = [('Content-type', 'text/html')]
            start_response(status, headers)
            return [f'<h1>Server Error</h1><p>Error: {e}</p>'.encode('utf-8')]
        
        return error_app

# This is what gunicorn will look for
application = get_wsgi_application()
