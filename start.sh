#!/bin/bash
# Render startup script
cd backend
python -m uvicorn main:app --host 0.0.0.0 --port $PORT
