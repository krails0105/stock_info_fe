// src/components/SectorCard.tsx
// ============================================================
// 📌 섹터 카드 컴포넌트
// 하나의 섹터 정보를 카드 형태로 보여주는 재사용 가능한 컴포넌트입니다.
// ============================================================

// ------------------------------------------------------------
// 📦 import
// ------------------------------------------------------------
// react-router-dom의 Link: 페이지 이동을 위한 컴포넌트
// HTML의 <a> 태그와 비슷하지만, 페이지 전체를 새로고침하지 않고 이동합니다 (SPA 방식)
import { Link } from 'react-router-dom';

// 타입 가져오기
import type { SectorScore } from '../types';

// 다른 컴포넌트 가져오기
import ScoreBadge from './ScoreBadge';

// CSS 가져오기
import './SectorCard.css';

// ------------------------------------------------------------
// 📋 interface: TypeScript에서 객체의 형태를 정의합니다.
// ------------------------------------------------------------
// Props(Properties)란?
// - 부모 컴포넌트가 자식 컴포넌트에게 전달하는 데이터입니다.
// - 함수의 매개변수와 비슷한 개념입니다.
//
// 이 컴포넌트가 받을 수 있는 props를 정의합니다:
interface SectorCardProps {
  sector: SectorScore;  // 필수: 섹터 데이터
  rank?: number;        // 선택(물음표): 순위. 없으면 undefined
}

// ------------------------------------------------------------
// 🃏 SectorCard 컴포넌트
// ------------------------------------------------------------
// { sector, rank }: 구조 분해 할당(Destructuring)
// props 객체에서 sector와 rank를 꺼내서 바로 변수로 사용합니다.
//
// 이것은 아래와 동일합니다:
// function SectorCard(props) {
//   const sector = props.sector;
//   const rank = props.rank;
// }
function SectorCard({ sector, rank }: SectorCardProps) {
  return (
    // Link 컴포넌트: 클릭하면 해당 경로로 이동
    // to={...}: 이동할 경로
    //
    // encodeURIComponent(): URL에 안전하게 넣기 위해 특수문자를 변환
    // 예: "반도체/2차전지" → "반도체%2F2차전지"
    //
    // 템플릿 리터럴 (`백틱`):
    // - 문자열 안에 ${변수}를 넣어 동적으로 문자열을 만들 수 있습니다.
    // - 예: `/sector/${sectorName}` → "/sector/반도체"
    <Link
      to={`/sector/${encodeURIComponent(sector.sectorName)}`}
      className="sector-card"
    >
      {/*
        조건부 렌더링: rank가 있을 때만 순위 표시
        rank && <div>...</div>

        JavaScript에서 && 연산자:
        - 앞이 truthy면 뒤의 값을 반환
        - 앞이 falsy면 앞의 값을 반환

        rank가 1이면: 1 && <div>...</div> → <div>...</div> 반환
        rank가 undefined면: undefined && <div>...</div> → undefined 반환 (아무것도 렌더링 안 됨)
      */}
      {rank && <div className="sector-card__rank">#{rank}</div>}

      {/* 헤더: 섹터명 + 점수 배지 */}
      <div className="sector-card__header">
        <h3 className="sector-card__name">{sector.sectorName}</h3>
        {/*
          ScoreBadge 컴포넌트에 props 전달
          score={sector.score}: sector 객체의 score 값을 ScoreBadge의 score prop으로 전달
          label={sector.label}: sector 객체의 label 값을 ScoreBadge의 label prop으로 전달
        */}
        <ScoreBadge score={sector.score} label={sector.label} />
      </div>

      {/* P0-1: 표본 적음 경고 배지 (종목 수 5개 미만) */}
      {sector.stockCount !== undefined && sector.stockCount < 5 && (
        <div className="sector-card__low-sample-badge">
          표본 적음({sector.stockCount})
        </div>
      )}

      {/* 이유 목록 (UI 가이드: 최대 2개, "총 N개 종목 포함" 제외) */}
      <ul className="sector-card__reasons">
        {sector.reasons
          .filter((r) => !r.includes('종목 포함'))  // "총 N개 종목 포함" 제외
          .slice(0, 2)  // 최대 2개만 표시
          .map((reason, idx) => (
            <li key={idx}>{reason}</li>
          ))}
      </ul>

      {/*
        옵셔널 체이닝 (?.):
        sector.headlines가 undefined/null이면 뒤의 .length를 실행하지 않고 undefined 반환

        sector.headlines?.length > 0의 의미:
        - headlines가 있고, 그 길이가 0보다 크면 true

        &&: 조건이 true일 때만 뒤의 JSX 렌더링
      */}
      {sector.headlines && sector.headlines.length > 0 && (
        <div className="sector-card__headlines">
          {sector.headlines.slice(0, 2).map((news, idx) => (
            <a
              key={idx}
              href={news.url}
              target="_blank"              // 새 탭에서 열기
              rel="noopener noreferrer"   // 보안: 새 탭에서 원래 페이지 조작 방지
              className="sector-card__headline"
              // onClick 이벤트 핸들러
              // (e) => e.stopPropagation(): 이벤트 버블링 중지
              // 즉, 이 링크를 클릭해도 부모 Link의 클릭 이벤트가 발생하지 않음
              onClick={(e) => e.stopPropagation()}
            >
              {news.title}
            </a>
          ))}
        </div>
      )}
    </Link>
  );
}

// 컴포넌트를 외부에서 사용할 수 있도록 내보내기
export default SectorCard;
