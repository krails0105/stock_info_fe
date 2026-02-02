// src/components/TrustMeta.tsx
// 신뢰 메타 표시 컴포넌트 (기준시각, 출처, 커버리지)

import { Info } from 'lucide-react';
import './TrustMeta.css';

interface TrustMetaProps {
  asOf?: string;
  source?: string;
  coverage?: number;
  showTooltip?: boolean;
  size?: 'sm' | 'md';
}

// 시간 포맷팅 (HH:mm 또는 상대 시간)
function formatTime(isoString?: string): string {
  if (!isoString) return '';

  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);

    if (diffMin < 1) return '방금 전';
    if (diffMin < 60) return `${diffMin}분 전`;

    // 오늘이면 시간만 표시
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    }

    // 어제/이전이면 날짜+시간
    return date.toLocaleString('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

function TrustMeta({
  asOf,
  source,
  coverage,
  showTooltip = true,
  size = 'sm',
}: TrustMetaProps) {
  const formattedTime = formatTime(asOf);

  // 표시할 내용이 없으면 렌더링하지 않음
  if (!formattedTime && !source && coverage === undefined) {
    return null;
  }

  const tooltipContent = [
    asOf && `기준시각: ${new Date(asOf).toLocaleString('ko-KR')}`,
    source && `출처: ${source}`,
    coverage !== undefined && `데이터 커버리지: ${Math.round(coverage * 100)}%`,
  ]
    .filter(Boolean)
    .join('\n');

  return (
    <div className={`trust-meta trust-meta--${size}`} title={showTooltip ? tooltipContent : undefined}>
      {showTooltip && <Info size={size === 'sm' ? 12 : 14} className="trust-meta__icon" />}
      <span className="trust-meta__text">
        {formattedTime && <span className="trust-meta__time">{formattedTime}</span>}
        {source && <span className="trust-meta__source">{source}</span>}
        {coverage !== undefined && coverage < 0.7 && (
          <span className="trust-meta__coverage">일부 데이터</span>
        )}
      </span>
    </div>
  );
}

export default TrustMeta;
