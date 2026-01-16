// src/pages/StockDetailPage.tsx
// ============================================================
// 📌 종목 상세 페이지
//
// URL: /stock/:stockCode (예: /stock/005930)
// 특정 종목의 상세 정보(점수, 이유, 지표, 뉴스)를 보여줍니다.
// ============================================================

// ------------------------------------------------------------
// 📦 import
// ------------------------------------------------------------
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getStockDetail } from '../services/api';
import type { StockDetail } from '../types';
import ScoreBadge from '../components/ScoreBadge';
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

    // API 호출
    getStockDetail(stockCode)
      .then(setStock)  // .then((data) => setStock(data))의 축약형
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
  // nullish coalescing (??): null/undefined일 때만 기본값 사용
  // || 와 다른 점: 0은 유효한 값으로 취급
  const changePercent = stock.changePercent ?? 0;

  // 상승/하락 판단
  const isUp = changePercent > 0;
  const isDown = changePercent < 0;

  // 표시할 등락률 문자열
  // stock.priceChange가 있으면 그걸 사용, 없으면 계산
  const priceChangeDisplay = stock.priceChange || `${isUp ? '+' : ''}${changePercent.toFixed(2)}%`;

  // ----------------------------------------------------------
  // 🎨 메인 렌더링
  // ----------------------------------------------------------
  return (
    <div className="stock-detail-page">
      {/* 뒤로가기: 소속 섹터 페이지로 */}
      <Link to={`/sector/${encodeURIComponent(stock.sectorName)}`} className="back-link">
        ← {stock.sectorName}
      </Link>

      {/* ======== 종목 헤더 ======== */}
      <header className="stock-header">
        <div className="stock-header__top">
          <div>
            <h1 className="stock-header__name">{stock.name}</h1>
            <span className="stock-header__code">{stock.code}</span>
            <Link to={`/sector/${encodeURIComponent(stock.sectorName)}`} className="stock-header__sector">
              {stock.sectorName}
            </Link>
          </div>
          <ScoreBadge score={stock.score} label={stock.label} size="lg" />
        </div>

        {/* 가격 정보 */}
        <div className="stock-header__price">
          {/*
            .toLocaleString(): 숫자를 천단위 쉼표가 있는 문자열로 변환
            예: 72500 → "72,500"
          */}
          <span className="price-value">{stock.price.toLocaleString()}원</span>

          {/*
            템플릿 리터럴로 클래스명 동적 생성
            조건에 따라 'up' 또는 'down' 클래스 추가
          */}
          <span className={`price-change ${isUp ? 'up' : ''} ${isDown ? 'down' : ''}`}>
            {priceChangeDisplay}
          </span>
        </div>
      </header>

      {/* ======== 투자 포인트 (이유 3줄) ======== */}
      <section className="stock-section">
        <h2>투자 포인트</h2>
        <ul className="stock-reasons">
          {stock.reasons.map((reason, idx) => (
            <li key={idx}>{reason}</li>
          ))}
        </ul>
      </section>

      {/* ======== 투자 등급 (있을 때만) ======== */}
      {/*
        괄호로 묶은 조건: 세 개 중 하나라도 있으면 true
        논리 OR (||): 하나라도 true면 true
      */}
      {(stock.returnGrade || stock.valuationGrade || stock.volumeGrade) && (
        <section className="stock-section">
          <h2>투자 등급</h2>
          <div className="stock-grades">
            {/* 각 등급이 있을 때만 표시 */}
            {stock.returnGrade && (
              <div className="grade-item">
                <span className="grade-label">수익률</span>
                <span className="grade-value">{stock.returnGrade}</span>
              </div>
            )}
            {stock.valuationGrade && (
              <div className="grade-item">
                <span className="grade-label">밸류에이션</span>
                <span className="grade-value">{stock.valuationGrade}</span>
              </div>
            )}
            {stock.volumeGrade && (
              <div className="grade-item">
                <span className="grade-label">거래량</span>
                <span className="grade-value">{stock.volumeGrade}</span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ======== 투자 지표 ======== */}
      <section className="stock-section">
        <h2>투자 지표</h2>
        <div className="stock-metrics">
          <div className="metric-card">
            <span className="metric-label">PER</span>
            {/* stock.per ?? '-': per가 null/undefined면 '-' 표시 */}
            <span className="metric-value">{stock.per ?? '-'}</span>
          </div>
          <div className="metric-card">
            <span className="metric-label">PBR</span>
            <span className="metric-value">{stock.pbr ?? '-'}</span>
          </div>
          {/* volume이 있을 때만 표시 */}
          {stock.volume && (
            <div className="metric-card">
              <span className="metric-label">거래량</span>
              <span className="metric-value">{stock.volume.toLocaleString()}</span>
            </div>
          )}
          {/* marketCap이 있을 때만 표시 */}
          {stock.marketCap && (
            <div className="metric-card">
              <span className="metric-label">시가총액</span>
              {/* 억 단위로 변환: 1억 = 100,000,000 */}
              <span className="metric-value">{(stock.marketCap / 100000000).toFixed(0)}억</span>
            </div>
          )}
        </div>
      </section>

      {/* ======== 관련 뉴스 ======== */}
      {/* headlines가 있고 길이가 0보다 클 때만 표시 */}
      {stock.headlines && stock.headlines.length > 0 && (
        <section className="stock-section">
          <h2>관련 뉴스</h2>
          <ul className="news-list">
            {stock.headlines.map((news, idx) => (
              <li key={idx}>
                <a href={news.url} target="_blank" rel="noopener noreferrer" className="news-link">
                  <span className="news-title">{news.title}</span>
                  {/* provider가 있을 때만 표시 */}
                  {news.provider && <span className="news-provider">{news.provider}</span>}
                </a>
                {/* summary가 있을 때만 표시 */}
                {news.summary && <p className="news-summary">{news.summary}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

export default StockDetailPage;
