# Food Trends Tracker - Backend API

Flask REST API for food trends analysis with clean architecture.

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- pip

### Installation

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file (from project root)
cp ../env.example ../.env

# Add your API keys to ../.env
# GROQ_API_KEY=your_key_here
# SERPAPI_KEY=your_key_here

# Run the server
python app.py
```

The API will be available at `http://localhost:5001`

## 📁 Project Structure

```
backend/
├── config/              # Configuration
│   ├── __init__.py
│   └── settings.py     # Settings and env vars
├── routes/             # API endpoints
│   ├── __init__.py
│   ├── health.py      # Health check
│   ├── trends.py      # Trends collection & retrieval
│   └── cache.py       # Cache management
├── services/          # Business logic
│   ├── __init__.py
│   ├── trends_service.py  # Trends collection
│   └── cache_service.py   # Cache operations
├── utils/             # Utilities
│   ├── __init__.py
│   └── error_handlers.py  # Error handling
├── app.py            # Application entry point
└── requirements.txt  # Python dependencies
```

## 🏗️ Architecture

### Clean Architecture Principles

1. **Separation of Concerns**
   - Routes handle HTTP requests/responses
   - Services contain business logic
   - Config manages settings
   - Utils provide cross-cutting concerns

2. **Dependency Injection**
   - Services are instantiated in routes
   - Easy to test and mock

3. **Error Handling**
   - Centralized error handlers
   - Consistent error responses

## 🔌 API Endpoints

### Health

```http
GET /api/health
```

Returns API health status.

### Trends Collection

```http
POST /api/collect-trends
Content-Type: application/json

{
  "force_refresh": false,
  "keywords": ["optional", "custom", "keywords"]
}
```

Collects trending foods and generates AI insights.

### Get Trends

```http
GET /api/trends
```

Returns the latest trends and AI-generated product ideas.

### Get Latest Report

```http
GET /api/latest-report
```

Returns complete report with raw data and insights.

### Cache Status

```http
GET /api/cache/status
```

Returns cache status and metadata.

### Clear Cache

```http
POST /api/cache/clear
```

Clears the cached data.

## ⚙️ Configuration

Configuration is managed through environment variables:

```bash
# API Keys (Required)
GROQ_API_KEY=your_groq_key
SERPAPI_KEY=your_serpapi_key

# Server Config (Optional)
FLASK_ENV=development
PORT=5001
CORS_ORIGINS=*
```

## 🧪 Testing

```bash
# Test health endpoint
curl http://localhost:5001/api/health

# Test trends collection
curl -X POST http://localhost:5001/api/collect-trends \
  -H "Content-Type: application/json" \
  -d '{"force_refresh": false}'
```

## 🐳 Docker Support

See main project README for Docker deployment.

## 📝 Code Style

- Follow PEP 8
- Use type hints where applicable
- Document functions with docstrings
- Keep functions small and focused

## 🔒 Security

- Never commit `.env` files
- API keys are loaded from environment
- CORS is configured appropriately
- Error messages don't expose sensitive data

