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
export interface StockScore {
  code: string;             // 종목 코드 (예: "005930")
  name: string;             // 종목명 (예: "삼성전자")
  sectorId?: string;        // 소속 섹터 ID
  sectorName: string;       // 소속 섹터명
  score: number;            // 점수 0~100
  label: ScoreLabel;        // 라벨
  reasons: string[];        // 이유 3줄
  price: number;            // 현재가
  priceChange?: string;     // 등락률 문자열 (예: "+2.5%")
  change?: number;          // 등락폭 (숫자)
  changePercent?: number;   // 등락률 (숫자)
  returnGrade?: string;     // 수익률 등급 (예: "높음")
  valuationGrade?: string;  // 밸류에이션 등급 (예: "저평가")
  volumeGrade?: string;     // 거래량 등급 (예: "증가")
  sectorScore?: number;     // 소속 섹터 점수
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
// 📝 종목 상세 정보 타입
// ------------------------------------------------------------
// 'extends'는 상속입니다.
// StockDetail은 StockScore의 모든 속성을 가지고, 추가로 아래 속성들도 가집니다.
export interface StockDetail extends StockScore {
  volume?: number;          // 거래량
  marketCap?: number;       // 시가총액
  high52w?: number;         // 52주 최고가
  low52w?: number;          // 52주 최저가
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
