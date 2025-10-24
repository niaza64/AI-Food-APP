# 📁 Project Structure

Complete overview of the restructured Food Trends Tracker application.

## 🎯 Overview

This project follows **clean architecture principles** with:
- ✅ Separation of concerns
- ✅ Modular code organization  
- ✅ Easy to test and maintain
- ✅ Clear dependencies
- ✅ Production-ready structure

## 📂 Directory Tree

```
food-tracking-using-ai/
│
├── 📁 backend/                    # Flask REST API
│   ├── 📁 config/                # Configuration management
│   │   ├── __init__.py          # Config exports
│   │   └── settings.py          # Environment & settings
│   │
│   ├── 📁 routes/                # API Endpoint Handlers
│   │   ├── __init__.py          # Route exports
│   │   ├── health.py            # Health check endpoint
│   │   ├── trends.py            # Trends collection/retrieval
│   │   └── cache.py             # Cache management
│   │
│   ├── 📁 services/              # Business Logic Layer
│   │   ├── __init__.py          # Service exports
│   │   ├── trends_service.py   # Trends collection logic
│   │   └── cache_service.py    # Cache operations
│   │
│   ├── 📁 utils/                 # Utilities & Helpers
│   │   ├── __init__.py          # Utils exports
│   │   └── error_handlers.py   # Error handling middleware
│   │
│   ├── __init__.py              # Backend package
│   ├── app.py                   # Application entry point
│   ├── requirements.txt         # Python dependencies
│   └── README.md                # Backend documentation
│
├── 📁 frontend/                  # Next.js React Frontend
│   ├── 📁 app/                  # Next.js App Router
│   │   ├── layout.tsx          # Root layout component
│   │   ├── page.tsx            # Home page
│   │   └── globals.css         # Global styles
│   │
│   ├── 📁 components/           # React Components
│   │   ├── TrendsList.tsx      # Trending foods display
│   │   ├── ProductIdeas.tsx    # AI ideas display
│   │   └── LoadingSpinner.tsx  # Loading state
│   │
│   ├── 📁 lib/                  # API & Utilities
│   │   └── api.ts              # Backend API client
│   │
│   ├── 📁 public/               # Static assets
│   │
│   ├── .eslintrc.json          # ESLint config
│   ├── .gitignore              # Git ignore rules
│   ├── env-local-example       # Environment template
│   ├── next.config.js          # Next.js config
│   ├── package.json            # Node dependencies
│   ├── postcss.config.mjs      # PostCSS config
│   ├── tailwind.config.ts      # Tailwind config
│   ├── tsconfig.json           # TypeScript config
│   └── README.md               # Frontend docs
│
├── 📁 google-sheets-version/    # Google Sheets Implementation
│   └── Code.gs                 # Apps Script code
│
├── 📁 cache/                    # Cache directory (generated)
│   └── trends_cache.json       # Cached trends data
│
├── 📁 venv/                     # Python virtual environment
│
├── 📄 food_trends_demo.py       # Core trends tracker
├── 📄 .gitignore                # Git ignore rules
├── 📄 env.example               # Environment template
├── 📄 README.md                 # Main documentation
├── 📄 SECURITY.md               # Security guidelines
├── 📄 PROJECT_STRUCTURE.md      # This file
└── 📄 requirements.txt          # Python dependencies
```

## 🏗️ Architecture Layers

### Backend Architecture

```
┌─────────────────────────────────────┐
│          app.py (Entry Point)       │
│  - Flask app creation               │
│  - Blueprint registration           │
│  - Error handler setup              │
└──────────────┬──────────────────────┘
               │
    ┌──────────┴──────────┐
    │                     │
    ▼                     ▼
┌─────────┐          ┌─────────┐
│ Routes  │          │ Config  │
│ Layer   │          │ Layer   │
└────┬────┘          └─────────┘
     │
     ▼
┌──────────────┐
│  Services    │
│   Layer      │
└──────────────┘
```

**Layer Responsibilities:**

1. **Routes** (`routes/`)
   - Handle HTTP requests/responses
   - Input validation
   - Call services
   - Format responses

2. **Services** (`services/`)
   - Business logic
   - Data processing
   - External API calls
   - No HTTP knowledge

3. **Config** (`config/`)
   - Environment variables
   - Settings management
   - Configuration validation

4. **Utils** (`utils/`)
   - Error handling
   - Shared utilities
   - Middleware

### Frontend Architecture

```
┌─────────────────────────────────────┐
│         app/page.tsx (Page)         │
│  - Main UI                          │
│  - State management                 │
│  - Event handlers                   │
└──────────────┬──────────────────────┘
               │
    ┌──────────┴──────────┐
    │                     │
    ▼                     ▼
┌─────────────┐     ┌──────────┐
│ Components  │     │   lib/   │
│  - Reusable │     │   api.ts │
│  - Focused  │     │  - HTTP  │
└─────────────┘     └──────────┘
```

**Component Responsibilities:**

1. **Pages** (`app/`)
   - Route handling
   - Layout structure
   - State management
   - Orchestration

2. **Components** (`components/`)
   - Reusable UI pieces
   - Single responsibility
   - Props-driven
   - Presentation logic

3. **Lib** (`lib/`)
   - API client
   - Data fetching
   - Utilities
   - Type definitions

## 🔄 Data Flow

### Collection Flow

```
User Click
    │
    ▼
Frontend (page.tsx)
    │
    ├─► lib/api.ts (collectTrends)
    │       │
    │       ▼
    │   POST /api/collect-trends
    │       │
    │       ▼
    ├─► Backend: routes/trends.py
    │       │
    │       ├─► services/cache_service.py (check cache)
    │       │
    │       ├─► services/trends_service.py (collect)
    │       │       │
    │       │       ├─► food_trends_demo.py (search Google)
    │       │       └─► food_trends_demo.py (AI analysis)
    │       │
    │       └─► services/cache_service.py (save)
    │
    ▼
Response to Frontend
    │
    ▼
Components Update (TrendsList, ProductIdeas)
```

## 📦 Key Files Explained

### Backend

| File | Purpose |
|------|---------|
| `backend/app.py` | Flask app factory, blueprint registration |
| `backend/config/settings.py` | Environment variables, configuration |
| `backend/routes/trends.py` | Trends API endpoints |
| `backend/services/trends_service.py` | Trends collection business logic |
| `backend/services/cache_service.py` | Cache management logic |
| `backend/utils/error_handlers.py` | Centralized error handling |

### Frontend

| File | Purpose |
|------|---------|
| `frontend/app/page.tsx` | Main application page |
| `frontend/lib/api.ts` | API client with typed functions |
| `frontend/components/TrendsList.tsx` | Display trending foods |
| `frontend/components/ProductIdeas.tsx` | Display AI insights |
| `frontend/app/globals.css` | Global styles with Tailwind |

## 🎨 Design Patterns Used

### Backend

1. **Blueprint Pattern**
   - Modular route organization
   - Namespace isolation
   - Easy to scale

2. **Service Layer Pattern**
   - Business logic separation
   - Reusable services
   - Easy to test

3. **Repository Pattern** (Cache Service)
   - Data access abstraction
   - Consistent interface
   - Easy to swap storage

4. **Factory Pattern** (create_app)
   - Application creation
   - Configuration injection
   - Testing flexibility

### Frontend

1. **Component Composition**
   - Small, focused components
   - Reusability
   - Maintainability

2. **Custom Hooks** (implicit)
   - useState, useEffect
   - Logic reuse
   - Clean components

3. **API Client Pattern**
   - Centralized API calls
   - Type safety
   - Error handling

## 🚀 Benefits of This Structure

### For Development

✅ **Easy to Navigate**
   - Clear folder structure
   - Logical organization
   - Quick to find code

✅ **Easy to Test**
   - Separated concerns
   - Mock-friendly
   - Unit testable

✅ **Easy to Scale**
   - Add new routes easily
   - Add new services easily
   - Add new components easily

### For Deployment

✅ **Containerization Ready**
   - Separate frontend/backend
   - Independent scaling
   - Docker-friendly

✅ **IaC Ready**
   - Clear boundaries
   - Easy to provision
   - Stateless design

✅ **Production Ready**
   - Error handling
   - Configuration management
   - Security best practices

## 📚 Adding New Features

### Add Backend Route

1. Create route handler in `backend/routes/`
2. Register blueprint in `backend/app.py`
3. Add business logic in `backend/services/`

```python
# backend/routes/new_feature.py
from flask import Blueprint
new_bp = Blueprint('new_feature', __name__)

@new_bp.route('/new-endpoint')
def new_endpoint():
    # Implementation
    pass
```

### Add Frontend Component

1. Create component in `frontend/components/`
2. Import and use in page
3. Add API call if needed in `lib/api.ts`

```typescript
// components/NewComponent.tsx
export default function NewComponent() {
  return <div>New Feature</div>
}
```

### Add Service

1. Create service in `backend/services/`
2. Export in `backend/services/__init__.py`
3. Use in routes

```python
# backend/services/new_service.py
class NewService:
    def do_something(self):
        # Implementation
        pass
```

## 🎯 Best Practices Followed

✅ Separation of concerns
✅ Single responsibility principle
✅ DRY (Don't Repeat Yourself)
✅ Type safety (TypeScript)
✅ Error handling
✅ Documentation
✅ Environment configuration
✅ Security best practices

---

**This structure is production-ready and follows industry best practices!**

