import axios from 'axios';

// API 베이스 URL 설정
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    // 로그인 토큰이 있으면 추가
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // 토큰 만료 시 로그아웃 처리
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 타입 정의
export interface MarketIndex {
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

export interface Sector {
  id: string;
  name: string;
  stockCount: number;
  change: number;
}

export interface Stock {
  code: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  per: number;
  pbr: number;
  sector: string;
}

export interface News {
  id: string;
  title: string;
  source: string;
  publishedAt: string;
  url: string;
  stockCode?: string;
}

// API 함수들
export const stockApi = {
  // 시장 지수 조회
  getMarketIndices: async (): Promise<MarketIndex[]> => {
    const response = await api.get('/indices');
    return response.data;
  },

  // 섹터 목록 조회
  getSectors: async (): Promise<Sector[]> => {
    const response = await api.get('/sectors');
    return response.data;
  },

  // 섹터별 종목 조회
  getStocksBySector: async (sectorId?: string): Promise<Stock[]> => {
    const params = sectorId ? { sector: sectorId } : {};
    const response = await api.get('/stocks', { params });
    return response.data;
  },

  // 특정 종목 조회
  getStock: async (code: string): Promise<Stock> => {
    const response = await api.get(`/stocks/${code}`);
    return response.data;
  },

  // 종목 검색
  searchStocks: async (query: string): Promise<Stock[]> => {
    const response = await api.get('/stocks/search', { params: { q: query } });
    return response.data;
  },

  // 뉴스 조회
  getNews: async (stockCode?: string): Promise<News[]> => {
    const params = stockCode ? { code: stockCode } : {};
    const response = await api.get('/news', { params });
    return response.data;
  },

  // 종목 차트 데이터 조회
  getChartData: async (code: string, period: string = '1D'): Promise<any> => {
    const response = await api.get(`/stocks/${code}/chart`, { params: { period } });
    return response.data;
  },
};

export default api; 