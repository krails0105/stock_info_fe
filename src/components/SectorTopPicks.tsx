// src/components/SectorTopPicks.tsx
// ============================================================
// 섹터 Top Picks 컴포넌트
//
// 스펙에 따른 구성:
// - 섹터 브리핑 1줄 + Top Picks 3~5개
// - 각 종목 카드에 이유 2~3줄 + 주의 1줄
// ============================================================

import { useNavigate } from 'react-router-dom';
import type { SectorInsight, TopPick, ScoreLabel } from '../types';
import ScoreBadge from './ScoreBadge';
import './SectorTopPicks.css';

interface SectorTopPicksProps {
  insight: SectorInsight;
}

export default function SectorTopPicks({ insight }: SectorTopPicksProps) {
  const navigate = useNavigate();
  const { entity, summary, topPicks } = insight;

  const handleStockClick = (stockCode: string) => {
    navigate(`/stock/${stockCode}`);
  };

  return (
    <div className="sector-top-picks">
      {/* 섹터 헤더 + 브리핑 */}
      <div className="sector-header">
        <h2 className="sector-name">{entity.name}</h2>
        <p className="sector-headline">{summary.headline}</p>
        {summary.drivers.length > 0 && (
          <ul className="sector-drivers">
            {summary.drivers.map((driver, index) => (
              <li key={index}>{driver}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Top Picks 섹션 */}
      <div className="top-picks-section">
        <h3 className="section-title">
          <span className="title-icon">🏆</span>
          {/* P0-3: 동적 섹션 타이틀 (백엔드에서 전달, 없으면 기본값) */}
          {insight.sectionTitle || `우선 검토 종목 Top ${topPicks.length}`}
        </h3>

        <div className="top-picks-grid">
          {topPicks.map((pick, index) => (
            <TopPickCard
              key={pick.code}
              pick={pick}
              rank={index + 1}
              onClick={() => handleStockClick(pick.code)}
            />
          ))}
        </div>
      </div>

      {/* 안내 문구 */}
      <p className="disclaimer">
        투자 판단은 본인의 기준과 추가 분석을 바탕으로 내려주세요.
      </p>
    </div>
  );
}

// ------------------------------------------------------------
// Top Pick 개별 카드 컴포넌트
// ------------------------------------------------------------
interface TopPickCardProps {
  pick: TopPick;
  rank: number;
  onClick: () => void;
}

function TopPickCard({ pick, rank, onClick }: TopPickCardProps) {
  const pickTypeLabel = getPickTypeLabel(pick.pickType);
  const pickTypeClass = pick.pickType.toLowerCase();
  const roleLabel = getRoleLabel(pick.role);

  return (
    <div className="top-pick-card" onClick={onClick}>
      {/* P0-3 UI: role 배지 (카드 상단에 표시) */}
      {roleLabel && (
        <div className={`pick-role-badge ${pick.role?.toLowerCase()}`}>
          {roleLabel}
        </div>
      )}

      {/* 순위 + 종목명 */}
      <div className="pick-header">
        <span className="pick-rank">#{rank}</span>
        <div className="pick-info">
          <span className="pick-name">{pick.name}</span>
          <span className="pick-code">{pick.code}</span>
        </div>
        <ScoreBadge score={gradeToScore(pick.grade)} label={pick.grade} size="sm" />
      </div>

      {/* 픽 유형 태그 */}
      <div className={`pick-type-tag ${pickTypeClass}`}>
        {pickTypeLabel}
      </div>

      {/* 이유 목록 (UI 가이드: 2줄만 기본 노출) */}
      <ul className="pick-reasons">
        {pick.reasons.slice(0, 2).map((reason, index) => (
          <li key={index} className="reason-item positive">
            <span className="reason-icon">✅</span>
            {reason}
          </li>
        ))}
      </ul>

      {/* 주의사항 (있을 경우) */}
      {pick.caution && (
        <div className="pick-caution">
          <span className="caution-icon">⚠️</span>
          {pick.caution}
        </div>
      )}

      {/* 클릭 안내 */}
      <div className="pick-action">
        상세 보기 →
      </div>
    </div>
  );
}

// ------------------------------------------------------------
// 유틸리티 함수
// ------------------------------------------------------------

function getPickTypeLabel(pickType: string): string {
  const labels: Record<string, string> = {
    STABLE: '안정형',
    VALUE: '밸류형',
    GROWTH: '성장형',
    MOMENTUM: '모멘텀형',
    WATCH: '관찰형'
  };
  return labels[pickType] || pickType;
}

// P0-3 UI: role 라벨 변환 (REPRESENTATIVE → 섹터 대표, WATCHLIST_PRIORITY → 우선 관찰)
function getRoleLabel(role?: string): string | null {
  if (!role) return null;
  const labels: Record<string, string> = {
    REPRESENTATIVE: '섹터 대표',
    WATCHLIST_PRIORITY: '우선 관찰'
  };
  return labels[role] || null;
}

function gradeToScore(grade: ScoreLabel): number {
  switch (grade) {
    case 'STRONG': return 80;
    case 'NEUTRAL': return 55;
    case 'WEAK': return 25;
    default: return 50;
  }
}
