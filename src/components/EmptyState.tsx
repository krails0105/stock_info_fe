// src/components/EmptyState.tsx
// 빈 상태 컴포넌트 (SVG 일러스트 포함)

import { SearchX, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';
import './EmptyState.css';

type EmptyStateVariant = 'no-data' | 'error' | 'search' | 'loading-failed';

interface EmptyStateProps {
  variant?: EmptyStateVariant;
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// 기본 메시지 설정
const defaultMessages: Record<EmptyStateVariant, { title: string; description: string }> = {
  'no-data': {
    title: '데이터가 없습니다',
    description: '현재 표시할 데이터가 없습니다.',
  },
  error: {
    title: '오류가 발생했습니다',
    description: '데이터를 불러오는 중 문제가 발생했습니다.',
  },
  search: {
    title: '검색 결과가 없습니다',
    description: '다른 검색어로 다시 시도해 보세요.',
  },
  'loading-failed': {
    title: '불러오기 실패',
    description: '네트워크 연결을 확인해 주세요.',
  },
};

// 아이콘 매핑
const iconMap: Record<EmptyStateVariant, React.ReactNode> = {
  'no-data': <TrendingUp size={48} strokeWidth={1.5} />,
  error: <AlertCircle size={48} strokeWidth={1.5} />,
  search: <SearchX size={48} strokeWidth={1.5} />,
  'loading-failed': <RefreshCw size={48} strokeWidth={1.5} />,
};

function EmptyState({
  variant = 'no-data',
  title,
  description,
  action,
}: EmptyStateProps) {
  const messages = defaultMessages[variant];

  return (
    <div className="empty-state">
      {/* SVG 일러스트 배경 */}
      <div className="empty-state__illustration">
        <svg
          className="empty-state__bg-pattern"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="100" cy="100" r="80" fill="url(#emptyGradient)" opacity="0.5" />
          <circle cx="100" cy="100" r="60" fill="url(#emptyGradient)" opacity="0.3" />
          <defs>
            <radialGradient id="emptyGradient" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" stopColor="var(--accent-primary-light)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
        </svg>
        <div className="empty-state__icon">
          {iconMap[variant]}
        </div>
      </div>

      {/* 텍스트 */}
      <h3 className="empty-state__title">{title || messages.title}</h3>
      <p className="empty-state__description">{description || messages.description}</p>

      {/* 액션 버튼 */}
      {action && (
        <button className="empty-state__action" onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
