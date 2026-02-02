// src/pages/HomePage.tsx
// 홈페이지 컴포넌트

import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { getSectorScoreboard, getHomePicks } from '../services/api';
import type { SectorScore, HomePicksResponse } from '../types';
import MarketSummaryBar from '../components/MarketSummaryBar';
import SectorCard from '../components/SectorCard';
import SectorListGrid from '../components/SectorListGrid';
import HomeWatchlistPicks from '../components/HomeWatchlistPicks';
import HomeFavorites from '../components/HomeFavorites';
import HomeRecents from '../components/HomeRecents';
import HomeObservationBar from '../components/HomeObservationBar';
import HomeSectorFavorites from '../components/HomeSectorFavorites';
import { SkeletonCard } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import './HomePage.css';

function HomePage() {
  const [sectors, setSectors] = useState<SectorScore[]>([]);
  const [picks, setPicks] = useState<HomePicksResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(() => {
    setLoading(true);
    setError(null);

    // 섹터 데이터 + picks 동시 조회
    Promise.all([
      getSectorScoreboard(),
      getHomePicks(8, 'default').catch(() => null),
    ])
      .then(([sectorData, picksData]) => {
        setSectors(sectorData.sectors);
        setPicks(picksData);
      })
      .catch(() => {
        setError('섹터 데이터를 불러올 수 없습니다');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // TOP 3 섹터 계산 (표본 수 5개 이상)
  const MIN_SAMPLE_SIZE_FOR_TOP3 = 5;
  const topSectors = [...sectors]
    .filter((s) => (s.stockCount ?? 0) >= MIN_SAMPLE_SIZE_FOR_TOP3)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return (
    <div className="home-page">
      {/* 검색 바 */}
      <Link to="/search" className="home-search-bar">
        <Search size={18} />
        <span>종목명 또는 종목코드 검색</span>
      </Link>

      {/* 섹션 0: 오늘 관찰 포인트 */}
      <HomeObservationBar sectors={sectors} picks={picks} loading={loading} />

      {/* 섹션 0-1: 내 관심 섹터 */}
      <section className="section">
        <HomeSectorFavorites sectors={sectors} maxDisplay={5} />
      </section>

      {/* 섹션 1: 시장 현황 */}
      <section className="section">
        <h2 className="section__title">시장 현황</h2>
        <MarketSummaryBar />
      </section>

      {/* 섹션 2: 내 즐겨찾기 */}
      <section className="section">
        <HomeFavorites />
      </section>

      {/* 섹션 3: 최근 본 종목 */}
      <section className="section">
        <HomeRecents />
      </section>

      {/* 섹션 4: 오늘 주목할 종목 */}
      <section className="section">
        <HomeWatchlistPicks />
      </section>

      {/* 섹션 3: 주목할 섹터 TOP 3 */}
      <section className="section">
        <h2 className="section__title">주목할 섹터 TOP 3</h2>

        {/* 로딩 상태: Skeleton */}
        {loading && (
          <div className="skeleton-grid">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {/* 에러 상태: EmptyState */}
        {error && (
          <EmptyState
            variant="error"
            title="데이터를 불러올 수 없습니다"
            description={error}
            action={{ label: '다시 시도', onClick: fetchData }}
          />
        )}

        {/* 성공 상태: 카드 그리드 */}
        {!loading && !error && topSectors.length > 0 && (
          <div className="hot-sectors">
            {topSectors.map((sector, idx) => (
              <SectorCard key={sector.sectorId} sector={sector} rank={idx + 1} />
            ))}
          </div>
        )}

        {/* 데이터 없음 상태 */}
        {!loading && !error && topSectors.length === 0 && (
          <EmptyState
            variant="no-data"
            title="주목할 섹터가 없습니다"
            description="현재 조건에 맞는 섹터가 없습니다."
          />
        )}
      </section>

      {/* 섹션 4: 전체 섹터 목록 */}
      {!loading && !error && sectors.length > 0 && (
        <section className="section">
          <SectorListGrid sectors={sectors} />
        </section>
      )}
    </div>
  );
}

export default HomePage;
