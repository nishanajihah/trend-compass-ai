#!/usr/bin/env python3
"""
Render deployment script for Trend Compass
This script handles the startup process for Render deployment
"""

import os
import sys
import subprocess

def main():
    """Main deployment function"""
    print("🚀 Starting Trend Compass on Render...")
    
    # Change to backend directory
    backend_path = os.path.join(os.path.dirname(__file__), 'backend')
    os.chdir(backend_path)
    print(f"📁 Changed directory to: {os.getcwd()}")
    
    # Get port from environment (Render sets this)
    port = os.environ.get('PORT', '8000')
    print(f"🌐 Starting server on port: {port}")
    
    # Start the FastAPI server with gunicorn for production
    cmd = [
        'gunicorn', 
        '-w', '4',  # 4 worker processes
        '-k', 'uvicorn.workers.UvicornWorker',  # Use uvicorn workers
        'main:app', 
        '--bind', f'0.0.0.0:{port}'
    ]
    
    print(f"🔧 Running command: {' '.join(cmd)}")
    subprocess.run(cmd)

if __name__ == "__main__":
    main()
