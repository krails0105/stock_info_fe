// src/mocks/data.ts
// ============================================================
// 📌 개발용 Mock(가짜) 데이터
//
// 백엔드 API가 아직 없거나, 개발 중 테스트할 때 사용하는 가짜 데이터입니다.
// 실제 API가 준비되면 이 파일의 데이터 대신 API 응답을 사용합니다.
// ============================================================

// 타입 가져오기
import type { MarketSummary, SectorScore, StockScore, StockDetail } from '../types';

// ------------------------------------------------------------
// 📊 시장 지수 Mock 데이터
// ------------------------------------------------------------
// 'export': 다른 파일에서 import할 수 있게 내보내기
// 'const': 상수 선언 (재할당 불가)
// ': MarketSummary[]': TypeScript 타입 지정 (MarketSummary 배열)
export const mockMarketSummary: MarketSummary[] = [
  // 각 객체는 MarketSummary 타입의 구조를 따라야 함
  { name: 'KOSPI', value: 2650.28, change: 15.32, changePercent: 0.58 },
  { name: 'KOSDAQ', value: 872.15, change: -8.45, changePercent: -0.96 },
  { name: 'NASDAQ', value: 16832.92, change: 125.68, changePercent: 0.75 },
  { name: 'GOLD', value: 2024.50, change: 12.30, changePercent: 0.61 },
];

// ------------------------------------------------------------
// 📈 섹터 Mock 데이터
// ------------------------------------------------------------
export const mockSectors: SectorScore[] = [
  {
    sectorId: 'tech',
    sectorName: '기술주',
    score: 82,
    label: 'STRONG',
    reasons: ['1주 수익률 +4.2%', '거래량 28% 증가', '상승 종목 비율 65%'],
  },
  {
    sectorId: 'bio',
    sectorName: '바이오',
    score: 75,
    label: 'STRONG',
    reasons: ['1주 수익률 +3.1%', '거래량 45% 급증', '상승 종목 비율 58%'],
  },
  {
    sectorId: 'finance',
    sectorName: '금융',
    score: 71,
    label: 'STRONG',
    reasons: ['1주 수익률 +2.8%', '거래량 15% 증가', '상승 종목 비율 62%'],
  },
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
      score: 85,
      label: 'STRONG',
      reasons: ['최근 수익률 상위 20%', 'PER 업종 평균 대비 저평가', '거래량 25% 증가'],
      price: 72500,
      priceChange: '+2.5%',
      changePercent: 2.5,
    },
    {
      code: '000660',
      name: 'SK하이닉스',
      sectorName: '기술주',
      score: 92,
      label: 'STRONG',
      reasons: ['HBM 세계 1위', 'AI 수혜 최대 수혜주', '실적 서프라이즈 기대'],
      price: 178000,
      priceChange: '+3.2%',
      changePercent: 3.2,
    },
    {
      code: '035420',
      name: 'NAVER',
      sectorName: '기술주',
      score: 68,
      label: 'NEUTRAL',
      reasons: ['AI 검색 도입', '광고 매출 회복세', '클라우드 성장'],
      price: 185000,
      priceChange: '+1.1%',
      changePercent: 1.1,
    },
  ],

  '바이오': [
    {
      code: '207940',
      name: '삼성바이오로직스',
      sectorName: '바이오',
      score: 78,
      label: 'STRONG',
      reasons: ['CMO 수주 호조', '5공장 가동 준비', '안정적 성장'],
      price: 782000,
      priceChange: '+1.6%',
      changePercent: 1.6,
    },
    {
      code: '068270',
      name: '셀트리온',
      sectorName: '바이오',
      score: 72,
      label: 'STRONG',
      reasons: ['바이오시밀러 글로벌 점유율 확대', '신약 파이프라인 다수', '미국 시장 진출'],
      price: 165000,
      priceChange: '+0.8%',
      changePercent: 0.8,
    },
  ],

  '금융': [
    {
      code: '105560',
      name: 'KB금융',
      sectorName: '금융',
      score: 75,
      label: 'STRONG',
      reasons: ['금리 인상 수혜', '배당 확대 기대', '자산건전성 양호'],
      price: 68500,
      priceChange: '+1.2%',
      changePercent: 1.2,
    },
    {
      code: '055550',
      name: '신한지주',
      sectorName: '금융',
      score: 72,
      label: 'STRONG',
      reasons: ['디지털 전환 선도', '해외 사업 확장', '안정적 이익'],
      price: 52000,
      priceChange: '+0.9%',
      changePercent: 0.9,
    },
  ],

  '에너지': [
    {
      code: '096770',
      name: 'SK이노베이션',
      sectorName: '에너지',
      score: 55,
      label: 'NEUTRAL',
      reasons: ['배터리 사업 분할 기대', '정유 마진 개선', '친환경 전환'],
      price: 112000,
      priceChange: '+0.5%',
      changePercent: 0.5,
    },
  ],

  '소비재': [
    {
      code: '051910',
      name: 'LG화학',
      sectorName: '소비재',
      score: 48,
      label: 'NEUTRAL',
      reasons: ['전지 사업 분할 이후 정체', '석유화학 업황 부진', '신사업 기대'],
      price: 285000,
      priceChange: '-0.7%',
      changePercent: -0.7,
    },
  ],

  '자동차': [
    {
      code: '005380',
      name: '현대차',
      sectorName: '자동차',
      score: 38,
      label: 'WEAK',
      reasons: ['전기차 판매 부진', '환율 영향', '미국 시장 경쟁 심화'],
      price: 198000,
      priceChange: '-1.5%',
      changePercent: -1.5,
    },
  ],
};

// ------------------------------------------------------------
// 📝 종목 상세 Mock 데이터
// ------------------------------------------------------------
// Record<string, StockDetail>: 종목코드를 키로, 상세 정보를 값으로
export const mockStockDetail: Record<string, StockDetail> = {
  '000660': {
    code: '000660',
    name: 'SK하이닉스',
    sectorName: '기술주',
    score: 92,
    label: 'STRONG',
    reasons: [
      'HBM 세계 1위 기업, AI 데이터센터 수요 급증',
      'NVIDIA 공급 확대로 실적 서프라이즈 기대',
      '메모리 업황 회복과 가격 상승 수혜',
    ],
    price: 178000,
    priceChange: '+3.19%',
    changePercent: 3.19,
    returnGrade: '높음',
    valuationGrade: '저평가',
    volumeGrade: '증가',
    volume: 3250000,
    marketCap: 129000000000000,  // 129조
    headlines: [
      {
        title: 'SK하이닉스, HBM3E 생산 본격화...NVIDIA 납품 확대',
        url: '#',
        provider: '한국경제',
      },
      {
        title: 'AI 반도체 수요 폭발, SK하이닉스 수혜 전망',
        url: '#',
        provider: '매일경제',
      },
    ],
  },

  '005930': {
    code: '005930',
    name: '삼성전자',
    sectorName: '기술주',
    score: 85,
    label: 'STRONG',
    reasons: [
      '최근 수익률 상위 20%',
      'PER 업종 평균 대비 저평가',
      '거래량 25% 증가',
    ],
    price: 72500,
    priceChange: '+2.5%',
    changePercent: 2.5,
    returnGrade: '높음',
    valuationGrade: '저평가',
    volumeGrade: '증가',
    volume: 12500000,
    marketCap: 432000000000000,  // 432조
    headlines: [
      {
        title: '삼성전자, 파운드리 2nm 양산 준비 완료',
        url: '#',
        provider: '전자신문',
      },
    ],
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
    code,                           // code: code 의 축약형
    name: `종목 ${code}`,           // 템플릿 리터럴로 문자열 생성
    sectorName: '기타',
    score: 50,
    label: 'NEUTRAL',
    reasons: [
      '데이터 준비 중입니다',
      '추후 업데이트 예정',
      '투자에 참고하세요',
    ],
    price: 10000,
    priceChange: '0%',
    changePercent: 0,
    headlines: [],                  // 빈 배열
  };
}
