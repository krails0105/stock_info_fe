# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Korean stock information web application for stock market beginners. Displays real-time market indices (KOSPI, KOSDAQ, KRX100), sector-based stock browsing, and detailed stock information with financial metrics.

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
- `/` → HomePage (market indices + sector list)
- `/sector/:sectorName` → SectorDetailPage (sector stocks)
- `/stock/:stockCode` → StockDetailPage (financial metrics)

**API Layer (src/services/api.ts):**
- Axios instance with base URL from `VITE_API_URL` (default: `http://localhost:8080/api`)
- Auto-attaches Bearer token from localStorage
- 401 responses clear token and redirect to login

**Key API Functions:**
- `getMarketSummary()` - Market indices (KOSPI, KOSDAQ, etc.)
- `getSectorScoreboard()` - Sector list with scores
- `getStockScoreboard(sectorName)` - Stocks by sector
- `getStockDetail(code)` - Stock financial metrics (KrxStockFinancialItem)
- `getNews(params)` - News articles

**State Management:**
- React local state (useState/useEffect) per component
- No centralized store; components fetch data directly

## Project Structure

```
src/
├── components/      # Reusable components
│   ├── MarketSummaryBar.tsx   # Market indices display
│   ├── SectorCard.tsx         # Sector score card
│   ├── SectorListGrid.tsx     # Sector grid layout
│   ├── StockRankingTable.tsx  # Stock list table
│   └── ScoreBadge.tsx         # Score label component
├── pages/
│   ├── HomePage.tsx           # Main page
│   ├── SectorDetailPage.tsx   # Sector stocks page
│   └── StockDetailPage.tsx    # Stock financial metrics page
├── services/api.ts  # Axios config + API functions
├── types/index.ts   # TypeScript type definitions
├── mocks/data.ts    # Mock data for development
├── App.tsx          # Route definitions
└── main.tsx         # Entry point with BrowserRouter
```

## Key Types (src/types/index.ts)

**StockDetail (KrxStockFinancialItem 기반):**
- 기본 정보: stockCode, stockName, closingPrice, priceChange, changeRate
- 수익 지표: eps, per, forwardEps, forwardPer
- 자산 지표: bps, pbr
- 배당 정보: dividendPerShare, dividendYield

**StockScore:** 종목 점수 정보 (score, label, reasons)
**SectorScore:** 섹터 점수 정보

## Styling Conventions

- Component-specific CSS files alongside components
- Consistent card style: `border-radius: 12px`, `box-shadow: 0 1px 3px rgba(0,0,0,0.08)`
- Hover effect: `transform: translateY(-2px)`
- Color scheme: Red (#dc2626) for price up, Blue (#2563eb) for price down

## 작업 완료 체크리스트

작업 완료 시 아래 순서대로 진행:

1. **린트 및 커밋**
   ```bash
   npm run lint
   git add .
   git commit -m "feat: 작업 내용"
   git push
   ```

2. **문서 업데이트**
   - `../docs/PROGRESS.md` 작업 내역 추가
   - 필요시 이 파일(CLAUDE.md) 업데이트

3. **PR 생성** (feature 브랜치인 경우)
   ```bash
   gh pr create --title "제목" --body "## Summary\n- 내용"
   ```
