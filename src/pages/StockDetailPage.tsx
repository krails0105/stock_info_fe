// src/pages/StockDetailPage.tsx
// ============================================================
// 📌 종목 상세 페이지 (KrxStockFinancialItem 기반)
//
// URL: /stock/:stockCode (예: /stock/005930)
// 특정 종목의 재무지표 정보를 보여줍니다.
// 10초 요약 인사이트 + 상세 재무지표 + 뉴스 제공
// ============================================================

// ------------------------------------------------------------
// 📦 import
// ------------------------------------------------------------
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getStockDetail, getStockInsight } from '../services/api';
import type { StockDetail, StockInsight } from '../types';
import StockDetailSummary from '../components/StockDetailSummary';
import NewsHeadlineList from '../components/NewsHeadlineList';
import './StockDetailPage.css';

// ------------------------------------------------------------
// 📄 StockDetailPage 컴포넌트
// ------------------------------------------------------------
function StockDetailPage() {
  // URL에서 종목 코드 추출
  // /stock/005930 → stockCode = "005930"
  const { stockCode } = useParams<{ stockCode: string }>();

  // 상태 정의
  const [stock, setStock] = useState<StockDetail | null>(null);
  const [insight, setInsight] = useState<StockInsight | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ----------------------------------------------------------
  // ⚡ useEffect: 종목 데이터 로딩
  // ----------------------------------------------------------
  useEffect(() => {
    // stockCode가 없으면 종료
    if (!stockCode) return;

    // 로딩 시작
    setLoading(true);
    setError(null);

    // API 동시 호출 (재무지표 + 인사이트)
    Promise.all([
      getStockDetail(stockCode),
      getStockInsight(stockCode).catch(() => null), // 인사이트 실패 시 null
    ])
      .then(([stockData, insightData]) => {
        setStock(stockData);
        setInsight(insightData);
      })
      .catch(() => setError('종목 정보를 불러올 수 없습니다'))
      .finally(() => setLoading(false));
  }, [stockCode]); // stockCode가 변경되면 다시 실행

  // ----------------------------------------------------------
  // 🔄 로딩 상태 렌더링
  // ----------------------------------------------------------
  if (loading) {
    return (
      <div className="stock-detail-page">
        <div className="loading">로딩 중...</div>
      </div>
    );
  }

  // ----------------------------------------------------------
  // 🔄 에러 상태 렌더링
  // ----------------------------------------------------------
  if (error || !stock) {
    return (
      <div className="stock-detail-page">
        <div className="error">{error || '종목을 찾을 수 없습니다'}</div>
        <Link to="/" className="back-link">홈으로 돌아가기</Link>
      </div>
    );
  }

  // ----------------------------------------------------------
  // 📊 등락률 계산
  // ----------------------------------------------------------
  const changeRate = stock.changeRate ?? 0;
  const isUp = changeRate > 0;
  const isDown = changeRate < 0;

  // 표시할 등락률 문자열
  const changeRateDisplay = `${isUp ? '+' : ''}${changeRate.toFixed(2)}%`;

  // 전일 대비 표시
  const priceChangeDisplay = `${stock.priceChange >= 0 ? '+' : ''}${stock.priceChange.toLocaleString()}원`;

  // ----------------------------------------------------------
  // 🎨 메인 렌더링
  // ----------------------------------------------------------
  return (
    <div className="stock-detail-page">
      {/* 뒤로가기: 홈으로 */}
      <Link to="/" className="back-link">
        ← 홈으로
      </Link>

      {/* ======== 10초 요약 인사이트 ======== */}
      {insight && (
        <StockDetailSummary insight={insight} />
      )}

      {/* ======== 뉴스 헤드라인 ======== */}
      {insight && insight.news && (
        /* P0-4: searchKeyword로 종목명 전달 (뉴스 0건 시 외부 검색 링크용) */
        <NewsHeadlineList news={insight.news} maxItems={5} searchKeyword={stock.stockName} />
      )}

      {/* ======== 종목 헤더 ======== */}
      <header className="stock-header">
        <div className="stock-header__top">
          <div>
            <h1 className="stock-header__name">{stock.stockName}</h1>
            <span className="stock-header__code">{stock.stockCode}</span>
          </div>
        </div>

        {/* 가격 정보 */}
        <div className="stock-header__price">
          {/*
            .toLocaleString(): 숫자를 천단위 쉼표가 있는 문자열로 변환
            예: 72500 → "72,500"
          */}
          <span className="price-value">{stock.closingPrice.toLocaleString()}원</span>

          {/*
            템플릿 리터럴로 클래스명 동적 생성
            조건에 따라 'up' 또는 'down' 클래스 추가
          */}
          <span className={`price-change ${isUp ? 'up' : ''} ${isDown ? 'down' : ''}`}>
            {priceChangeDisplay} ({changeRateDisplay})
          </span>
        </div>
      </header>

      {/* ======== 수익 지표 ======== */}
      <section className="stock-section">
        <h2>수익 지표</h2>
        <div className="stock-metrics">
          <div className="metric-card">
            <span className="metric-label">EPS</span>
            <span className="metric-value">{stock.eps ? stock.eps.toLocaleString() : '-'}원</span>
            <span className="metric-desc">주당순이익</span>
          </div>
          <div className="metric-card">
            <span className="metric-label">PER</span>
            <span className="metric-value">{stock.per ? stock.per.toFixed(2) : '-'}</span>
            <span className="metric-desc">주가수익비율</span>
          </div>
          <div className="metric-card">
            <span className="metric-label">선행 EPS</span>
            <span className="metric-value">{stock.forwardEps ? stock.forwardEps.toLocaleString() : '-'}원</span>
            <span className="metric-desc">예상 주당순이익</span>
          </div>
          <div className="metric-card">
            <span className="metric-label">선행 PER</span>
            <span className="metric-value">{stock.forwardPer ? stock.forwardPer.toFixed(2) : '-'}</span>
            <span className="metric-desc">예상 주가수익비율</span>
          </div>
        </div>
      </section>

      {/* ======== 자산 지표 ======== */}
      <section className="stock-section">
        <h2>자산 지표</h2>
        <div className="stock-metrics">
          <div className="metric-card">
            <span className="metric-label">BPS</span>
            <span className="metric-value">{stock.bps ? stock.bps.toLocaleString() : '-'}원</span>
            <span className="metric-desc">주당순자산</span>
          </div>
          <div className="metric-card">
            <span className="metric-label">PBR</span>
            <span className="metric-value">{stock.pbr ? stock.pbr.toFixed(2) : '-'}</span>
            <span className="metric-desc">주가순자산비율</span>
          </div>
        </div>
      </section>

      {/* ======== 배당 정보 ======== */}
      <section className="stock-section">
        <h2>배당 정보</h2>
        <div className="stock-metrics">
          <div className="metric-card">
            <span className="metric-label">주당배당금</span>
            <span className="metric-value">{stock.dividendPerShare ? stock.dividendPerShare.toLocaleString() : '-'}원</span>
            <span className="metric-desc">DPS</span>
          </div>
          <div className="metric-card">
            <span className="metric-label">배당수익률</span>
            <span className="metric-value">{stock.dividendYield ? stock.dividendYield.toFixed(2) : '-'}%</span>
            <span className="metric-desc">Dividend Yield</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default StockDetailPage;
