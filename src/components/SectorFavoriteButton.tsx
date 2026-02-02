// src/components/SectorFavoriteButton.tsx
// 섹터 즐겨찾기 토글 버튼 컴포넌트

import { Star } from 'lucide-react';
import useSectorFavorites from '../hooks/useSectorFavorites';
import './SectorFavoriteButton.css';

interface SectorFavoriteButtonProps {
  sectorName: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

function SectorFavoriteButton({
  sectorName,
  size = 'md',
  showLabel = false,
}: SectorFavoriteButtonProps) {
  const { isFavorite, toggle } = useSectorFavorites();
  const active = isFavorite(sectorName);

  const iconSize = {
    sm: 16,
    md: 20,
    lg: 24,
  }[size];

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(sectorName);
  };

  return (
    <button
      className={`sector-favorite-button sector-favorite-button--${size} ${active ? 'active' : ''}`}
      onClick={handleClick}
      aria-label={active ? '관심 섹터 해제' : '관심 섹터 추가'}
      title={active ? '관심 섹터 해제' : '관심 섹터 추가'}
    >
      <Star
        size={iconSize}
        fill={active ? 'currentColor' : 'none'}
        strokeWidth={active ? 0 : 2}
      />
      {showLabel && (
        <span className="sector-favorite-button__label">
          {active ? '관심 섹터' : '관심 추가'}
        </span>
      )}
    </button>
  );
}

export default SectorFavoriteButton;
