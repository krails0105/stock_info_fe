// src/components/HomeFavorites.tsx
// 홈 즐겨찾기 섹션 컴포넌트

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, TrendingUp, TrendingDown } from 'lucide-react';
import useFavorites from '../hooks/useFavorites';
import { getStockDetail } from '../services/api';
import type { StockDetail } from '../types';
import { SkeletonCard } from './Skeleton';
import EmptyState from './EmptyState';
import FavoriteButton from './FavoriteButton';
import './HomeFavorites.css';

const MAX_DISPLAY = 5; // 홈에서 표시할 최대 개수

interface FavoriteStock extends StockDetail {
  code: string;
}

function HomeFavorites() {
  const { favorites } = useFavorites();
  const [stocks, setStocks] = useState<FavoriteStock[]>([]);
  const [loading, setLoading] = useState(true);

  // 즐겨찾기 종목 정보 조회
  useEffect(() => {
    if (favorites.length === 0) {
      setStocks([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // 최대 MAX_DISPLAY개만 조회
    const codesToFetch = favorites.slice(0, MAX_DISPLAY);

    Promise.all(codesToFetch.map((code) => getStockDetail(code).catch(() => null)))
      .then((results) => {
        const validStocks = results
          .filter((s): s is StockDetail => s !== null)
          .map((s) => ({ ...s, code: s.stockCode }));
        setStocks(validStocks);
      })
      .finally(() => setLoading(false));
  }, [favorites]);

  return (
    <section className="home-favorites">
      <div className="home-favorites__header">
        <h2 className="home-favorites__title">
          <Star size={18} />
          내 즐겨찾기
        </h2>
        {favorites.length > MAX_DISPLAY && (
          <span className="home-favorites__more">
            +{favorites.length - MAX_DISPLAY}개 더
          </span>
        )}
      </div>

      {/* 로딩 상태 */}
      {loading && favorites.length > 0 && (
        <div className="home-favorites__loading">
          <SkeletonCard />
        </div>
      )}

      {/* 즐겨찾기 없음 */}
      {!loading && favorites.length === 0 && (
        <div className="home-favorites__empty">
          <Star size={24} />
          <p>종목 상세에서 ⭐를 눌러 즐겨찾기에 추가해보세요</p>
        </div>
      )}

      {/* 즐겨찾기 목록 */}
      {!loading && stocks.length > 0 && (
        <ul className="home-favorites__list">
          {stocks.map((stock) => {
            const isUp = stock.changeRate > 0;
            const isDown = stock.changeRate < 0;

            return (
              <li key={stock.stockCode}>
                <Link
                  to={`/stock/${stock.stockCode}`}
                  className="home-favorites__item"
                >
                  <div className="home-favorites__item-main">
                    <span className="home-favorites__item-name">
                      {stock.stockName}
                    </span>
                    <span className="home-favorites__item-code">
                      {stock.stockCode}
                    </span>
                  </div>
                  <div className="home-favorites__item-price">
                    <span className="home-favorites__item-value">
                      {stock.closingPrice.toLocaleString()}원
                    </span>
                    <span
                      className={`home-favorites__item-change ${isUp ? 'up' : ''} ${isDown ? 'down' : ''}`}
                    >
                      {isUp ? <TrendingUp size={12} /> : isDown ? <TrendingDown size={12} /> : null}
                      {isUp ? '+' : ''}{stock.changeRate.toFixed(2)}%
                    </span>
                  </div>
                  <FavoriteButton stockCode={stock.stockCode} size="sm" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      {/* 데이터 로드 실패 (일부) */}
      {!loading && stocks.length === 0 && favorites.length > 0 && (
        <EmptyState
          variant="error"
          title="즐겨찾기 정보를 불러올 수 없습니다"
          description="잠시 후 다시 시도해 주세요."
        />
      )}
    </section>
  );
}

export default HomeFavorites;
