// src/components/HomeObservationBar.tsx
// 홈 관찰 포인트 컴포넌트 - 오늘 시장 1줄 인사이트

import { useMemo } from 'react';
import { Lightbulb, Info } from 'lucide-react';
import type { SectorScore, HomePicksResponse } from '../types';
import './HomeObservationBar.css';

interface HomeObservationBarProps {
  sectors: SectorScore[];
  picks?: HomePicksResponse | null;
  loading?: boolean;
}

// 관찰 포인트 생성 (단정적 투자 조언 금지)
function generateObservation(
  sectors: SectorScore[],
  picks?: HomePicksResponse | null
): { text: string; basis: string } | null {
  if (sectors.length === 0) {
    return null;
  }

  // 최소 표본 수 필터링된 섹터
  const validSectors = sectors.filter((s) => (s.stockCount ?? 0) >= 5);
  if (validSectors.length === 0) {
    return null;
  }

  // TOP 3 강세 섹터
  const topSectors = [...validSectors]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const strongSectors = topSectors.filter((s) => s.label === 'STRONG');
  const avgTopScore = Math.round(
    topSectors.reduce((sum, s) => sum + s.score, 0) / topSectors.length
  );

  // 템플릿 선택 (관찰형 표현만 사용)
  // 1. 강세 섹터 기반
  if (strongSectors.length >= 2) {
    const names = strongSectors.slice(0, 2).map((s) => s.sectorName).join(', ');
    return {
      text: `${names} 섹터가 강세 흐름을 유지하고 있어요.`,
      basis: `표본 ${validSectors.length}개 섹터 기준`,
    };
  }

  // 2. 단일 강세 섹터
  if (strongSectors.length === 1) {
    return {
      text: `${strongSectors[0].sectorName} 섹터가 상위권을 유지하는 경향이에요.`,
      basis: `점수 ${strongSectors[0].score}점 기준`,
    };
  }

  // 3. 평균 점수 기반
  if (avgTopScore >= 65) {
    return {
      text: `주요 섹터들이 양호한 흐름을 보이고 있어요.`,
      basis: `상위 3개 섹터 평균 ${avgTopScore}점`,
    };
  }

  // 4. 보합/약세 시장
  if (avgTopScore >= 50) {
    return {
      text: `시장이 보합권에서 움직이고 있어요. 관망하며 지켜보세요.`,
      basis: `상위 3개 섹터 평균 ${avgTopScore}점`,
    };
  }

  // 5. 약세 시장
  if (avgTopScore < 50) {
    return {
      text: `시장이 조정 흐름을 보이고 있어요. 신중한 접근이 필요해요.`,
      basis: `상위 3개 섹터 평균 ${avgTopScore}점`,
    };
  }

  // 6. picks 기반 (옵션)
  if (picks && picks.items.length > 0) {
    const stableCount = picks.items.filter((p) => p.pickBucket === 'STABLE').length;
    if (stableCount >= 2) {
      return {
        text: `안정적인 종목들이 오늘 눈에 띄어요.`,
        basis: `안정 종목 ${stableCount}개 선정됨`,
      };
    }
  }

  return null;
}

function HomeObservationBar({ sectors, picks, loading }: HomeObservationBarProps) {
  const observation = useMemo(
    () => generateObservation(sectors, picks),
    [sectors, picks]
  );

  // 로딩 중
  if (loading) {
    return (
      <div className="observation-bar observation-bar--loading">
        <div className="observation-bar__skeleton" />
      </div>
    );
  }

  // 관찰 포인트 없음
  if (!observation) {
    return (
      <div className="observation-bar observation-bar--empty">
        <Info size={16} className="observation-bar__icon" />
        <span className="observation-bar__text">
          오늘은 뚜렷한 관찰 포인트가 없어요.
        </span>
      </div>
    );
  }

  return (
    <div className="observation-bar">
      <div className="observation-bar__content">
        <Lightbulb size={18} className="observation-bar__icon" />
        <div className="observation-bar__text-wrapper">
          <span className="observation-bar__label">오늘 관찰 포인트</span>
          <span className="observation-bar__text">{observation.text}</span>
        </div>
      </div>
      <span className="observation-bar__basis">{observation.basis}</span>
    </div>
  );
}

export default HomeObservationBar;
