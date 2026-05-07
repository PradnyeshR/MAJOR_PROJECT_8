import sys
import os

# Add the 'backend' directory to the Python path
# so absolute imports like 'from app.database...' work on Vercel.
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

from app.main import app

# Vercel will look for this app object inside api/index.py
