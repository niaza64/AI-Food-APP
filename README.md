# 🍔 Food Trends Tracker

AI-powered food trends analysis system that discovers trending foods from Google and generates innovative product ideas using AI.

## 🌟 Features

- **Automated Trend Discovery**: Searches Google for trending food products and flavors
- **AI-Powered Analysis**: Uses Groq AI to generate product innovation ideas
- **Modern Tech Stack**: Next.js frontend + Flask backend
- **Clean Architecture**: Separated routes, services, and utilities
- **Smart Caching**: Avoids redundant API calls
- **Real-time Updates**: Live data collection and analysis

## 🏗️ Project Structure

```
food-tracking-using-ai/
├── backend/                    # Flask REST API
│   ├── config/                # Configuration & settings
│   ├── routes/                # API endpoint handlers
│   ├── services/              # Business logic layer
│   ├── utils/                 # Utilities & error handlers
│   ├── app.py                 # Application entry point
│   └── requirements.txt       # Python dependencies
├── frontend/                  # Next.js React frontend
│   ├── app/                   # Next.js pages & layouts
│   ├── components/            # React components
│   ├── lib/                   # API client & utilities
│   ├── public/                # Static assets
│   └── package.json           # Node dependencies
├── google-sheets-version/     # Google Sheets implementation
├── food_trends_demo.py        # Core trends tracker logic
├── env.example                # Environment variables template
└── README.md                  # This file
```

## 🚀 Quick Start

### Prerequisites

- Python 3.9+
- Node.js 18+
- Free API Keys:
  - [Groq API](https://console.groq.com) - Free AI inference
  - [SERP API](https://serpapi.com/users/sign_up) - 100 free searches/month

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd food-tracking-using-ai
```

### 2. Setup Environment Variables

```bash
# Copy environment template
cp env.example .env

# Edit .env and add your API keys
nano .env  # or use your preferred editor
```

```env
GROQ_API_KEY=your_groq_api_key_here
SERPAPI_KEY=your_serpapi_key_here
```

### 3. Start Backend

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start Flask server
cd backend
python app.py
```

Backend runs at: `http://localhost:5001`

### 4. Start Frontend

```bash
# In a new terminal
cd frontend

# Install dependencies
npm install

# Copy frontend environment file
cp env-local-example .env.local

# Start development server
npm run dev
```

Frontend runs at: `http://localhost:3000`

### 5. Use the Application

1. Open `http://localhost:3000` in your browser
2. Click "🔍 Discover Trends" button
3. Wait 45-60 seconds for analysis
4. View trending foods and AI-generated product ideas!

## 📖 API Documentation

### Backend Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/collect-trends` | POST | Collect new trends data |
| `/api/trends` | GET | Get trending foods and AI insights |
| `/api/latest-report` | GET | Get complete report |
| `/api/cache/status` | GET | Get cache status |
| `/api/cache/clear` | POST | Clear cached data |

See [backend/README.md](backend/README.md) for detailed API documentation.

**Note:** The old vanilla JavaScript frontend has been removed. We now use only Next.js with TypeScript.

## 🏛️ Architecture

### Backend (Flask)

**Clean Architecture Pattern:**

```
┌─────────────┐
│   Routes    │  ← HTTP Request/Response handling
├─────────────┤
│  Services   │  ← Business logic & data processing
├─────────────┤
│   Config    │  ← Configuration & settings
├─────────────┤
│   Utils     │  ← Error handling & utilities
└─────────────┘
```

**Key Principles:**
- Separation of concerns
- Dependency injection
- Single responsibility
- Easy to test

### Frontend (Next.js)

**Component-Based Architecture:**

```
┌──────────────┐
│   Pages      │  ← Next.js routes
├──────────────┤
│  Components  │  ← Reusable UI components
├──────────────┤
│     Lib      │  ← API client & utilities
└──────────────┘
```

**Features:**
- TypeScript for type safety
- Tailwind CSS for styling
- Axios for API calls
- Client-side state management

## 🛠️ Development

### Backend Development

```bash
cd backend

# Run with hot reload
FLASK_ENV=development python app.py

# Add new route
# 1. Create in backend/routes/
# 2. Register in backend/app.py
# 3. Add service logic in backend/services/
```

### Frontend Development

```bash
cd frontend

# Development mode
npm run dev

# Build for production
npm run build

# Run production build
npm start
```

### Code Style

**Backend (Python):**
- Follow PEP 8
- Use type hints
- Document with docstrings
- Keep functions small

**Frontend (TypeScript):**
- Follow ESLint rules
- Use TypeScript types
- Component-based structure
- Functional components with hooks

## 🧪 Testing

### Test Backend

```bash
# Health check
curl http://localhost:5001/api/health

# Collect trends
curl -X POST http://localhost:5001/api/collect-trends \
  -H "Content-Type: application/json" \
  -d '{"force_refresh": false}'

# Get trends
curl http://localhost:5001/api/trends
```

### Test Frontend

1. Start both backend and frontend
2. Open `http://localhost:3000`
3. Click "Discover Trends"
4. Verify data appears

## 📦 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for Infrastructure as Code deployment instructions.

## 🔒 Security

- ✅ Environment variables for secrets
- ✅ No hardcoded API keys
- ✅ `.env` in `.gitignore`
- ✅ CORS properly configured
- ✅ Error messages sanitized

See [SECURITY.md](SECURITY.md) for detailed security guidelines.

## 📁 Additional Features

### Google Sheets Version

A complete standalone implementation for Google Sheets:

```bash
cd google-sheets-version/
# See Code.gs for implementation
```

Features:
- Custom menu in Google Sheets
- Automated daily reports
- Email notifications
- No server required!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Follow code style guidelines
5. Test your changes
6. Submit a pull request

## 📝 License

[Your License Here]

## 🙏 Acknowledgments

- **Groq** - Fast AI inference
- **SERP API** - Google Search data
- **Next.js** - React framework
- **Flask** - Python web framework

## 📞 Support

For issues and questions:
1. Check [backend/README.md](backend/README.md)
2. Check [frontend/README.md](frontend/README.md)
3. Review [SECURITY.md](SECURITY.md)
4. Open an issue on GitHub

---

**Built with ❤️ for food innovation**
