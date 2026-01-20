// src/mocks/data.ts
// ============================================================
// 📌 개발용 Mock(가짜) 데이터
//
// 백엔드 API가 아직 없거나, 개발 중 테스트할 때 사용하는 가짜 데이터입니다.
// 실제 API가 준비되면 이 파일의 데이터 대신 API 응답을 사용합니다.
// ============================================================

// 타입 가져오기
import type { MarketSummary, StockScore, StockDetail } from '../types';

// ------------------------------------------------------------
// 📊 시장 지수 Mock 데이터
// ------------------------------------------------------------
export const mockMarketSummary: MarketSummary[] = [
  { name: 'KOSPI', value: 2650.28, change: 15.32, changePercent: 0.58 },
  { name: 'KOSDAQ', value: 872.15, change: -8.45, changePercent: -0.96 },
  { name: 'NASDAQ', value: 16832.92, change: 125.68, changePercent: 0.75 },
  { name: 'GOLD', value: 2024.50, change: 12.30, changePercent: 0.61 },
];

// ------------------------------------------------------------
// 📉 섹터별 종목 Mock 데이터
// ------------------------------------------------------------
// Record<K, V>: TypeScript의 유틸리티 타입
// - K: 키의 타입 (여기서는 string)
// - V: 값의 타입 (여기서는 StockScore[])
// 즉, "문자열을 키로, StockScore 배열을 값으로 갖는 객체"
export const mockStocksBySector: Record<string, StockScore[]> = {
  // '기술주'를 키로, 종목 배열을 값으로
  '기술주': [
    {
      code: '005930',
      name: '삼성전자',
      sectorName: '기술주',
      market: 'KOSPI',
      score: 85,
      label: 'STRONG',
      reasons: ['최근 수익률 상위 20%', 'PER 업종 평균 대비 저평가', '거래량 25% 증가'],
      price: 72500,
      changeRate: '+2.5%',
    },
    {
      code: '000660',
      name: 'SK하이닉스',
      sectorName: '기술주',
      market: 'KOSPI',
      score: 92,
      label: 'STRONG',
      reasons: ['HBM 세계 1위', 'AI 수혜 최대 수혜주', '실적 서프라이즈 기대'],
      price: 178000,
      changeRate: '+3.2%',
    },
    {
      code: '035420',
      name: 'NAVER',
      sectorName: '기술주',
      market: 'KOSPI',
      score: 68,
      label: 'NEUTRAL',
      reasons: ['AI 검색 도입', '광고 매출 회복세', '클라우드 성장'],
      price: 185000,
      changeRate: '+1.1%',
    },
  ],

  '바이오': [
    {
      code: '207940',
      name: '삼성바이오로직스',
      sectorName: '바이오',
      market: 'KOSPI',
      score: 78,
      label: 'STRONG',
      reasons: ['CMO 수주 호조', '5공장 가동 준비', '안정적 성장'],
      price: 782000,
      changeRate: '+1.6%',
    },
    {
      code: '068270',
      name: '셀트리온',
      sectorName: '바이오',
      market: 'KOSPI',
      score: 72,
      label: 'STRONG',
      reasons: ['바이오시밀러 글로벌 점유율 확대', '신약 파이프라인 다수', '미국 시장 진출'],
      price: 165000,
      changeRate: '+0.8%',
    },
  ],

  '금융': [
    {
      code: '105560',
      name: 'KB금융',
      sectorName: '금융',
      market: 'KOSPI',
      score: 75,
      label: 'STRONG',
      reasons: ['금리 인상 수혜', '배당 확대 기대', '자산건전성 양호'],
      price: 68500,
      changeRate: '+1.2%',
    },
    {
      code: '055550',
      name: '신한지주',
      sectorName: '금융',
      market: 'KOSPI',
      score: 72,
      label: 'STRONG',
      reasons: ['디지털 전환 선도', '해외 사업 확장', '안정적 이익'],
      price: 52000,
      changeRate: '+0.9%',
    },
  ],

  '에너지': [
    {
      code: '096770',
      name: 'SK이노베이션',
      sectorName: '에너지',
      market: 'KOSPI',
      score: 55,
      label: 'NEUTRAL',
      reasons: ['배터리 사업 분할 기대', '정유 마진 개선', '친환경 전환'],
      price: 112000,
      changeRate: '+0.5%',
    },
  ],

  '소비재': [
    {
      code: '051910',
      name: 'LG화학',
      sectorName: '소비재',
      market: 'KOSPI',
      score: 48,
      label: 'NEUTRAL',
      reasons: ['전지 사업 분할 이후 정체', '석유화학 업황 부진', '신사업 기대'],
      price: 285000,
      changeRate: '-0.7%',
    },
  ],

  '자동차': [
    {
      code: '005380',
      name: '현대차',
      sectorName: '자동차',
      market: 'KOSPI',
      score: 38,
      label: 'WEAK',
      reasons: ['전기차 판매 부진', '환율 영향', '미국 시장 경쟁 심화'],
      price: 198000,
      changeRate: '-1.5%',
    },
  ],
};

// ------------------------------------------------------------
// 📝 종목 상세 Mock 데이터 (KrxStockFinancialItem 기반)
// ------------------------------------------------------------
// Record<string, StockDetail>: 종목코드를 키로, 상세 정보를 값으로
export const mockStockDetail: Record<string, StockDetail> = {
  '000660': {
    stockCode: '000660',
    stockName: 'SK하이닉스',
    closingPrice: 178000,
    priceChange: 5500,
    changeRate: 3.19,
    eps: 15420,
    per: 11.54,
    forwardEps: 18500,
    forwardPer: 9.62,
    bps: 98500,
    pbr: 1.81,
    dividendPerShare: 1200,
    dividendYield: 0.67,
  },

  '005930': {
    stockCode: '005930',
    stockName: '삼성전자',
    closingPrice: 72500,
    priceChange: 1800,
    changeRate: 2.5,
    eps: 4350,
    per: 16.67,
    forwardEps: 5200,
    forwardPer: 13.94,
    bps: 52000,
    pbr: 1.39,
    dividendPerShare: 1444,
    dividendYield: 1.99,
  },
};

// ------------------------------------------------------------
// 🔧 기본 종목 상세 데이터 생성 함수
// ------------------------------------------------------------
// Mock 데이터에 없는 종목 코드가 요청되었을 때 사용
//
// 함수 시그니처 설명:
// - getDefaultStockDetail: 함수명
// - (code: string): 매개변수. code는 string 타입
// - : StockDetail: 반환 타입
export function getDefaultStockDetail(code: string): StockDetail {
  // 객체 리터럴을 반환
  return {
    stockCode: code,
    stockName: `종목 ${code}`,
    closingPrice: 0,
    priceChange: 0,
    changeRate: 0,
    eps: 0,
    per: 0,
    forwardEps: 0,
    forwardPer: 0,
    bps: 0,
    pbr: 0,
    dividendPerShare: 0,
    dividendYield: 0,
  };
}
