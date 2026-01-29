// src/types/index.ts
// ============================================================
// 📌 타입 정의 파일
//
// TypeScript에서 "타입"이란?
// - 변수나 함수가 어떤 형태의 데이터를 다루는지 미리 정의하는 것
// - 컴파일 시점에 오류를 잡아주어 버그를 줄여줍니다
// - 코드 자동완성도 더 잘 됩니다!
// ============================================================

// ------------------------------------------------------------
// 📊 시장 지수 요약 타입
// ------------------------------------------------------------
// 'interface'는 객체의 구조(형태)를 정의합니다.
// 이 타입을 사용하는 변수는 반드시 이 구조를 따라야 합니다.
export interface MarketSummary {
  name: string;           // 지수명 (예: "KOSPI", "NASDAQ")
  value: number;          // 현재 값 (예: 2650.28)
  change: number;         // 등락폭 (예: 15.32 또는 -8.45)
  changePercent: number;  // 등락률 % (예: 0.58)
  sparkline?: number[];   // 미니차트용 데이터. '?'는 선택적 속성 (없어도 됨)
}

// ------------------------------------------------------------
// 🏷️ 점수 라벨 타입
// ------------------------------------------------------------
// 'type'은 타입에 별명을 붙이는 것입니다.
// 유니온 타입 (|): "이 중 하나"라는 의미
// ScoreLabel은 'STRONG', 'NEUTRAL', 'WEAK' 중 하나만 가능합니다.
export type ScoreLabel = 'STRONG' | 'NEUTRAL' | 'WEAK';

// ------------------------------------------------------------
// 📰 뉴스 헤드라인 타입
// ------------------------------------------------------------
export interface NewsItem {
  title: string;        // 뉴스 제목
  url: string;          // 뉴스 링크
  provider?: string;    // 언론사 (선택)
  publishedAt?: string; // 발행일 (선택)
  summary?: string;     // AI 요약 (선택, 추후 확장용)
}

// ------------------------------------------------------------
// 📈 섹터 점수 타입
// ------------------------------------------------------------
// 백엔드 API 응답 형식에 맞춤
export interface SectorScore {
  sectorId: string;         // 섹터 고유 ID
  sectorName: string;       // 섹터명 (예: "기술주", "바이오")
  score: number;            // 점수 0~100
  label: ScoreLabel;        // 라벨: STRONG/NEUTRAL/WEAK
  weekReturn?: string;      // 1주 수익률 (예: "+4.2%")
  volumeChange?: string;    // 거래량 변화 (예: "+28%")
  risingStockRatio?: number; // 상승 종목 비율 (예: 65)
  reasons: string[];        // 이유 3줄 (배열)
  stockCount?: number;      // 섹터 내 종목 수
  headlines?: NewsItem[];   // 관련 뉴스 (프론트엔드용, 백엔드에서 없으면 빈 배열)
}

// ------------------------------------------------------------
// 📊 섹터 스코어보드 응답 타입
// ------------------------------------------------------------
// API 응답 전체의 형태를 정의
export interface SectorScoreboardResponse {
  updatedAt: string;        // 데이터 갱신 시각
  sectors: SectorScore[];   // 섹터 배열. SectorScore[] = SectorScore의 배열
}

// ------------------------------------------------------------
// 📉 종목 점수 타입
// ------------------------------------------------------------
// 백엔드 API 응답 형식:
// {
//   "code": "000210",
//   "name": "DL",
//   "score": 43,
//   "label": "NEUTRAL",
//   "price": 36450,
//   "changeRate": "-0.68%",
//   "market": "KOSPI",
//   "sectorName": "화학"
// }
export interface StockScore {
  code: string;             // 종목 코드 (예: "005930")
  name: string;             // 종목명 (예: "삼성전자")
  score: number;            // 점수 0~100
  label: ScoreLabel;        // 라벨: STRONG/NEUTRAL/WEAK
  price: number;            // 현재가
  changeRate: string;       // 등락률 문자열 (예: "-0.68%", "+2.5%")
  market: string;           // 시장 (예: "KOSPI", "KOSDAQ")
  sectorName: string;       // 소속 섹터명

  // 선택적 속성들 (상세 페이지에서 사용)
  sectorId?: string;        // 소속 섹터 ID
  reasons?: string[];       // 이유 3줄
  per?: number;             // PER (주가수익비율)
  pbr?: number;             // PBR (주가순자산비율)
  headlines?: NewsItem[];   // 관련 뉴스
}

// ------------------------------------------------------------
// 📋 종목 스코어보드 응답 타입
// ------------------------------------------------------------
export interface StockScoreboardResponse {
  sectorName: string;       // 섹터명
  updatedAt: string;        // 갱신 시각
  stocks: StockScore[];     // 종목 배열
}

// ------------------------------------------------------------
// 📝 종목 상세 정보 타입 (KrxStockFinancialItem 기반)
// ------------------------------------------------------------
// 백엔드 KrxStockFinancialItem DTO와 1:1 매핑
// KRX(한국거래소) CSV 다운로드 API 응답 형식
// [CSV 컬럼] 종목코드,종목명,종가,대비,등락률,EPS,PER,선행EPS,선행PER,BPS,PBR,주당배당금,배당수익률
export interface StockDetail {
  // === 기본 정보 ===
  stockCode: string;        // 종목코드 (예: "005930")
  stockName: string;        // 종목명 (예: "삼성전자")
  closingPrice: number;     // 종가 (단위: 원)
  priceChange: number;      // 대비 (전일 대비 가격 변동, 단위: 원)
  changeRate: number;       // 등락률 (%, 예: 2.5, -1.3)

  // === 수익 지표 ===
  eps: number;              // EPS - 주당순이익 (Earnings Per Share, 단위: 원)
  per: number;              // PER - 주가수익비율 (Price Earnings Ratio)
  forwardEps: number;       // 선행 EPS - 예상 주당순이익 (Forward EPS, 단위: 원)
  forwardPer: number;       // 선행 PER - 예상 주가수익비율 (Forward PER)

  // === 자산 지표 ===
  bps: number;              // BPS - 주당순자산 (Book-value Per Share, 단위: 원)
  pbr: number;              // PBR - 주가순자산비율 (Price Book-value Ratio)

  // === 배당 정보 ===
  dividendPerShare: number; // 주당배당금 (단위: 원)
  dividendYield: number;    // 배당수익률 (%, 예: 2.1)
}

// ------------------------------------------------------------
// 🔧 유틸리티 함수들
// ------------------------------------------------------------

/**
 * 점수를 받아서 라벨을 반환하는 함수
 *
 * @param score - 0~100 사이의 점수
 * @returns 'STRONG', 'NEUTRAL', 'WEAK' 중 하나
 *
 * 예시:
 * getScoreLabel(85) → 'STRONG'
 * getScoreLabel(50) → 'NEUTRAL'
 * getScoreLabel(30) → 'WEAK'
 */
export function getScoreLabel(score: number): ScoreLabel {
  // if-else 문: 조건에 따라 다른 값을 반환
  if (score >= 70) return 'STRONG';   // 70점 이상이면 STRONG
  if (score >= 40) return 'NEUTRAL';  // 40점 이상이면 NEUTRAL
  return 'WEAK';                       // 나머지는 WEAK
}

/**
 * 점수에 따른 색상 코드를 반환하는 함수
 *
 * @param score - 0~100 사이의 점수
 * @returns CSS 색상 코드 문자열
 */
export function getScoreColor(score: number): string {
  if (score >= 70) return '#16a34a';  // 초록색 (강세)
  if (score >= 40) return '#ca8a04';  // 노란색 (보통)
  return '#dc2626';                    // 빨간색 (약세)
}

// ============================================================
// 📌 인사이트 관련 타입 (10초 요약, Top Picks, 뉴스)
// ============================================================

// ------------------------------------------------------------
// 🏷️ 인사이트 Enum 타입들
// ------------------------------------------------------------
export type InsightTemplate = 'A_VALUE' | 'B_MOMENTUM' | 'C_STABLE' | 'D_GROWTH' | 'E_RISK';
export type InsightTone = 'ACTIVE_GUIDE' | 'CAUTIOUS_GUIDE';
export type Confidence = 'HIGH' | 'MEDIUM' | 'LOW';
export type ReasonCategory = 'VALUATION' | 'FUNDAMENTALS' | 'MOMENTUM' | 'STABILITY' | 'NEWS' | 'RISK';
export type ReasonPolarity = 'POSITIVE' | 'CAUTION';
export type ReasonStrength = 'WEAK' | 'MEDIUM' | 'STRONG';
export type NewsTag = 'EARNINGS' | 'CONTRACT' | 'BUYBACK_DIVIDEND' | 'REGULATION_RISK' | 'MA' | 'INDUSTRY' | 'RUMOR';
export type NewsImportance = 'HIGH' | 'MEDIUM' | 'LOW';
export type PickType = 'STABLE' | 'VALUE' | 'GROWTH' | 'MOMENTUM' | 'WATCH';
export type FocusKey = 'EARNINGS_TREND' | 'SECTOR_COMPARISON' | 'VOLUME_TREND' | 'VOLATILITY' | 'NEXT_EARNINGS' | 'NEWS_RISK';

// P0-3: TopPick 역할 구분
export type TopPickRole = 'REPRESENTATIVE' | 'WATCHLIST_PRIORITY';

// ------------------------------------------------------------
// 📰 인사이트 뉴스 아이템 타입
// ------------------------------------------------------------
export interface InsightNewsItem {
  title: string;
  publisher: string;
  publishedAt: string;
  url: string;
  tags: NewsTag[];
  importance: NewsImportance;
  clusterId?: string;
}

// ------------------------------------------------------------
// 🎯 근거 카드 타입
// ------------------------------------------------------------
export interface ReasonCard {
  key: string;
  category: ReasonCategory;
  polarity: ReasonPolarity;
  text: string;
  strength: ReasonStrength;
  evidence?: Record<string, unknown>;
}

// ------------------------------------------------------------
// 📊 인사이트 메타 정보
// ------------------------------------------------------------
export interface InsightMeta {
  asOf: string;
  sources: string[];
  coverage: number;
  stalenessSec: number;
  disclaimerKey?: string;
}

// ------------------------------------------------------------
// 🎯 인사이트 점수
// ------------------------------------------------------------
export interface InsightScore {
  value: number;
  grade: ScoreLabel;
  confidence: Confidence;
}

// ------------------------------------------------------------
// 💡 인사이트 요약
// ------------------------------------------------------------
export interface InsightSummary {
  template: InsightTemplate;
  headline: string;
  tone: InsightTone;
  actionHint: {
    text: string;
    focusKeys: FocusKey[];
  };
}

// ------------------------------------------------------------
// 📋 인사이트 근거
// ------------------------------------------------------------
export interface InsightReasons {
  positive: ReasonCard[];
  caution: ReasonCard[];
  triggeredRules: string[];
}

// ------------------------------------------------------------
// 📰 인사이트 뉴스
// ------------------------------------------------------------
export interface InsightNews {
  issueBrief: string[];
  headlineItems: InsightNewsItem[];
}

// ------------------------------------------------------------
// 📈 종목 인사이트 (StockInsight)
// ------------------------------------------------------------
export interface StockInsight {
  entity: {
    type: 'STOCK';
    code: string;
    name: string;
    sectorName: string;
  };
  meta: InsightMeta;
  score: InsightScore;
  summary: InsightSummary;
  reasons: InsightReasons;
  news: InsightNews;
}

// ------------------------------------------------------------
// 🏢 섹터 인사이트 (SectorInsight)
// ------------------------------------------------------------
export interface TopPick {
  code: string;
  name: string;
  grade: ScoreLabel;
  pickType: PickType;
  reasons: string[];
  caution?: string;
  // P0-3: TopPick 역할
  role?: TopPickRole;
}

export interface SectorInsight {
  entity: {
    type: 'SECTOR';
    name: string;
  };
  meta: InsightMeta;
  summary: {
    headline: string;
    drivers: string[];
  };
  topPicks: TopPick[];
  news: InsightNews;
  // P0-1: 표본 크기 정보
  sampleSize?: number;
  lowSampleWarning?: boolean;
  // P0-3: 동적 섹션 타이틀
  sectionTitle?: string;
}

// ============================================================
// 📌 홈 Watchlist Picks 관련 타입
// ============================================================

// ------------------------------------------------------------
// 🏷️ Pick 버킷 타입
// ------------------------------------------------------------
export type PickBucket = 'STABLE' | 'REPRESENTATIVE' | 'MOMENTUM' | 'VALUE' | 'NEWS';

// ------------------------------------------------------------
// 📰 Pick 뉴스 타입
// ------------------------------------------------------------
export interface PickNews {
  title: string;
  url: string;
  publisher: string;
  publishedAt?: string;
}

// ------------------------------------------------------------
// 🎯 Stock Pick 카드 타입
// ------------------------------------------------------------
export interface StockPickCard {
  code: string;
  name: string;
  sectorName: string;
  scoreValue: number;
  grade: ScoreLabel;
  pickBucket: PickBucket;
  reasons: string[];
  caution?: string;
  news?: PickNews;
}

// ------------------------------------------------------------
// 📋 홈 Picks 응답 타입
// ------------------------------------------------------------
export interface HomePicksResponse {
  asOf: string;
  preset: string;
  items: StockPickCard[];
}

// ============================================================
// 📌 차트 관련 타입
// ============================================================

// ------------------------------------------------------------
// 📈 차트 범위 타입
// ------------------------------------------------------------
export type ChartRange = '1D' | '1W' | '1M' | '3M' | '1Y';

// ------------------------------------------------------------
// 📊 차트 데이터 포인트 타입
// ------------------------------------------------------------
export interface ChartDataPoint {
  date: string;
  price: number;
  volume: number;
}

// ------------------------------------------------------------
// 📋 차트 메타 정보
// ------------------------------------------------------------
export interface ChartMeta {
  asOf: string;
  source: string;
}

// ------------------------------------------------------------
// 📈 차트 응답 타입
// ------------------------------------------------------------
export interface ChartResponse {
  stockCode: string;
  stockName: string;
  range: ChartRange;
  dataPoints: ChartDataPoint[];
  meta: ChartMeta;
}
