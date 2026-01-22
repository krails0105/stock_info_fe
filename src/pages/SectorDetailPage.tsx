// src/pages/SectorDetailPage.tsx
// ============================================================
// 📌 섹터 상세 페이지
//
// URL: /sector/:sectorName (예: /sector/기술주)
// 특정 섹터의 상세 정보와 해당 섹터에 속한 종목 목록을 보여줍니다.
// Top Picks 인사이트 + 뉴스 제공
// ============================================================

// ------------------------------------------------------------
// 📦 import
// ------------------------------------------------------------
import { useEffect, useState } from 'react';

// useParams: URL의 동적 파라미터를 읽는 훅
// Link: 페이지 이동 컴포넌트
import { useParams, Link } from 'react-router-dom';

// API 함수들
import { getSectorScoreboard, getStockScoreboard, getSectorInsight } from '../services/api';

// 타입들
import type { SectorScore, StockScore, SectorInsight } from '../types';

// 컴포넌트들
import ScoreBadge from '../components/ScoreBadge';
import StockRankingTable from '../components/StockRankingTable';
import SectorTopPicks from '../components/SectorTopPicks';
import NewsHeadlineList from '../components/NewsHeadlineList';

// CSS
import './SectorDetailPage.css';

// ------------------------------------------------------------
// 📄 SectorDetailPage 컴포넌트
// ------------------------------------------------------------
function SectorDetailPage() {
  // ----------------------------------------------------------
  // 🔗 useParams: URL 파라미터 읽기
  // ----------------------------------------------------------
  // URL이 /sector/기술주 라면, sectorName = "기술주"
  //
  // <{ sectorName: string }>: TypeScript 제네릭
  // useParams가 반환하는 객체의 타입을 지정
  // { sectorName: string }은 "sectorName이라는 문자열 속성이 있다"는 의미
  const { sectorName } = useParams<{ sectorName: string }>();

  // ----------------------------------------------------------
  // 📊 상태(State) 정의
  // ----------------------------------------------------------
  // 섹터 정보 (없으면 null)
  const [sector, setSector] = useState<SectorScore | null>(null);

  // 섹터에 속한 종목 목록
  const [stocks, setStocks] = useState<StockScore[]>([]);

  // 섹터 인사이트 (Top Picks + 뉴스)
  const [insight, setInsight] = useState<SectorInsight | null>(null);

  // 로딩 상태
  const [loading, setLoading] = useState(true);

  // 에러 메시지
  const [error, setError] = useState<string | null>(null);

  // ----------------------------------------------------------
  // ⚡ useEffect: 데이터 로딩
  // ----------------------------------------------------------
  // 의존성 배열에 [sectorName]이 있으므로,
  // sectorName이 변경될 때마다 이 효과가 다시 실행됩니다.
  useEffect(() => {
    // sectorName이 없으면 아무것도 하지 않음
    // early return 패턴: 조건이 맞지 않으면 일찍 종료
    if (!sectorName) return;

    // 로딩 시작
    setLoading(true);
    setError(null);

    // ----------------------------------------------------------
    // Promise.all: 여러 Promise를 동시에 실행
    // ----------------------------------------------------------
    // 세 개의 API를 동시에 호출하고, 모두 완료되면 결과를 받습니다.
    // 순차적으로 호출하는 것보다 빠릅니다!
    //
    // 반환값: [첫번째결과, 두번째결과, 세번째결과] 형태의 배열
    Promise.all([
      getSectorScoreboard(),           // 전체 섹터 정보
      getStockScoreboard(sectorName),  // 해당 섹터의 종목 목록
      getSectorInsight(sectorName).catch(() => null),  // 인사이트 (실패 시 null)
    ])
      .then(([sectorData, stockData, insightData]) => {
        // 구조 분해 할당: 배열의 각 요소를 변수에 할당

        // .find(): 배열에서 조건에 맞는 첫 번째 요소를 찾음
        // 화살표 함수: (s) => s.sectorName === sectorName
        // s.sectorName이 현재 sectorName과 같은 섹터를 찾음
        const found = sectorData.sectors.find(
          (s) => s.sectorName === sectorName
        );

        // 찾은 섹터를 상태에 저장 (없으면 null)
        setSector(found || null);

        // 종목 목록을 상태에 저장
        setStocks(stockData.stocks);

        // 인사이트 저장
        setInsight(insightData);
      })
      .catch(() => {
        // 에러 발생 시
        setError('데이터를 불러올 수 없습니다');
      })
      .finally(() => {
        // 성공이든 실패든 로딩 완료
        setLoading(false);
      });
  }, [sectorName]); // ← sectorName이 변경되면 다시 실행

  // ----------------------------------------------------------
  // 🔄 조건부 렌더링: 로딩 중
  // ----------------------------------------------------------
  // if 문으로 먼저 특수한 경우를 처리하고 return
  // 이렇게 하면 아래 코드에서는 loading이 false임을 확신할 수 있음
  if (loading) {
    return (
      <div className="sector-detail">
        <div className="loading">로딩 중...</div>
      </div>
    );
  }

  // ----------------------------------------------------------
  // 🔄 조건부 렌더링: 에러 또는 데이터 없음
  // ----------------------------------------------------------
  if (error || !sector) {
    return (
      <div className="sector-detail">
        {/*
          || 연산자: 왼쪽이 falsy면 오른쪽 값 사용
          error가 있으면 error 메시지, 없으면 기본 메시지
        */}
        <div className="error">{error || '섹터를 찾을 수 없습니다'}</div>
        <Link to="/" className="back-link">홈으로 돌아가기</Link>
      </div>
    );
  }

  // ----------------------------------------------------------
  // 🎨 메인 렌더링
  // ----------------------------------------------------------
  // 여기까지 오면 loading=false, error=null, sector가 존재함
  return (
    <div className="sector-detail">
      {/* 뒤로가기 링크 */}
      <Link to="/" className="back-link">← 홈으로</Link>

      {/* ======== 섹터 Top Picks 인사이트 ======== */}
      {insight && (
        <SectorTopPicks insight={insight} />
      )}

      {/* ======== 뉴스 헤드라인 ======== */}
      {insight && insight.news && (
        <div className="sector-news-section">
          <NewsHeadlineList news={insight.news} maxItems={5} />
        </div>
      )}

      {/* 섹터 헤더 */}
      <header className="sector-detail__header">
        <div className="sector-detail__title-row">
          <h1 className="sector-detail__name">{sector.sectorName}</h1>
          <ScoreBadge score={sector.score} label={sector.label} size="lg" />
        </div>

        {/* 이유 목록 */}
        <ul className="sector-detail__reasons">
          {sector.reasons.map((reason, idx) => (
            <li key={idx}>{reason}</li>
          ))}
        </ul>

        {/* 관련 뉴스 (있을 때만) */}
        {sector.headlines && sector.headlines.length > 0 && (
          <div className="sector-detail__headlines">
            <h3>관련 뉴스</h3>
            {sector.headlines.map((news, idx) => (
              <a
                key={idx}
                href={news.url}
                target="_blank"
                rel="noopener noreferrer"
                className="headline-link"
              >
                {news.title}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* 종목 랭킹 테이블 */}
      <section className="sector-detail__stocks">
        <h2>종목 랭킹</h2>
        {/*
          컴포넌트에 props 전달
          stocks={stocks}: 종목 배열
          showPer, showPbr: boolean props (true 전달)
          축약형: showPer={true} 대신 showPer만 써도 됨
        */}
        <StockRankingTable stocks={stocks} showPer showPbr />
      </section>
    </div>
  );
}

export default SectorDetailPage;
