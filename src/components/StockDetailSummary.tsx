// src/components/StockDetailSummary.tsx
// ============================================================
// 종목 10초 요약 컴포넌트
//
// 스펙에 따른 구성:
// 1) 점수/등급 + 한 줄 결론 (가이드 톤)
// 2) 긍정 2~3개 + 주의 1~2개 (카드/칩)
// 3) 행동 힌트 1줄
// 4) "자세히 보기" (접기/펼치기)
// ============================================================

import { useState } from 'react';
import type { StockInsight, ReasonCard } from '../types';
import ScoreBadge from './ScoreBadge';
import './StockDetailSummary.css';

interface StockDetailSummaryProps {
  insight: StockInsight;
  onExpandDetail?: () => void;
}

export default function StockDetailSummary({ insight, onExpandDetail }: StockDetailSummaryProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const { entity, score, summary, reasons, meta } = insight;

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded && onExpandDetail) {
      onExpandDetail();
    }
  };

  return (
    <div className="stock-detail-summary">
      {/* 헤더: 종목명 + 점수 배지 */}
      <div className="summary-header">
        <div className="summary-title">
          <h2 className="stock-name">{entity.name}</h2>
          <span className="stock-code">{entity.code}</span>
        </div>
        <ScoreBadge score={score.value} label={score.grade} size="lg" />
      </div>

      {/* 한 줄 결론 (헤드라인) */}
      <p className={`summary-headline ${summary.tone === 'CAUTIOUS_GUIDE' ? 'cautious' : 'active'}`}>
        {summary.headline}
      </p>

      {/* 긍정/주의 카드 영역 */}
      <div className="reason-cards">
        {/* 긍정 카드 */}
        <div className="reason-section positive">
          {reasons.positive.map((card, index) => (
            <ReasonCardChip key={`pos-${index}`} card={card} />
          ))}
        </div>

        {/* 주의 카드 */}
        <div className="reason-section caution">
          {reasons.caution.map((card, index) => (
            <ReasonCardChip key={`cau-${index}`} card={card} />
          ))}
        </div>
      </div>

      {/* 행동 힌트 */}
      <div className="action-hint">
        <span className="hint-icon">➜</span>
        <span className="hint-text">{summary.actionHint.text}</span>
      </div>

      {/* 메타 정보 (작게) */}
      <div className="meta-info">
        <span className="meta-item">
          기준: {new Date(meta.asOf).toLocaleString('ko-KR', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
        <span className="meta-item">출처: {meta.sources.join(', ')}</span>
        {meta.coverage < 0.7 && (
          <span className="meta-item coverage-low">정보 일부 부족</span>
        )}
      </div>

      {/* 자세히 보기 토글 */}
      <button className="expand-toggle" onClick={handleToggleExpand}>
        {isExpanded ? '접기' : '자세히 보기'}
        <span className={`toggle-icon ${isExpanded ? 'expanded' : ''}`}>▼</span>
      </button>

      {/* 확장 영역 (접힌 상태에서 숨김) */}
      {isExpanded && (
        <div className="expanded-content">
          <div className="triggered-rules">
            <h4>적용된 분석 규칙</h4>
            <div className="rules-list">
              {reasons.triggeredRules.map((rule, index) => (
                <span key={index} className="rule-tag">{rule}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ------------------------------------------------------------
// 근거 카드 칩 컴포넌트
// ------------------------------------------------------------
interface ReasonCardChipProps {
  card: ReasonCard;
}

function ReasonCardChip({ card }: ReasonCardChipProps) {
  const isPositive = card.polarity === 'POSITIVE';
  const icon = isPositive ? '✅' : '⚠️';

  return (
    <div className={`reason-card-chip ${card.polarity.toLowerCase()}`}>
      <span className="card-icon">{icon}</span>
      <span className="card-text">{card.text}</span>
    </div>
  );
}
