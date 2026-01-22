// src/components/NewsHeadlineList.tsx
// ============================================================
// 뉴스 헤드라인 리스트 컴포넌트
//
// 스펙에 따른 구성:
// - 이슈 브리핑 (2~3줄 요약)
// - 뉴스 헤드라인 카드 리스트
// - 뉴스 태그, 중요도 표시
// ============================================================

import type { InsightNews, InsightNewsItem, NewsTag, NewsImportance } from '../types';
import './NewsHeadlineList.css';

interface NewsHeadlineListProps {
  news: InsightNews;
  maxItems?: number;
}

export default function NewsHeadlineList({ news, maxItems = 5 }: NewsHeadlineListProps) {
  const { issueBrief, headlineItems } = news;
  const displayItems = headlineItems.slice(0, maxItems);

  if (headlineItems.length === 0 && issueBrief.length === 0) {
    return (
      <div className="news-headline-list empty">
        <p className="empty-message">관련 뉴스가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="news-headline-list">
      {/* 이슈 브리핑 */}
      {issueBrief.length > 0 && (
        <div className="issue-brief-section">
          <h3 className="section-title">
            <span className="title-icon">📋</span>
            이슈 브리핑
          </h3>
          <ul className="issue-brief-list">
            {issueBrief.map((brief, index) => (
              <li key={index} className="brief-item">{brief}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 뉴스 헤드라인 리스트 */}
      {displayItems.length > 0 && (
        <div className="headlines-section">
          <h3 className="section-title">
            <span className="title-icon">📰</span>
            관련 뉴스
          </h3>
          <div className="headlines-list">
            {displayItems.map((item, index) => (
              <NewsHeadlineCard key={item.url || index} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ------------------------------------------------------------
// 뉴스 헤드라인 개별 카드 컴포넌트
// ------------------------------------------------------------
interface NewsHeadlineCardProps {
  item: InsightNewsItem;
}

function NewsHeadlineCard({ item }: NewsHeadlineCardProps) {
  const { title, publisher, publishedAt, url, tags, importance } = item;

  const handleClick = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const formattedDate = formatDate(publishedAt);
  const importanceClass = getImportanceClass(importance);

  return (
    <div className={`news-headline-card ${importanceClass}`} onClick={handleClick}>
      {/* 중요도 인디케이터 */}
      {importance === 'HIGH' && (
        <span className="importance-badge">중요</span>
      )}

      {/* 제목 */}
      <h4 className="news-title">{title}</h4>

      {/* 메타 정보 */}
      <div className="news-meta">
        <span className="news-publisher">{publisher}</span>
        <span className="news-date">{formattedDate}</span>
      </div>

      {/* 태그 */}
      {tags.length > 0 && (
        <div className="news-tags">
          {tags.map((tag, index) => (
            <span key={index} className={`news-tag ${tag.toLowerCase()}`}>
              {getTagLabel(tag)}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ------------------------------------------------------------
// 유틸리티 함수
// ------------------------------------------------------------

function getTagLabel(tag: NewsTag): string {
  const labels: Record<NewsTag, string> = {
    EARNINGS: '실적',
    CONTRACT: '수주',
    BUYBACK_DIVIDEND: '배당/자사주',
    REGULATION_RISK: '규제/리스크',
    MA: 'M&A',
    INDUSTRY: '산업동향',
    RUMOR: '루머'
  };
  return labels[tag] || tag;
}

function getImportanceClass(importance: NewsImportance): string {
  switch (importance) {
    case 'HIGH': return 'importance-high';
    case 'MEDIUM': return 'importance-medium';
    case 'LOW': return 'importance-low';
    default: return '';
  }
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) {
      return '방금 전';
    } else if (diffHours < 24) {
      return `${diffHours}시간 전`;
    } else if (diffDays < 7) {
      return `${diffDays}일 전`;
    } else {
      return date.toLocaleDateString('ko-KR', {
        month: 'short',
        day: 'numeric'
      });
    }
  } catch {
    return dateString;
  }
}
