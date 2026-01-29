// src/components/FavoriteButton.tsx
// 즐겨찾기 토글 버튼 컴포넌트

import { Star } from 'lucide-react';
import useFavorites from '../hooks/useFavorites';
import './FavoriteButton.css';

interface FavoriteButtonProps {
  stockCode: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

function FavoriteButton({
  stockCode,
  size = 'md',
  showLabel = false,
}: FavoriteButtonProps) {
  const { isFavorite, toggle } = useFavorites();
  const active = isFavorite(stockCode);

  const iconSize = {
    sm: 16,
    md: 20,
    lg: 24,
  }[size];

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(stockCode);
  };

  return (
    <button
      className={`favorite-button favorite-button--${size} ${active ? 'active' : ''}`}
      onClick={handleClick}
      aria-label={active ? '즐겨찾기 해제' : '즐겨찾기 추가'}
      title={active ? '즐겨찾기 해제' : '즐겨찾기 추가'}
    >
      <Star
        size={iconSize}
        fill={active ? 'currentColor' : 'none'}
        strokeWidth={active ? 0 : 2}
      />
      {showLabel && (
        <span className="favorite-button__label">
          {active ? '즐겨찾기됨' : '즐겨찾기'}
        </span>
      )}
    </button>
  );
}

export default FavoriteButton;
