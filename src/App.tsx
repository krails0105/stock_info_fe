// src/App.tsx
// ============================================================
// 📌 앱의 최상위 컴포넌트
//
// 이 파일은 React 앱의 "뿌리" 역할을 합니다.
// 여기서 라우팅(URL에 따른 페이지 전환)을 설정합니다.
// ============================================================

// CSS 파일 가져오기
import './App.css';

// ------------------------------------------------------------
// 📦 React Router 가져오기
// ------------------------------------------------------------
// React Router: React에서 페이지 이동을 처리하는 라이브러리
//
// Routes: 여러 Route를 감싸는 컨테이너
// Route: 특정 URL 경로와 컴포넌트를 연결
import { Routes, Route } from 'react-router-dom';

// 페이지 컴포넌트들 가져오기
import HomePage from './pages/HomePage';
import SectorDetailPage from './pages/SectorDetailPage';
import StockDetailPage from './pages/StockDetailPage';
import SearchPage from './pages/SearchPage';

// ------------------------------------------------------------
// 🏠 App 컴포넌트
// ------------------------------------------------------------
function App() {
  return (
    // 앱 전체를 감싸는 div
    <div className="app">
      {/*
        Routes 컴포넌트:
        - 자식으로 Route들을 가짐
        - 현재 URL과 일치하는 Route의 element를 렌더링
      */}
      <Routes>
        {/*
          Route 컴포넌트:
          - path: URL 경로
          - element: 해당 경로에서 보여줄 컴포넌트

          path="/" : 홈 페이지 (루트 경로)
          예: http://localhost:5173/
        */}
        <Route path="/" element={<HomePage />} />

        {/*
          검색 페이지
          예: /search
        */}
        <Route path="/search" element={<SearchPage />} />

        {/*
          동적 라우팅 (Dynamic Routing):
          - :sectorName 처럼 콜론(:)을 붙이면 그 부분이 변수가 됨
          - 어떤 값이든 매칭됨

          예:
          - /sector/기술주 → sectorName = "기술주"
          - /sector/바이오 → sectorName = "바이오"

          컴포넌트에서 useParams() 훅으로 이 값을 읽을 수 있음:
          const { sectorName } = useParams();
        */}
        <Route path="/sector/:sectorName" element={<SectorDetailPage />} />

        {/*
          :stockCode도 동적 파라미터
          예: /stock/005930 → stockCode = "005930"
        */}
        <Route path="/stock/:stockCode" element={<StockDetailPage />} />
      </Routes>
    </div>
  );
}

// 이 컴포넌트를 기본 내보내기
// main.tsx에서 이 컴포넌트를 렌더링합니다
export default App;
