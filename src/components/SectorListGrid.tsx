// src/components/SectorListGrid.tsx
// ============================================================
// 📌 섹터 목록 그리드 컴포넌트
//
// 전체 섹터를 그리드 형태로 보여줍니다.
// 점수순/가나다순 정렬 기능이 있습니다.
// ============================================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { SectorScore } from '../types';
import ScoreBadge from './ScoreBadge';
import './SectorListGrid.css';

// ------------------------------------------------------------
// 📋 타입 정의
// ------------------------------------------------------------
// 'type'으로 정렬 옵션의 가능한 값들을 정의
// 유니온 타입: 'score' 또는 'name' 중 하나만 가능
type SortOption = 'score' | 'name';

// Props 인터페이스
interface SectorListGridProps {
  sectors: SectorScore[];  // 섹터 배열 (필수)
}

// ------------------------------------------------------------
// 📊 SectorListGrid 컴포넌트
// ------------------------------------------------------------
function SectorListGrid({ sectors }: SectorListGridProps) {
  // ----------------------------------------------------------
  // 📊 상태: 정렬 기준
  // ----------------------------------------------------------
  // useState<SortOption>: 상태의 타입을 SortOption으로 지정
  // 초기값: 'score' (점수순)
  const [sortBy, setSortBy] = useState<SortOption>('score');

  // ----------------------------------------------------------
  // 🔄 정렬된 섹터 배열 계산
  // ----------------------------------------------------------
  // [...sectors]: 스프레드 연산자로 배열 복사
  // 원본 배열을 직접 수정하지 않고 새 배열을 만들어서 정렬
  //
  // .sort(): 배열을 정렬하는 메서드
  // 콜백 함수 (a, b) => ... 의 반환값:
  // - 음수: a가 앞으로
  // - 양수: b가 앞으로
  // - 0: 순서 유지
  const sortedSectors = [...sectors].sort((a, b) => {
    if (sortBy === 'score') {
      // 점수 내림차순: 높은 점수가 먼저
      // b.score - a.score: b가 크면 양수 → b가 앞으로
      return b.score - a.score;
    }
    // 가나다순 (한글 정렬)
    // .localeCompare(): 문자열 비교 메서드
    // 'ko': 한국어 로케일 사용
    return a.sectorName.localeCompare(b.sectorName, 'ko');
  });

  // ----------------------------------------------------------
  // 🎨 렌더링
  // ----------------------------------------------------------
  return (
    <div className="sector-grid">
      {/* 헤더: 제목 + 정렬 버튼 */}
      <div className="sector-grid__header">
        <h2 className="sector-grid__title">전체 섹터</h2>

        {/* 정렬 버튼 그룹 */}
        <div className="sector-grid__sort">
          {/*
            정렬 버튼: 점수순
            onClick: 클릭 시 setSortBy('score') 실행

            className에서 조건부 클래스 추가:
            sortBy === 'score' 이면 'sort-btn--active' 클래스 추가
          */}
          <button
            className={`sort-btn ${sortBy === 'score' ? 'sort-btn--active' : ''}`}
            onClick={() => setSortBy('score')}
          >
            점수순
          </button>

          {/* 정렬 버튼: 가나다순 */}
          <button
            className={`sort-btn ${sortBy === 'name' ? 'sort-btn--active' : ''}`}
            onClick={() => setSortBy('name')}
          >
            가나다순
          </button>
        </div>
      </div>

      {/* 섹터 그리드 */}
      <div className="sector-grid__list">
        {/*
          정렬된 섹터 배열을 순회하며 각 섹터를 렌더링
        */}
        {sortedSectors.map((sector) => (
          // Link: 클릭 시 해당 섹터 상세 페이지로 이동
          <Link
            key={sector.sectorId}
            to={`/sector/${encodeURIComponent(sector.sectorName)}`}
            className="sector-grid__item"
          >
            {/* 섹터명 */}
            <span className="sector-grid__item-name">{sector.sectorName}</span>

            {/* 점수 배지 (작은 사이즈) */}
            <ScoreBadge score={sector.score} label={sector.label} size="sm" />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default SectorListGrid;
