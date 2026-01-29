// src/components/HomeWatchlistPicks.tsx
// 홈 Watchlist Picks 컴포넌트

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, AlertTriangle, ChevronRight } from 'lucide-react';
import { getHomePicks } from '../services/api';
import type { StockPickCard, HomePicksResponse, PickBucket } from '../types';
import ScoreBadge from './ScoreBadge';
import { SkeletonPickCard } from './Skeleton';
import './HomeWatchlistPicks.css';

// 프리셋 탭 옵션
const PRESET_TABS = [
  { value: 'default', label: '전체' },
  { value: 'stable', label: '안정' },
  { value: 'momentum', label: '모멘텀' },
  { value: 'value', label: '저평가' },
];

// 버킷별 한글 라벨
const BUCKET_LABELS: Record<PickBucket, string> = {
  STABLE: '안정',
  REPRESENTATIVE: '섹터대표',
  MOMENTUM: '모멘텀',
  VALUE: '저평가',
  NEWS: '이슈',
};

function HomeWatchlistPicks() {
  const navigate = useNavigate();
  const [data, setData] = useState<HomePicksResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [preset, setPreset] = useState('default');

  // 프리셋 변경 시 데이터 재조회
  useEffect(() => {
    setLoading(true);
    getHomePicks(8, preset)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [preset]);

  // 카드 클릭 시 종목 상세로 이동
  const handleCardClick = (code: string) => {
    navigate(`/stock/${code}`);
  };

  // 로딩 중: Skeleton
  if (loading) {
    return (
      <div className="watchlist-picks">
        <div className="watchlist-picks__header">
          <h2 className="watchlist-picks__title">오늘 주목할 종목</h2>
          <p className="watchlist-picks__subtitle">
            오늘 볼 만한 종목을 초보자 관점으로 추렸어요
          </p>
        </div>
        <div className="watchlist-picks__tabs">
          {PRESET_TABS.map((tab) => (
            <button
              key={tab.value}
              className={`watchlist-picks__tab ${preset === tab.value ? 'active' : ''}`}
              disabled
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="watchlist-picks__grid">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonPickCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  // 데이터 없음
  if (!data || data.items.length === 0) {
    return null;
  }

  return (
    <div className="watchlist-picks">
      {/* 헤더 */}
      <div className="watchlist-picks__header">
        <h2 className="watchlist-picks__title">오늘 주목할 종목</h2>
        <p className="watchlist-picks__subtitle">
          오늘 볼 만한 종목을 초보자 관점으로 추렸어요
        </p>
      </div>

      {/* 프리셋 탭 */}
      <div className="watchlist-picks__tabs">
        {PRESET_TABS.map((tab) => (
          <button
            key={tab.value}
            className={`watchlist-picks__tab ${preset === tab.value ? 'active' : ''}`}
            onClick={() => setPreset(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 종목 카드 그리드 */}
      <div className="watchlist-picks__grid">
        {data.items.map((item: StockPickCard) => (
          <div
            key={item.code}
            className="pick-card"
            onClick={() => handleCardClick(item.code)}
          >
            {/* 카드 헤더: 종목명 + 점수 뱃지 */}
            <div className="pick-card__header">
              <div className="pick-card__info">
                <span className="pick-card__name">{item.name}</span>
                <span className="pick-card__code">{item.code}</span>
              </div>
              <ScoreBadge score={item.scoreValue} label={item.grade} size="sm" />
            </div>

            {/* 배지: 버킷 + 섹터 */}
            <div className="pick-card__badges">
              <span className={`pick-card__bucket ${item.pickBucket.toLowerCase()}`}>
                {BUCKET_LABELS[item.pickBucket]}
              </span>
              <span className="pick-card__sector">{item.sectorName}</span>
            </div>

            {/* 이유 목록 (2개) */}
            <ul className="pick-card__reasons">
              {item.reasons.map((reason, idx) => (
                <li key={idx}>
                  <Check size={14} className="pick-card__reason-icon" />
                  {reason}
                </li>
              ))}
            </ul>

            {/* 주의사항 (있을 때만) */}
            {item.caution && (
              <div className="pick-card__caution">
                <AlertTriangle size={14} className="pick-card__caution-icon" />
                {item.caution}
              </div>
            )}

            {/* 더보기 화살표 */}
            <div className="pick-card__arrow">
              <ChevronRight size={16} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomeWatchlistPicks;
