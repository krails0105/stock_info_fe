// src/components/MarketSummaryBar.tsx
// 시장 요약 바 컴포넌트

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { getMarketSummary } from '../services/api';
import type { MarketSummary } from '../types';
import { SkeletonMarketItem } from './Skeleton';
import './MarketSummaryBar.css';

function MarketSummaryBar() {
  const [indices, setIndices] = useState<MarketSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMarketSummary()
      .then(setIndices)
      .catch(() => setError('시장 데이터를 불러올 수 없습니다'))
      .finally(() => setLoading(false));
  }, []);

  // 로딩 상태: Skeleton
  if (loading) {
    return (
      <div className="market-bar market-bar--loading">
        <SkeletonMarketItem />
        <SkeletonMarketItem />
        <SkeletonMarketItem />
        <SkeletonMarketItem />
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return <div className="market-bar market-bar--error">{error}</div>;
  }

  return (
    <div className="market-bar">
      {indices.map((item) => {
        const isUp = item.changePercent > 0;
        const isDown = item.changePercent < 0;
        const sign = isUp ? '+' : '';

        // 아이콘 선택
        const Icon = isUp ? TrendingUp : isDown ? TrendingDown : Minus;

        return (
          <div
            key={item.name}
            className={`market-item ${isUp ? 'market-item--up' : ''} ${isDown ? 'market-item--down' : ''}`}
          >
            <span className="market-item__name">{item.name}</span>
            <span className="market-item__value">{item.value.toLocaleString()}</span>
            <span className="market-item__change">
              <Icon size={14} className="market-item__icon" />
              {sign}{item.changePercent.toFixed(2)}%
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default MarketSummaryBar;
