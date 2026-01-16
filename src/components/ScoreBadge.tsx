// src/components/ScoreBadge.tsx
// ============================================================
// 📌 점수 배지 컴포넌트
//
// 점수와 라벨(STRONG/NEUTRAL/WEAK)을 시각적으로 보여주는 배지입니다.
// 라벨에 따라 색상이 달라집니다:
// - STRONG: 초록색 (강세)
// - NEUTRAL: 노란색 (보통)
// - WEAK: 빨간색 (약세)
// ============================================================

import type { ScoreLabel } from '../types';
import './ScoreBadge.css';

// ------------------------------------------------------------
// 📋 Props 인터페이스 정의
// ------------------------------------------------------------
interface ScoreBadgeProps {
  score: number;                   // 점수 (0~100)
  label: ScoreLabel;               // 라벨: 'STRONG' | 'NEUTRAL' | 'WEAK'
  size?: 'sm' | 'md' | 'lg';       // 크기 (선택, 기본값: 'md')
}

// ------------------------------------------------------------
// 🏷️ ScoreBadge 컴포넌트
// ------------------------------------------------------------
// { score, label, size = 'md' }:
// - 구조 분해 할당으로 props 추출
// - size = 'md': 기본값 설정. size가 전달되지 않으면 'md' 사용
function ScoreBadge({ score, label, size = 'md' }: ScoreBadgeProps) {
  // ----------------------------------------------------------
  // 📝 라벨 텍스트 매핑
  // ----------------------------------------------------------
  // 객체를 사용한 매핑: if-else 대신 깔끔하게 값을 변환
  // label 값을 key로 사용하여 해당하는 한글 텍스트를 가져옴
  const labelText = {
    STRONG: '강세',
    NEUTRAL: '보통',
    WEAK: '약세',
  };

  // ----------------------------------------------------------
  // 🔼 아이콘 매핑
  // ----------------------------------------------------------
  const icon = {
    STRONG: '▲',   // 상승 화살표
    NEUTRAL: '―',  // 수평선
    WEAK: '▼',     // 하락 화살표
  };

  // ----------------------------------------------------------
  // 🎨 렌더링
  // ----------------------------------------------------------
  return (
    // 동적 클래스명 생성
    // label.toLowerCase(): 'STRONG' → 'strong' (소문자로 변환)
    // 결과: "score-badge score-badge--strong score-badge--md"
    <div className={`score-badge score-badge--${label.toLowerCase()} score-badge--${size}`}>
      {/* 점수 */}
      <span className="score-badge__score">{score}</span>

      {/* 라벨 (아이콘 + 텍스트) */}
      <span className="score-badge__label">
        {/*
          icon[label]: label 값으로 icon 객체에서 값을 가져옴
          예: label이 'STRONG'이면 icon['STRONG'] = '▲'
        */}
        <span className="score-badge__icon">{icon[label]}</span>
        {/*
          labelText[label]: 같은 방식으로 한글 텍스트 가져옴
          예: labelText['STRONG'] = '강세'
        */}
        {labelText[label]}
      </span>
    </div>
  );
}

export default ScoreBadge;
