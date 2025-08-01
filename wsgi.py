"""
WSGI module that Render is specifically looking for.
This will be imported as your_application.wsgi
"""

from your_application import application

# This is what gunicorn your_application.wsgi will import
__all__ = ['application']
