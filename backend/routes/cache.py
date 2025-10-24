"""
Cache management routes
"""
from flask import Blueprint, jsonify

from backend.services import CacheService

cache_bp = Blueprint('cache', __name__)

# Service instance
cache_service = CacheService()


@cache_bp.route('/cache/status', methods=['GET'])
def cache_status():
    """Get cache status"""
    status = cache_service.get_status()
    return jsonify(status)


@cache_bp.route('/cache/clear', methods=['POST'])
def clear_cache():
    """Clear cache file"""
    try:
        success = cache_service.clear()
        if success:
            return jsonify({
                'success': True,
                'message': 'Cache cleared successfully'
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Failed to clear cache'
            }), 500
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

