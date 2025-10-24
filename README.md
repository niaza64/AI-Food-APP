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
