// src/components/HomeSectorFavorites.tsx
// 홈 관심 섹터 섹션 컴포넌트

import { Link } from 'react-router-dom';
import { ChevronRight, Star } from 'lucide-react';
import useSectorFavorites from '../hooks/useSectorFavorites';
import type { SectorScore } from '../types';
import ScoreBadge from './ScoreBadge';
import SectorFavoriteButton from './SectorFavoriteButton';
import './HomeSectorFavorites.css';

interface HomeSectorFavoritesProps {
  sectors: SectorScore[];
  maxDisplay?: number;
}

function HomeSectorFavorites({ sectors, maxDisplay = 5 }: HomeSectorFavoritesProps) {
  const { favorites } = useSectorFavorites();

  // 즐겨찾기된 섹터만 필터링 (섹터 데이터와 매칭)
  const favoriteSectors = favorites
    .map((name) => sectors.find((s) => s.sectorName === name))
    .filter((s): s is SectorScore => s !== undefined)
    .slice(0, maxDisplay);

  // 즐겨찾기가 없으면 렌더링하지 않음
  if (favorites.length === 0) {
    return null;
  }

  // 섹터 데이터가 없으면 빈 상태 표시
  if (sectors.length === 0) {
    return (
      <div className="home-sector-favorites">
        <h2 className="home-sector-favorites__title">
          <Star size={18} className="home-sector-favorites__title-icon" />
          내 관심 섹터
        </h2>
        <div className="home-sector-favorites__empty">
          섹터 데이터를 불러오는 중...
        </div>
      </div>
    );
  }

  return (
    <div className="home-sector-favorites">
      <h2 className="home-sector-favorites__title">
        <Star size={18} className="home-sector-favorites__title-icon" />
        내 관심 섹터
        <span className="home-sector-favorites__count">{favorites.length}</span>
      </h2>

      {favoriteSectors.length > 0 ? (
        <div className="home-sector-favorites__list">
          {favoriteSectors.map((sector) => (
            <Link
              key={sector.sectorId}
              to={`/sector/${encodeURIComponent(sector.sectorName)}`}
              className="home-sector-favorites__item"
            >
              <div className="home-sector-favorites__item-info">
                <span className="home-sector-favorites__item-name">
                  {sector.sectorName}
                </span>
                <ScoreBadge score={sector.score} label={sector.label} size="sm" />
              </div>
              <div className="home-sector-favorites__item-actions">
                <SectorFavoriteButton sectorName={sector.sectorName} size="sm" />
                <ChevronRight size={16} className="home-sector-favorites__arrow" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="home-sector-favorites__empty">
          관심 섹터 정보를 불러올 수 없습니다.
        </div>
      )}
    </div>
  );
}

export default HomeSectorFavorites;
