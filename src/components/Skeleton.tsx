// src/components/Skeleton.tsx
// Skeleton 로딩 컴포넌트

import './Skeleton.css';

interface SkeletonProps {
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
  className?: string;
}

function Skeleton({
  variant = 'rectangular',
  width,
  height,
  className = ''
}: SkeletonProps) {
  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div
      className={`skeleton skeleton--${variant} ${className}`}
      style={style}
    />
  );
}

// 카드 스켈레톤 프리셋
export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-card__header">
        <Skeleton variant="text" width="60%" height={20} />
        <Skeleton variant="rectangular" width={60} height={28} />
      </div>
      <Skeleton variant="text" width="80%" height={14} className="skeleton-card__line" />
      <Skeleton variant="text" width="70%" height={14} className="skeleton-card__line" />
    </div>
  );
}

// 마켓바 스켈레톤 프리셋
export function SkeletonMarketItem() {
  return (
    <div className="skeleton-market-item">
      <Skeleton variant="text" width="40%" height={12} />
      <Skeleton variant="text" width="70%" height={20} />
      <Skeleton variant="text" width="50%" height={14} />
    </div>
  );
}

// 픽 카드 스켈레톤 프리셋
export function SkeletonPickCard() {
  return (
    <div className="skeleton-pick-card">
      <div className="skeleton-pick-card__header">
        <div>
          <Skeleton variant="text" width={80} height={16} />
          <Skeleton variant="text" width={50} height={12} />
        </div>
        <Skeleton variant="rectangular" width={50} height={24} />
      </div>
      <div className="skeleton-pick-card__badges">
        <Skeleton variant="rectangular" width={40} height={20} />
        <Skeleton variant="rectangular" width={60} height={20} />
      </div>
      <Skeleton variant="text" width="90%" height={13} />
      <Skeleton variant="text" width="75%" height={13} />
    </div>
  );
}

export default Skeleton;
