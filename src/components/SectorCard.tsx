// src/components/SectorCard.tsx
// 섹터 카드 컴포넌트

import { Link } from 'react-router-dom';
import { Check, AlertTriangle, ExternalLink, ChevronRight } from 'lucide-react';
import type { SectorScore } from '../types';
import ScoreBadge from './ScoreBadge';
import SectorFavoriteButton from './SectorFavoriteButton';
import './SectorCard.css';

interface SectorCardProps {
  sector: SectorScore;
  rank?: number;
}

function SectorCard({ sector, rank }: SectorCardProps) {
  return (
    <Link
      to={`/sector/${encodeURIComponent(sector.sectorName)}`}
      className="sector-card"
    >
      {/* 순위 배지 */}
      {rank && <div className="sector-card__rank">#{rank}</div>}

      {/* 헤더: 섹터명 + 점수 배지 + 즐겨찾기 */}
      <div className="sector-card__header">
        <h3 className="sector-card__name">{sector.sectorName}</h3>
        <ScoreBadge score={sector.score} label={sector.label} />
        <SectorFavoriteButton sectorName={sector.sectorName} size="sm" />
      </div>

      {/* 표본 적음 경고 배지 */}
      {sector.stockCount !== undefined && sector.stockCount < 5 && (
        <div className="sector-card__low-sample-badge">
          <AlertTriangle size={12} />
          표본 적음({sector.stockCount})
        </div>
      )}

      {/* 이유 목록 (최대 2개) */}
      <ul className="sector-card__reasons">
        {sector.reasons
          .filter((r) => !r.includes('종목 포함'))
          .slice(0, 2)
          .map((reason, idx) => (
            <li key={idx}>
              <Check size={14} className="sector-card__reason-icon" />
              {reason}
            </li>
          ))}
      </ul>

      {/* 관련 뉴스 */}
      {sector.headlines && sector.headlines.length > 0 && (
        <div className="sector-card__headlines">
          {sector.headlines.slice(0, 2).map((news, idx) => (
            <a
              key={idx}
              href={news.url}
              target="_blank"
              rel="noopener noreferrer"
              className="sector-card__headline"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={12} className="sector-card__headline-icon" />
              {news.title}
            </a>
          ))}
        </div>
      )}

      {/* 더보기 화살표 (hover 시 표시) */}
      <div className="sector-card__arrow">
        <ChevronRight size={18} />
      </div>
    </Link>
  );
}

export default SectorCard;
