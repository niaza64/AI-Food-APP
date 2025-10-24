"""
Trends routes for collecting and retrieving food trends
"""
from flask import Blueprint, jsonify, request
import traceback

from backend.services import TrendsService, CacheService

trends_bp = Blueprint('trends', __name__)

# Service instances
trends_service = TrendsService()
cache_service = CacheService()

# In-memory storage for latest report
latest_report = None


@trends_bp.route('/collect-trends', methods=['POST'])
def collect_trends():
    """
    Collect and analyze trends - returns both raw data and AI insights
    """
    global latest_report
    
    try:
        # Get request parameters
        data = request.get_json(silent=True) or {}
        force_refresh = data.get('force_refresh', False)
        keywords = data.get('keywords', None)
        
        # Try to load from cache first (if not forcing refresh)
        if not force_refresh:
            cached_data = cache_service.load()
            if cached_data:
                latest_report = cached_data['data']
                print("✅ Using cached data")
                return jsonify({
                    'success': True,
                    'cached': True,
                    'raw_data': latest_report['raw_data'],
                    'ai_insights': latest_report['ai_insights'],
                    'trending_foods': latest_report.get('trending_foods', []),
                    'data_collected': len(latest_report['raw_data']),
                    'report_date': latest_report['report_date'],
                    'cache_date': cached_data['timestamp']
                })
        
        # Validate API keys
        validation = trends_service.validate_api_keys()
        if not validation['valid']:
            return jsonify({
                'success': False,
                'error': validation['error']
            }), 400
        
        # Collect new trends data
        report = trends_service.collect_trends(keywords)
        
        # Store in memory
        latest_report = report
        
        # Save to cache
        cache_service.save(report)
        
        return jsonify({
            'success': True,
            'cached': False,
            'raw_data': report['raw_data'],
            'trending_foods': report['trending_foods'],
            'ai_insights': report['ai_insights'],
            'data_collected': len(report['raw_data']),
            'report_date': report['report_date']
        })
    
    except Exception as e:
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@trends_bp.route('/latest-report', methods=['GET'])
def get_latest_report():
    """Get the latest generated report with both raw data and AI insights"""
    global latest_report
    
    # Try to load from cache if not in memory
    if not latest_report:
        cached_data = cache_service.load()
        if cached_data:
            latest_report = cached_data['data']
    
    if latest_report:
        return jsonify({
            'success': True,
            'raw_data': latest_report.get('raw_data', []),
            'trending_foods': latest_report.get('trending_foods', []),
            'ai_insights': latest_report.get('ai_insights', {}),
            'report_date': latest_report.get('report_date')
        })
    else:
        return jsonify({
            'success': False,
            'message': 'No report available. Please run collection first.'
        }), 404


@trends_bp.route('/trends', methods=['GET'])
def get_trends():
    """Get just the AI-generated trends from latest report"""
    global latest_report
    
    # Try to load from cache if not in memory
    if not latest_report:
        cached_data = cache_service.load()
        if cached_data:
            latest_report = cached_data['data']
    
    if latest_report and 'ai_insights' in latest_report:
        ai_insights = latest_report['ai_insights']
        return jsonify({
            'success': True,
            'trends': ai_insights.get('trends', []),
            'trending_foods': latest_report.get('trending_foods', []),
            'report_date': latest_report.get('report_date')
        })
    else:
        return jsonify({
            'success': False,
            'message': 'No trends available'
        }), 404

