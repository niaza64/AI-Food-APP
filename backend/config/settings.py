"""
Configuration settings for the application
"""
import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Base directory
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# API Keys
GROQ_API_KEY = os.getenv('GROQ_API_KEY')
SERPAPI_KEY = os.getenv('SERPAPI_KEY')

# Flask Configuration
FLASK_ENV = os.getenv('FLASK_ENV', 'development')
DEBUG = FLASK_ENV == 'development'
PORT = int(os.getenv('PORT', 5001))

# CORS Configuration
CORS_ORIGINS = os.getenv('CORS_ORIGINS', '*')

# Cache Configuration
CACHE_DIR = BASE_DIR / 'cache'
CACHE_DIR.mkdir(exist_ok=True)
CACHE_FILE = CACHE_DIR / 'trends_cache.json'

# API Configuration
API_TIMEOUT = 120  # seconds
REQUEST_TIMEOUT = 30  # seconds

# Validation
def validate_config():
    """Validate required configuration"""
    errors = []
    
    if not GROQ_API_KEY:
        errors.append("GROQ_API_KEY is not set. Get one at: https://console.groq.com")
    
    if not SERPAPI_KEY:
        errors.append("SERPAPI_KEY is not set. Get one at: https://serpapi.com/users/sign_up")
    
    return errors

def get_config():
    """Get all configuration as a dictionary"""
    return {
        'flask_env': FLASK_ENV,
        'debug': DEBUG,
        'port': PORT,
        'cache_dir': str(CACHE_DIR),
        'api_timeout': API_TIMEOUT,
    }

