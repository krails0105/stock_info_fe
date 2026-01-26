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
import { useEffect, useState, useMemo } from 'react';

// useParams: URL의 동적 파라미터를 읽는 훅
// Link: 페이지 이동 컴포넌트
import { useParams, Link } from 'react-router-dom';

// API 함수들
import { getSectorScoreboard, getStockScoreboard, getSectorInsight } from '../services/api';

// 타입들
import type { SectorScore, StockScore, SectorInsight } from '../types';

// ------------------------------------------------------------
// 📋 P1-1: 정렬 프리셋 타입
// ------------------------------------------------------------
type SortPreset = 'beginner' | 'stable' | 'growth' | 'momentum' | 'value';

const SORT_PRESETS: { value: SortPreset; label: string; description: string }[] = [
  { value: 'beginner', label: '초보자 추천', description: '종합 점수 높은 순' },
  { value: 'stable', label: '안정 우선', description: '변동성 낮은 종목 우선' },
  { value: 'growth', label: '성장 기대', description: '성장 가능성 높은 순' },
  { value: 'momentum', label: '모멘텀', description: '상승률 높은 순' },
  { value: 'value', label: '저평가', description: 'PER 낮은 순 (적자 제외)' },
];

// ------------------------------------------------------------
// 📋 P1-2: 초보자 보호 필터 타입
// ------------------------------------------------------------
interface ProtectionFilters {
  hideDeficit: boolean;      // 적자 종목 숨기기 (PER <= 0)
  hideVolatile: boolean;     // 급등락 종목 숨기기 (|changeRate| > 5%)
}

// 등락률 문자열에서 숫자 추출
function parseChangeRate(changeRate: string): number {
  return parseFloat(changeRate) || 0;
}

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

  // P1-1: 정렬 프리셋
  const [sortPreset, setSortPreset] = useState<SortPreset>('beginner');

  // P1-2: 초보자 보호 필터 (기본 ON)
  const [filters, setFilters] = useState<ProtectionFilters>({
    hideDeficit: true,
    hideVolatile: true,
  });

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
  // 🔄 P1-1 & P1-2: 정렬 및 필터 적용
  // ----------------------------------------------------------
  const filteredAndSortedStocks = useMemo(() => {
    let result = [...stocks];

    // P1-2: 필터 적용
    if (filters.hideDeficit) {
      // 적자 종목 제외 (PER이 null, undefined, 0 이하인 경우)
      result = result.filter((s) => s.per != null && s.per > 0);
    }
    if (filters.hideVolatile) {
      // 급등락 종목 제외 (등락률 절댓값 > 5%)
      result = result.filter((s) => Math.abs(parseChangeRate(s.changeRate)) <= 5);
    }

    // P1-1: 정렬 적용
    switch (sortPreset) {
      case 'beginner':
        // 종합 점수 내림차순
        result.sort((a, b) => b.score - a.score);
        break;
      case 'stable':
        // 변동성 낮은 순 (등락률 절댓값 오름차순), 동점이면 점수 높은 순
        result.sort((a, b) => {
          const volA = Math.abs(parseChangeRate(a.changeRate));
          const volB = Math.abs(parseChangeRate(b.changeRate));
          if (volA !== volB) return volA - volB;
          return b.score - a.score;
        });
        break;
      case 'growth':
        // 성장 기대: 점수 높은 순 (현재 데이터로는 beginner와 동일)
        result.sort((a, b) => b.score - a.score);
        break;
      case 'momentum':
        // 상승률 높은 순
        result.sort((a, b) => parseChangeRate(b.changeRate) - parseChangeRate(a.changeRate));
        break;
      case 'value':
        // PER 낮은 순 (적자/null 제외)
        result = result.filter((s) => s.per != null && s.per > 0);
        result.sort((a, b) => (a.per ?? 999) - (b.per ?? 999));
        break;
    }

    return result;
  }, [stocks, sortPreset, filters]);

  // 필터로 제외된 종목 수
  const filteredOutCount = stocks.length - filteredAndSortedStocks.length;

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
          {/* P0-4: searchKeyword로 섹터명 전달 (뉴스 0건 시 외부 검색 링크용) */}
          <NewsHeadlineList news={insight.news} maxItems={5} searchKeyword={sectorName} />
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

        {/* P1-1 & P1-2: 정렬/필터 컨트롤 */}
        <div className="sector-detail__controls">
          {/* 정렬 프리셋 */}
          <div className="sector-detail__sort">
            <label htmlFor="sort-preset">정렬:</label>
            <select
              id="sort-preset"
              value={sortPreset}
              onChange={(e) => setSortPreset(e.target.value as SortPreset)}
              className="sector-detail__select"
            >
              {SORT_PRESETS.map((preset) => (
                <option key={preset.value} value={preset.value}>
                  {preset.label}
                </option>
              ))}
            </select>
            <span className="sector-detail__sort-desc">
              {SORT_PRESETS.find((p) => p.value === sortPreset)?.description}
            </span>
          </div>

          {/* 초보자 보호 필터 (UI 가이드: 툴팁 포함) */}
          <div className="sector-detail__filters">
            <span className="sector-detail__filter-label">초보자 보호:</span>
            <label
              className="sector-detail__checkbox"
              title="PER 계산이 무의미한 종목을 숨깁니다"
            >
              <input
                type="checkbox"
                checked={filters.hideDeficit}
                onChange={(e) => setFilters((f) => ({ ...f, hideDeficit: e.target.checked }))}
              />
              적자 제외
            </label>
            <label
              className="sector-detail__checkbox"
              title="단기 급변 종목을 숨깁니다 (초보자 보호)"
            >
              <input
                type="checkbox"
                checked={filters.hideVolatile}
                onChange={(e) => setFilters((f) => ({ ...f, hideVolatile: e.target.checked }))}
              />
              급등락 제외
            </label>
          </div>

          {/* 필터 결과 안내 */}
          {filteredOutCount > 0 && (
            <div className="sector-detail__filter-info">
              {filteredOutCount}개 종목이 필터로 숨겨졌습니다.
            </div>
          )}
        </div>

        {/*
          컴포넌트에 props 전달
          filteredAndSortedStocks: 정렬/필터 적용된 종목 배열
          showPer, showPbr: boolean props (true 전달)
        */}
        <StockRankingTable stocks={filteredAndSortedStocks} showPer showPbr />
      </section>
    </div>
  );
}

export default SectorDetailPage;
