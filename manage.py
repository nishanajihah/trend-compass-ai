#!/usr/bin/env python
"""
Fake manage.py to make Render think this is a Django project,
but actually runs FastAPI instead.
"""

import os
import sys
import subprocess
from pathlib import Path

def main():
    """Run the FastAPI server instead of Django"""
    
    # Change to backend directory
    backend_dir = Path(__file__).parent / 'backend'
    os.chdir(str(backend_dir))
    
    # Get port from environment
    port = os.environ.get('PORT', '8000')
    
    # If this is being called with runserver (Render's detection), run FastAPI instead
    if len(sys.argv) > 1 and 'runserver' in sys.argv[1]:
        print("🚀 Detected Django runserver command, starting FastAPI instead...")
        cmd = [
            sys.executable, '-m', 'uvicorn', 
            'main:app', 
            '--host', '0.0.0.0', 
            '--port', port
        ]
    else:
        # For any other command, just run uvicorn
        cmd = [
            sys.executable, '-m', 'uvicorn', 
            'main:app', 
            '--host', '0.0.0.0', 
            '--port', port
        ]
    
    print(f"🔧 Running: {' '.join(cmd)}")
    subprocess.run(cmd)

if __name__ == '__main__':
    main()
