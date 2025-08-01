#!/usr/bin/env python3
"""
Simple WSGI runner for Render deployment
This bypasses Render's auto-detection and runs our FastAPI app directly
"""

import os
import sys
import subprocess
from pathlib import Path

def main():
    print("🚀 Starting Trend Compass FastAPI server...")
    
    # Change to backend directory
    root_dir = Path(__file__).parent
    backend_dir = root_dir / 'backend'
    
    print(f"📁 Root directory: {root_dir}")
    print(f"📁 Backend directory: {backend_dir}")
    print(f"📁 Backend exists: {backend_dir.exists()}")
    
    if backend_dir.exists():
        os.chdir(str(backend_dir))
        print(f"📁 Changed to: {os.getcwd()}")
    else:
        print("❌ Backend directory not found!")
        sys.exit(1)
    
    # Get port from environment
    port = os.environ.get('PORT', '8000')
    print(f"🌐 Using port: {port}")
    
    # Run with gunicorn for production
    cmd = [
        'gunicorn',
        '-w', '4',
        '-k', 'uvicorn.workers.UvicornWorker',
        'main:app',
        '--bind', f'0.0.0.0:{port}',
        '--timeout', '120',
        '--max-requests', '1000',
        '--max-requests-jitter', '50'
    ]
    
    print(f"🔧 Running command: {' '.join(cmd)}")
    
    try:
        subprocess.run(cmd, check=True)
    except subprocess.CalledProcessError as e:
        print(f"❌ Server failed to start: {e}")
        print("🔄 Trying with uvicorn as fallback...")
        
        # Fallback to uvicorn
        fallback_cmd = [
            sys.executable, '-m', 'uvicorn',
            'main:app',
            '--host', '0.0.0.0',
            '--port', port
        ]
        print(f"🔧 Fallback command: {' '.join(fallback_cmd)}")
        subprocess.run(fallback_cmd)

if __name__ == '__main__':
    main()
