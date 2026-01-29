// src/pages/SearchPage.tsx
// 종목 검색 페이지

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, TrendingUp, Building2 } from 'lucide-react';
import useDebounce from '../hooks/useDebounce';
import { searchStocks } from '../services/api';
import type { SearchResult } from '../types';
import { SkeletonCard } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import ScoreBadge from '../components/ScoreBadge';
import './SearchPage.css';

// 추천 검색어
const SUGGESTED_KEYWORDS = ['삼성전자', 'SK하이닉스', '카카오', 'NAVER', '현대차'];

function SearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // 300ms debounce
  const debouncedQuery = useDebounce(query, 300);

  // 검색 실행
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    searchStocks(debouncedQuery)
      .then(setResults)
      .catch(() => setError('검색 중 오류가 발생했습니다'))
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  // 추천 검색어 클릭
  const handleSuggestionClick = (keyword: string) => {
    setQuery(keyword);
  };

  // 검색 결과 클릭
  const handleResultClick = (code: string) => {
    navigate(`/stock/${code}`);
  };

  return (
    <div className="search-page">
      {/* 헤더 */}
      <header className="search-page__header">
        <Link to="/" className="search-page__back">
          <ArrowLeft size={20} />
        </Link>
        <div className="search-page__input-wrapper">
          <Search size={18} className="search-page__input-icon" />
          <input
            type="text"
            className="search-page__input"
            placeholder="종목명 또는 종목코드 검색"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>
      </header>

      {/* 콘텐츠 영역 */}
      <main className="search-page__content">
        {/* 검색 전: 추천 검색어 */}
        {!hasSearched && !loading && (
          <div className="search-page__suggestions">
            <h3 className="search-page__suggestions-title">추천 검색어</h3>
            <div className="search-page__suggestions-list">
              {SUGGESTED_KEYWORDS.map((keyword) => (
                <button
                  key={keyword}
                  className="search-page__suggestion-chip"
                  onClick={() => handleSuggestionClick(keyword)}
                >
                  {keyword}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 로딩 상태 */}
        {loading && (
          <div className="search-page__loading">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {/* 에러 상태 */}
        {error && (
          <EmptyState
            variant="error"
            title="검색 오류"
            description={error}
            action={{ label: '다시 시도', onClick: () => setQuery(query) }}
          />
        )}

        {/* 검색 결과 없음 */}
        {hasSearched && !loading && !error && results.length === 0 && (
          <EmptyState
            variant="search"
            title="검색 결과가 없습니다"
            description={`"${debouncedQuery}"에 대한 결과를 찾을 수 없습니다`}
          />
        )}

        {/* 검색 결과 목록 */}
        {!loading && !error && results.length > 0 && (
          <div className="search-page__results">
            <p className="search-page__results-count">
              {results.length}개의 결과
            </p>
            <ul className="search-page__results-list">
              {results.map((result) => (
                <li key={result.code}>
                  <button
                    className="search-result-card"
                    onClick={() => handleResultClick(result.code)}
                  >
                    <div className="search-result-card__main">
                      <div className="search-result-card__info">
                        <span className="search-result-card__name">
                          {result.name}
                        </span>
                        <span className="search-result-card__code">
                          {result.code}
                        </span>
                      </div>
                      <ScoreBadge score={result.score} label={result.label} />
                    </div>
                    <div className="search-result-card__details">
                      <div className="search-result-card__price">
                        <TrendingUp size={14} />
                        <span>{result.price.toLocaleString()}원</span>
                        <span
                          className={`search-result-card__change ${
                            result.priceChange.startsWith('+')
                              ? 'up'
                              : result.priceChange.startsWith('-')
                              ? 'down'
                              : ''
                          }`}
                        >
                          {result.priceChange}
                        </span>
                      </div>
                      <div className="search-result-card__sector">
                        <Building2 size={14} />
                        <span>{result.sectorName}</span>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}

export default SearchPage;
