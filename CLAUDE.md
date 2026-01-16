# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Korean stock information web application for stock market beginners. Displays real-time market indices (KOSPI, KOSDAQ, KRX100), sector-based stock browsing, and detailed stock information with news.

## Commands

```bash
npm run dev       # Start dev server at http://localhost:5173
npm run build     # TypeScript check + production build
npm run lint      # Run ESLint
npm run preview   # Preview production build
```

## Tech Stack

- React 19 + TypeScript + Vite (with SWC)
- React Router DOM 7 for routing
- Axios for API calls
- Tailwind CSS 4 for styling
- Recharts for charts (planned)

## Architecture

**Routing (App.tsx):**
- `/` → HomePage (market indices + sector list + stock list)
- `/stock/:stockCode` → StockDetailPage (stock details + news)

**API Layer (src/services/api.ts):**
- Axios instance with base URL from `REACT_APP_API_URL` (default: `http://localhost:8080/api`)
- Auto-attaches Bearer token from localStorage
- 401 responses clear token and redirect to login
- Types defined: `MarketIndex`, `Sector`, `Stock`, `News`

**Key Endpoints:**
- `GET /api/indices` - Market indices
- `GET /api/sectors` - Available sectors
- `GET /api/stocks` - Stock list (optional sector filter)
- `GET /api/stocks/:code` - Stock detail
- `GET /api/news` - News articles

**State Management:**
- React local state (useState/useEffect) per component
- No centralized store; components fetch data directly

## Project Structure

```
src/
├── components/      # Reusable components (IndexCard, SectorList, StockList, etc.)
├── pages/           # Page components (HomePage, StockDetailPage)
├── services/api.ts  # Axios config + API functions + types
├── App.tsx          # Route definitions
└── main.tsx         # Entry point with BrowserRouter
```

## Styling Conventions

- Component-specific CSS files alongside components
- Tailwind utilities for responsive design
- Color scheme: Red (#d32f2f) for price up, Blue (#1976d2) for price down
