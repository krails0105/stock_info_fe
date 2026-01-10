// src/components/MarketSummaryBar.tsx
// ============================================================
// 📌 시장 요약 바 컴포넌트
//
// KOSPI, KOSDAQ, NASDAQ, GOLD 등의 시장 지수를 가로로 보여줍니다.
// 상승은 빨간색, 하락은 파란색으로 표시합니다.
// ============================================================

import { useEffect, useState } from 'react';
import { getMarketSummary } from '../services/api';
import type { MarketSummary } from '../types';
import './MarketSummaryBar.css';

// ------------------------------------------------------------
// 📊 MarketSummaryBar 컴포넌트
// ------------------------------------------------------------
function MarketSummaryBar() {
  // ----------------------------------------------------------
  // 📊 상태 정의
  // ----------------------------------------------------------
  // indices: 시장 지수 배열
  const [indices, setIndices] = useState<MarketSummary[]>([]);

  // loading: 데이터 로딩 중인지
  const [loading, setLoading] = useState(true);

  // error: 에러 메시지 (없으면 null)
  const [error, setError] = useState<string | null>(null);

  // ----------------------------------------------------------
  // ⚡ useEffect: 컴포넌트 마운트 시 데이터 로딩
  // ----------------------------------------------------------
  useEffect(() => {
    // API 호출
    getMarketSummary()
      // .then(setIndices)는 .then((data) => setIndices(data))와 같음
      // 함수 참조를 직접 전달하는 축약 문법
      .then(setIndices)
      .catch(() => setError('시장 데이터를 불러올 수 없습니다'))
      .finally(() => setLoading(false));
  }, []); // 빈 배열: 마운트 시 1회만 실행

  // ----------------------------------------------------------
  // 🔄 로딩 상태 렌더링
  // ----------------------------------------------------------
  if (loading) {
    return <div className="market-bar market-bar--loading">로딩 중...</div>;
  }

  // ----------------------------------------------------------
  // 🔄 에러 상태 렌더링
  // ----------------------------------------------------------
  if (error) {
    return <div className="market-bar market-bar--error">{error}</div>;
  }

  // ----------------------------------------------------------
  // 🎨 메인 렌더링
  // ----------------------------------------------------------
  return (
    <div className="market-bar">
      {/*
        indices 배열을 순회하며 각 지수를 렌더링
        map의 콜백 함수: (item) => JSX
      */}
      {indices.map((item) => {
        // 상승/하락 판단
        const isUp = item.changePercent > 0;
        const isDown = item.changePercent < 0;

        // 부호 결정: 양수면 '+', 음수면 '' (마이너스는 자동으로 붙음)
        const sign = isUp ? '+' : '';

        return (
          // 각 시장 지수 카드
          // key: React가 리스트 항목을 식별하기 위한 고유값
          <div
            key={item.name}
            // 템플릿 리터럴로 조건에 따라 클래스 추가
            // 백틱(`) 안에서 ${} 사용하여 변수/표현식 삽입
            className={`market-item ${isUp ? 'market-item--up' : ''} ${isDown ? 'market-item--down' : ''}`}
          >
            {/* 지수명 */}
            <span className="market-item__name">{item.name}</span>

            {/* 현재값 */}
            <span className="market-item__value">{item.value.toLocaleString()}</span>

            {/*
              등락률
              .toFixed(2): 소수점 2자리까지 표시
              예: 0.58 → "0.58"
            */}
            <span className="market-item__change">
              {sign}{item.changePercent.toFixed(2)}%
            </span>

            {/* 스파크라인 차트 자리 (추후 Recharts 등으로 구현 가능) */}
            <div className="market-item__sparkline"></div>
          </div>
        );
      })}
    </div>
  );
}

export default MarketSummaryBar;
