// src/App.tsx

import './App.css';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import StockDetailPage from './pages/StockDetailPage';

function App() {

  return (
    <div className="container">
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* 
          :stockCode는 React Router에서 사용하는 "URL 파라미터" 문법입니다.
          경로(path)에서 콜론(:)을 붙이면 해당 부분이 변수로 처리되어,
          예를 들어 "/stock/005930"처럼 접근할 때 "005930"이 stockCode로 전달됩니다.
          useParams() 훅을 사용하면 이 값을 컴포넌트에서 읽을 수 있습니다.
        */}
        <Route path="/stock/:stockCode" element={<StockDetailPage />} />
      </Routes>
    </div>
  )
}

export default App;