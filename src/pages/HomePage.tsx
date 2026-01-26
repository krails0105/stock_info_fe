// src/pages/HomePage.tsx
// ============================================================
// 📌 이 파일은 홈페이지 컴포넌트입니다.
// React에서 "컴포넌트"란 화면의 일부분을 담당하는 재사용 가능한 코드 블록입니다.
// ============================================================

// ------------------------------------------------------------
// 📦 import 문: 다른 파일에서 필요한 코드를 가져옵니다.
// ------------------------------------------------------------
// 'react'에서 useEffect, useState라는 "훅(Hook)"을 가져옵니다.
// - useState: 컴포넌트 안에서 변하는 데이터(상태)를 관리
// - useEffect: 컴포넌트가 화면에 나타날 때 실행할 코드 지정
import { useEffect, useState } from 'react';

// '../services/api'에서 API 호출 함수를 가져옵니다.
// '..'은 상위 폴더를 의미합니다 (pages → src → services/api.ts)
import { getSectorScoreboard } from '../services/api';

// 타입(Type)을 가져옵니다. TypeScript에서 데이터의 형태를 정의한 것입니다.
// 'type'을 붙이면 "이건 타입이야"라고 명시하는 것 (코드가 아닌 타입 정보만 가져옴)
import type { SectorScore } from '../types';

// 다른 컴포넌트들을 가져옵니다. 레고 블록처럼 조합해서 사용합니다.
import MarketSummaryBar from '../components/MarketSummaryBar';
import SectorCard from '../components/SectorCard';
import SectorListGrid from '../components/SectorListGrid';

// CSS 파일을 가져옵니다. 이 컴포넌트의 스타일을 정의합니다.
import './HomePage.css';

// ------------------------------------------------------------
// 🏠 HomePage 컴포넌트 정의
// ------------------------------------------------------------
// 'function' 키워드로 함수를 정의합니다.
// React 컴포넌트는 기본적으로 "함수"입니다.
// 이 함수는 JSX(HTML과 비슷한 문법)를 반환합니다.
function HomePage() {
  // ----------------------------------------------------------
  // 📊 useState: 상태(State) 관리
  // ----------------------------------------------------------
  // useState는 [현재값, 값을바꾸는함수] 형태로 반환됩니다.
  //
  // useState<SectorScore[]>([])의 의미:
  // - <SectorScore[]>: TypeScript 제네릭. "이 상태는 SectorScore 배열 타입이야"
  // - ([]): 초기값. 빈 배열로 시작
  //
  // sectors: 현재 섹터 데이터 배열
  // setSectors: sectors 값을 변경하는 함수. 이걸 호출하면 화면이 자동으로 다시 그려짐!
  const [sectors, setSectors] = useState<SectorScore[]>([]);

  // loading: API 호출 중인지 여부 (true/false)
  const [loading, setLoading] = useState(true);

  // error: 에러 메시지. 없으면 null
  // <string | null>: "문자열 또는 null 타입이야"라는 의미
  const [error, setError] = useState<string | null>(null);

  // ----------------------------------------------------------
  // ⚡ useEffect: 사이드 이펙트(부수 효과) 처리
  // ----------------------------------------------------------
  // useEffect(실행할함수, 의존성배열)
  //
  // 의존성 배열이 빈 배열 []이면:
  // → 컴포넌트가 "처음 화면에 나타날 때" 딱 한 번만 실행됩니다.
  //
  // 여기서는 API를 호출해서 섹터 데이터를 가져옵니다.
  useEffect(() => {
    // getSectorScoreboard()는 Promise를 반환합니다.
    // Promise는 "나중에 완료될 비동기 작업"을 나타냅니다.
    //
    // .then(): 성공했을 때 실행
    // .catch(): 실패했을 때 실행
    // .finally(): 성공/실패 상관없이 마지막에 실행
    getSectorScoreboard()
      .then((data) => {
        // data.sectors를 상태에 저장
        // 이렇게 하면 React가 자동으로 화면을 다시 그립니다!
        setSectors(data.sectors);
      })
      .catch(() => {
        // 에러 발생 시 에러 메시지 설정
        setError('섹터 데이터를 불러올 수 없습니다');
      })
      .finally(() => {
        // 로딩 완료 (성공이든 실패든)
        setLoading(false);
      });
  }, []); // ← 빈 배열: 컴포넌트 마운트 시 1회만 실행

  // ----------------------------------------------------------
  // 🏆 TOP 3 섹터 계산
  // ----------------------------------------------------------
  // P0-1: 표본 수가 5개 이상인 섹터만 TOP3 후보로 선정
  // 표본이 너무 적은 섹터는 신뢰도가 낮아 TOP3에서 제외합니다.
  //
  // .filter(): 조건에 맞는 요소만 선택 (stockCount >= 5)
  // .sort(): 배열 정렬. (a, b) => b.score - a.score는 점수 내림차순 정렬
  // .slice(0, 3): 처음 3개만 자르기
  const MIN_SAMPLE_SIZE_FOR_TOP3 = 5;
  const topSectors = [...sectors]
    .filter((s) => (s.stockCount ?? 0) >= MIN_SAMPLE_SIZE_FOR_TOP3)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  // ----------------------------------------------------------
  // 🎨 JSX 반환: 화면에 그릴 내용
  // ----------------------------------------------------------
  // JSX는 JavaScript 안에서 HTML처럼 작성할 수 있는 문법입니다.
  // 실제로는 React.createElement() 함수 호출로 변환됩니다.
  return (
    // className은 HTML의 class와 같습니다 (class는 JS 예약어라 className 사용)
    <div className="home-page">

      {/* JSX 안에서 주석은 이렇게 중괄호 + 슬래시별표 형태로 씁니다 */}

      {/* 섹션 1: 시장 현황 */}
      <section className="section">
        <h2 className="section__title">시장 현황</h2>
        {/*
          MarketSummaryBar는 다른 파일에서 가져온 컴포넌트입니다.
          이렇게 컴포넌트를 HTML 태그처럼 사용할 수 있습니다.
        */}
        <MarketSummaryBar />
      </section>

      {/* 섹션 2: 주목할 섹터 TOP 3 */}
      <section className="section">
        <h2 className="section__title">주목할 섹터 TOP 3</h2>

        {/*
          조건부 렌더링: {조건 && 보여줄내용}
          조건이 true일 때만 뒤의 내용이 렌더링됩니다.
        */}
        {loading && <div className="loading">로딩 중...</div>}
        {error && <div className="error">{error}</div>}

        {/*
          !loading && !error: 로딩도 아니고 에러도 아닐 때
          즉, 데이터를 성공적으로 가져왔을 때 실행
        */}
        {!loading && !error && (
          <div className="hot-sectors">
            {/*
              .map(): 배열의 각 요소를 변환하여 새 배열을 만듭니다.
              여기서는 각 섹터 데이터를 SectorCard 컴포넌트로 변환합니다.

              key={sector.sectorId}: React가 리스트 항목을 구분하기 위한 고유 식별자.
              리스트를 렌더링할 때 반드시 key를 지정해야 합니다!

              sector={sector}: SectorCard 컴포넌트에 sector 데이터를 전달 (props)
              rank={idx + 1}: 순위 (배열 인덱스는 0부터 시작하므로 +1)
            */}
            {topSectors.map((sector, idx) => (
              <SectorCard
                key={sector.sectorId}
                sector={sector}
                rank={idx + 1}
              />
            ))}
          </div>
        )}
      </section>

      {/* 섹션 3: 전체 섹터 목록 */}
      {/*
        조건: 로딩 완료 && 에러 없음 && 섹터 데이터 있음
        sectors.length > 0: 배열의 길이가 0보다 크면 (즉, 데이터가 있으면)
      */}
      {!loading && !error && sectors.length > 0 && (
        <section className="section">
          {/* sectors를 props로 전달 */}
          <SectorListGrid sectors={sectors} />
        </section>
      )}
    </div>
  );
}

// ------------------------------------------------------------
// 📤 export default: 이 컴포넌트를 다른 파일에서 import할 수 있게 내보냅니다.
// ------------------------------------------------------------
// 'default'는 이 파일의 "기본" 내보내기라는 의미입니다.
// 다른 파일에서 import HomePage from './HomePage' 형태로 가져올 수 있습니다.
export default HomePage;
