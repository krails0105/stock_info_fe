// src/components/HomeRecents.tsx
// 홈 최근 본 종목 섹션 컴포넌트

import { Link } from 'react-router-dom';
import { Clock, ChevronRight } from 'lucide-react';
import useRecents from '../hooks/useRecents';
import './HomeRecents.css';

const MAX_DISPLAY = 5; // 홈에서 표시할 최대 개수

function HomeRecents() {
  const { recents, clearRecents } = useRecents();

  // 최근 본 종목이 없으면 섹션 숨김
  if (recents.length === 0) {
    return null;
  }

  // 표시할 목록
  const displayRecents = recents.slice(0, MAX_DISPLAY);

  // 시간 포맷팅
  const formatTime = (viewedAt: string) => {
    const now = new Date();
    const viewed = new Date(viewedAt);
    const diffMs = now.getTime() - viewed.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return '방금 전';
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;
    return viewed.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
  };

  return (
    <section className="home-recents">
      <div className="home-recents__header">
        <h2 className="home-recents__title">
          <Clock size={18} />
          최근 본 종목
        </h2>
        <button className="home-recents__clear" onClick={clearRecents}>
          전체 삭제
        </button>
      </div>

      <div className="home-recents__list">
        {displayRecents.map((item) => (
          <Link
            key={item.code}
            to={`/stock/${item.code}`}
            className="home-recents__item"
          >
            <div className="home-recents__item-info">
              <span className="home-recents__item-name">{item.name}</span>
              <span className="home-recents__item-code">{item.code}</span>
            </div>
            <span className="home-recents__item-time">
              {formatTime(item.viewedAt)}
            </span>
            <ChevronRight size={16} className="home-recents__item-arrow" />
          </Link>
        ))}
      </div>

      {recents.length > MAX_DISPLAY && (
        <p className="home-recents__more">
          +{recents.length - MAX_DISPLAY}개 더
        </p>
      )}
    </section>
  );
}

export default HomeRecents;
