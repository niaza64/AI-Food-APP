"""
Flask Backend for Food Trends Tracker
Clean architecture with separated routes, services, and utilities
"""

from flask import Flask
from flask_cors import CORS

from backend.config import DEBUG, PORT, CORS_ORIGINS, validate_config
from backend.routes import health_bp, trends_bp, cache_bp
from backend.utils import register_error_handlers


def create_app():
    """Application factory pattern"""
    app = Flask(__name__)
    
    # CORS configuration
    CORS(app, resources={
        r"/api/*": {
            "origins": CORS_ORIGINS,
            "methods": ["GET", "POST", "OPTIONS"],
            "allow_headers": ["Content-Type"]
        }
    })
    
    # Register blueprints
    app.register_blueprint(health_bp, url_prefix='/api')
    app.register_blueprint(trends_bp, url_prefix='/api')
    app.register_blueprint(cache_bp, url_prefix='/api')
    
    # Register error handlers
    register_error_handlers(app)
    
    # Validate configuration on startup
    errors = validate_config()
    if errors:
        print("⚠️  Configuration Warnings:")
        for error in errors:
            print(f"   - {error}")
        print()
    
    return app


def main():
    """Main entry point"""
    app = create_app()
    
    print("=" * 60)
    print("🍔 Food Trends Tracker API")
    print("=" * 60)
    print(f"📍 Running on: http://localhost:{PORT}")
    print(f"🔗 Health check: http://localhost:{PORT}/api/health")
    print(f"🌐 Frontend: Open frontend in browser (after npm run dev)")
    print("=" * 60)
    print()
    
    app.run(
        debug=DEBUG,
        port=PORT,
        host='0.0.0.0'  # Allow external connections
    )


if __name__ == '__main__':
    main()
