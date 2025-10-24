"""Routes module"""
from .health import health_bp
from .trends import trends_bp
from .cache import cache_bp

__all__ = ['health_bp', 'trends_bp', 'cache_bp']

