# Food Trends Tracker - Next.js Frontend

Modern, clean React frontend built with Next.js 14 and TypeScript.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.local.example .env.local

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

## 📁 Project Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── TrendsList.tsx    # Display trending foods
│   ├── ProductIdeas.tsx  # Display AI-generated ideas
│   └── LoadingSpinner.tsx # Loading state
├── lib/                   # Utilities
│   └── api.ts            # API client
├── public/               # Static assets
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
├── tailwind.config.ts    # Tailwind CSS config
└── next.config.js        # Next.js config
```

## 🎨 Features

- **Modern UI**: Built with Tailwind CSS
- **TypeScript**: Full type safety
- **Responsive**: Mobile-first design
- **Real-time Updates**: Live data from backend API
- **Cache Management**: Smart caching with status display
- **Error Handling**: User-friendly error messages

## 🔌 API Integration

The frontend connects to the Flask backend at `http://localhost:5001` (configurable via `.env.local`)

### Available Endpoints

- `GET /api/health` - Health check
- `POST /api/collect-trends` - Collect new trends
- `GET /api/trends` - Get trends data
- `GET /api/cache/status` - Get cache status

## 🛠️ Development

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 📦 Building for Production

```bash
npm run build
npm start
```

## 🐳 Docker Support

See main project README for Docker deployment instructions.

## 🔧 Configuration

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5001
```

For production, use environment variables or update `next.config.js`.

