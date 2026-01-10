// src/services/api.ts
// ============================================================
// 📌 API 호출 모듈
//
// 이 파일은 백엔드 서버와 통신하는 함수들을 모아놓은 곳입니다.
// axios 라이브러리를 사용하여 HTTP 요청을 보냅니다.
// ============================================================

// ------------------------------------------------------------
// 📦 import
// ------------------------------------------------------------
// axios: HTTP 요청을 쉽게 보낼 수 있는 라이브러리
// fetch API보다 사용하기 편리합니다.
import axios from 'axios';

// 타입들 가져오기
import type {
  MarketSummary,
  SectorScoreboardResponse,
  StockScoreboardResponse,
  StockDetail,
  SectorScore,
  NewsItem
} from '../types';

// Mock 데이터 가져오기 (백엔드에 없는 API용)
import { mockMarketSummary, mockStocksBySector } from '../mocks/data';

// ------------------------------------------------------------
// ⚙️ 설정
// ------------------------------------------------------------
// import.meta.env: Vite에서 환경 변수를 읽는 방법
// .env 파일에 VITE_API_URL을 설정하면 그 값을 사용하고,
// 없으면 'http://localhost:8080/api'를 기본값으로 사용합니다.
//
// || 연산자: 앞의 값이 falsy(undefined, null, '', 0 등)이면 뒤의 값을 사용
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// ------------------------------------------------------------
// 🌐 Axios 인스턴스 생성
// ------------------------------------------------------------
// axios.create(): 공통 설정을 가진 axios 인스턴스를 만듭니다.
// 이렇게 하면 매번 baseURL이나 timeout을 지정하지 않아도 됩니다.
const api = axios.create({
  baseURL: API_BASE_URL,     // 모든 요청의 기본 URL
  timeout: 10000,            // 10초 후 타임아웃 (밀리초)
  headers: {
    'Content-Type': 'application/json',  // 요청 본문 형식
  },
});

// ------------------------------------------------------------
// 🔒 요청 인터셉터 (Request Interceptor)
// ------------------------------------------------------------
// 인터셉터: 요청이나 응답을 가로채서 처리하는 기능
// 여기서는 모든 요청에 인증 토큰을 자동으로 추가합니다.
api.interceptors.request.use(
  // 요청 성공 시 실행되는 함수
  (config) => {
    // localStorage: 브라우저에 데이터를 저장하는 공간
    // getItem(): 저장된 값 가져오기
    const token = localStorage.getItem('accessToken');

    // 토큰이 있으면 Authorization 헤더에 추가
    if (token) {
      // Bearer 토큰: "Bearer {토큰값}" 형식
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;  // 수정된 config 반환
  },
  // 요청 실패 시 실행되는 함수
  (error) => Promise.reject(error)
);

// ------------------------------------------------------------
// 📥 응답 인터셉터 (Response Interceptor)
// ------------------------------------------------------------
// 모든 응답을 가로채서 에러 처리를 합니다.
api.interceptors.response.use(
  // 응답 성공 시: 그대로 반환
  (response) => response,

  // 응답 실패 시: 에러 처리
  (error) => {
    // 401 에러: 인증 실패 (토큰 만료 등)
    if (error.response?.status === 401) {
      // 토큰 삭제
      localStorage.removeItem('accessToken');
      // 로그인 페이지로 이동
      window.location.href = '/login';
    }
    // 에러를 다시 던져서 호출한 곳에서 처리할 수 있게 함
    return Promise.reject(error);
  }
);

// ============================================================
// 📡 API 함수들
// ============================================================

// ------------------------------------------------------------
// 시장 요약 조회
// ------------------------------------------------------------
/**
 * 시장 지수 데이터를 가져옵니다 (KOSPI, KOSDAQ, NASDAQ, GOLD)
 *
 * async/await 문법:
 * - async: 이 함수가 비동기 함수임을 선언
 * - await: Promise가 완료될 때까지 기다림
 *
 * Promise<MarketSummary[]>: 이 함수는 MarketSummary 배열을 반환하는 Promise를 반환
 *
 * 현재 백엔드에 /api/indices 엔드포인트가 없어서 Mock 데이터 사용
 */
export async function getMarketSummary(): Promise<MarketSummary[]> {
  // TODO: 백엔드에 /api/indices 구현 시 아래 주석 해제
  // const response = await api.get('/indices');
  // return response.data;

  // Promise.resolve(): 즉시 완료되는 Promise 생성
  return Promise.resolve(mockMarketSummary);
}

// ------------------------------------------------------------
// 섹터 스코어보드 조회
// ------------------------------------------------------------
/**
 * 전체 섹터의 점수/라벨/이유를 가져옵니다
 *
 * api.get('/sectors'): GET 요청을 보냄
 * response.data: 서버에서 받은 JSON 데이터
 */
export async function getSectorScoreboard(): Promise<SectorScoreboardResponse> {
  // await: 이 요청이 완료될 때까지 기다림
  const response = await api.get('/sectors');

  // .map(): 배열의 각 요소를 변환
  // (s: SectorScore): 매개변수 s의 타입을 SectorScore로 지정
  const sectors: SectorScore[] = response.data.map((s: SectorScore) => ({
    ...s,                           // 스프레드: s의 모든 속성을 복사
    headlines: s.headlines || [],   // headlines가 없으면 빈 배열로 설정
  }));

  // 객체 반환
  return {
    updatedAt: new Date().toISOString(),  // 현재 시각을 ISO 문자열로
    sectors,                              // sectors: sectors (축약형)
  };
}

// ------------------------------------------------------------
// 섹터별 종목 스코어보드 조회
// ------------------------------------------------------------
/**
 * 특정 섹터에 속한 종목들의 점수를 가져옵니다
 *
 * @param sectorName - 섹터 이름 (예: "기술주")
 *
 * 현재 백엔드에 엔드포인트가 없어서 Mock 데이터 사용
 */
export async function getStockScoreboard(sectorName: string): Promise<StockScoreboardResponse> {
  // TODO: 백엔드에 /api/sectors/:id/stocks 구현 시 아래 주석 해제
  // const response = await api.get(`/sectors/${encodeURIComponent(sectorName)}/stocks`);
  // return response.data;

  // Mock 데이터에서 해당 섹터의 종목 가져오기
  // || []: 없으면 빈 배열
  const stocks = mockStocksBySector[sectorName] || [];

  return Promise.resolve({
    sectorName,
    updatedAt: new Date().toISOString(),
    stocks,
  });
}

// ------------------------------------------------------------
// 종목 상세 조회
// ------------------------------------------------------------
/**
 * 특정 종목의 상세 정보를 가져옵니다
 *
 * @param code - 종목 코드 (예: "005930")
 */
export async function getStockDetail(code: string): Promise<StockDetail> {
  // 백엔드 API 호출
  const response = await api.get(`/stocks/${code}`);
  const data = response.data;

  // 백엔드 응답을 프론트엔드 형식으로 변환하여 반환
  return {
    ...data,                              // 기존 데이터 복사
    headlines: data.headlines || [],      // headlines 없으면 빈 배열

    // nullish coalescing 연산자 (??):
    // - 왼쪽이 null 또는 undefined일 때만 오른쪽 값 사용
    // - || 와 비슷하지만, 0이나 ''은 유효한 값으로 취급

    // parseFloat(): 문자열을 숫자로 변환
    // .replace('%', ''): '%' 문자 제거
    changePercent: data.changePercent ?? parseFloat(data.priceChange?.replace('%', '') || '0'),
  };
}

// ------------------------------------------------------------
// 뉴스 조회
// ------------------------------------------------------------
/**
 * 뉴스 조회 파라미터 타입
 */
export interface GetNewsParams {
  scope?: 'sector' | 'stock';  // 검색 범위
  sectorName?: string;         // 섹터명
  code?: string;               // 종목 코드
  limit?: number;              // 최대 개수
}

/**
 * 뉴스를 조회합니다
 *
 * @param params - 검색 조건
 */
export async function getNews(params: GetNewsParams = {}): Promise<NewsItem[]> {
  try {
    // { params }: 쿼리 파라미터로 전달
    // 예: /news?scope=sector&sectorName=기술주
    const response = await api.get('/news', { params });
    return response.data;
  } catch {
    // 에러 발생 시 빈 배열 반환
    return [];
  }
}

// ------------------------------------------------------------
// 기존 API 함수들 (하위 호환성)
// ------------------------------------------------------------
// 객체 형태로 여러 함수를 묶어서 내보내기
// 사용: stockApi.getSectors() 형태로 호출
export const stockApi = {
  getMarketIndices: getMarketSummary,

  getSectors: async () => {
    const response = await api.get('/sectors');
    return response.data;
  },

  getStocksBySector: async (sectorId?: string) => {
    const params = sectorId ? { sector: sectorId } : {};
    const response = await api.get('/stocks', { params });
    return response.data;
  },

  getStock: async (code: string) => {
    const response = await api.get(`/stocks/${code}`);
    return response.data;
  },

  searchStocks: async (query: string) => {
    const response = await api.get('/stocks/search', { params: { q: query } });
    return response.data;
  },

  getNews: async (stockCode?: string) => {
    const params = stockCode ? { code: stockCode } : {};
    const response = await api.get('/news', { params });
    return response.data;
  },

  getChartData: async (code: string, period: string = '1D') => {
    const response = await api.get(`/stocks/${code}/chart`, { params: { period } });
    return response.data;
  },
};

// 기본 내보내기: api 인스턴스
// 다른 곳에서 직접 axios 요청을 보낼 때 사용
export default api;
