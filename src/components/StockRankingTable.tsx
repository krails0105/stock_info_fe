// src/components/StockRankingTable.tsx
// ============================================================
// 📌 종목 랭킹 테이블 컴포넌트
//
// 종목들을 테이블 형태로 보여줍니다.
// 순위, 종목명, 점수, 현재가, 등락률, (선택) PER/PBR을 표시합니다.
// ============================================================

import { Link } from 'react-router-dom';
import type { StockScore } from '../types';
import ScoreBadge from './ScoreBadge';
import './StockRankingTable.css';

// ------------------------------------------------------------
// 📋 Props 인터페이스
// ------------------------------------------------------------
interface StockRankingTableProps {
  stocks: StockScore[];      // 종목 배열 (필수)
  showPer?: boolean;         // PER 표시 여부 (선택, 기본값: false)
  showPbr?: boolean;         // PBR 표시 여부 (선택, 기본값: false)
}

// ------------------------------------------------------------
// 📊 StockRankingTable 컴포넌트
// ------------------------------------------------------------
// 구조 분해 할당 + 기본값 설정
// showPer = false: showPer가 전달되지 않으면 false
function StockRankingTable({ stocks, showPer = false, showPbr = false }: StockRankingTableProps) {
  return (
    <div className="stock-ranking">
      {/* HTML 테이블 */}
      <table className="stock-ranking__table">
        {/* 테이블 헤더 */}
        <thead>
          <tr>
            <th className="col-rank">#</th>
            <th className="col-name">종목명</th>
            <th className="col-score">점수</th>
            <th className="col-price">현재가</th>
            <th className="col-change">등락률</th>
            {/*
              조건부 렌더링으로 컬럼 표시/숨김
              showPer가 true일 때만 PER 컬럼 표시
            */}
            {showPer && <th className="col-per">PER</th>}
            {showPbr && <th className="col-pbr">PBR</th>}
          </tr>
        </thead>

        {/* 테이블 본문 */}
        <tbody>
          {/*
            stocks 배열을 순회
            (stock, idx): 각 요소와 인덱스
            idx는 0부터 시작하므로 순위 표시할 때 +1
          */}
          {stocks.map((stock, idx) => {
            // 상승/하락 판단
            const isUp = stock.changePercent > 0;
            const isDown = stock.changePercent < 0;
            // 부호 결정
            const sign = isUp ? '+' : '';

            return (
              // 테이블 행
              // key: 각 행을 구분하기 위한 고유값
              <tr key={stock.code}>
                {/* 순위 */}
                <td className="col-rank">{idx + 1}</td>

                {/* 종목명 (클릭 시 상세 페이지로 이동) */}
                <td className="col-name">
                  <Link to={`/stock/${stock.code}`} className="stock-link">
                    {stock.name}
                    {/* 종목 코드 (작게 표시) */}
                    <span className="stock-code">{stock.code}</span>
                  </Link>
                </td>

                {/* 점수 배지 */}
                <td className="col-score">
                  <ScoreBadge score={stock.score} label={stock.label} size="sm" />
                </td>

                {/* 현재가 */}
                <td className="col-price">{stock.price.toLocaleString()}원</td>

                {/*
                  등락률
                  동적 클래스: 상승이면 'up', 하락이면 'down' 추가
                */}
                <td className={`col-change ${isUp ? 'up' : ''} ${isDown ? 'down' : ''}`}>
                  {/*
                    .toFixed(2): 소수점 2자리까지 표시
                  */}
                  {sign}{stock.changePercent.toFixed(2)}%
                </td>

                {/*
                  PER 컬럼 (조건부)
                  stock.per ?? '-': per가 null/undefined면 '-' 표시
                */}
                {showPer && <td className="col-per">{stock.per ?? '-'}</td>}

                {/* PBR 컬럼 (조건부) */}
                {showPbr && <td className="col-pbr">{stock.pbr ?? '-'}</td>}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/*
        빈 상태 처리
        stocks.length === 0: 배열이 비어있으면
      */}
      {stocks.length === 0 && (
        <div className="stock-ranking__empty">종목 데이터가 없습니다.</div>
      )}
    </div>
  );
}

export default StockRankingTable;
