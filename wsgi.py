"""
WSGI config for trend-compass project.
This file is specifically named to work with Render's auto-detection.
"""

import os
import sys
from pathlib import Path

# Get the directory containing this file
BASE_DIR = Path(__file__).parent

# Add the backend directory to Python path
backend_dir = BASE_DIR / 'backend'
sys.path.insert(0, str(backend_dir))

# Change working directory to backend
os.chdir(str(backend_dir))

# Import the FastAPI app from backend/main.py
try:
    from main import app
    # This is what gunicorn will look for
    application = app
except ImportError as e:
    print(f"Error importing FastAPI app: {e}")
    print(f"Current working directory: {os.getcwd()}")
    print(f"Python path: {sys.path}")
    raise
