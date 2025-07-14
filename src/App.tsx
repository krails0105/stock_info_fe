// import React, { useState } from 'react';
// import Layout from './components/Layout';
// import HomePage from './components/HomePage';
// import SectorPage from './components/SectorPage';
// import './App.css';

// function App() {
//   const [currentPage, setCurrentPage] = useState('home');

//   const renderPage = () => {
//     switch (currentPage) {
//       case 'home':
//         return <HomePage onPageChange={setCurrentPage} />;
//       case 'sectors':
//         return <SectorPage />;
//       default:
//         return <HomePage onPageChange={setCurrentPage} />;
//     }
//   };

//   return (
//     <div className="App">
//       <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
//         {renderPage()}
//       </Layout>
//     </div>
//   );
// }

// export default App;

import './App.css';
import SectorList from './components/SectorList';

function App() {
  return (
    <div>
      <header>
        <h1>Stock Market</h1>
      </header>
      <main>
        <h2>Welcome to the Stock Market</h2>
        <p>This is a simple stock market app.</p>
        <SectorList /> {/* 섹터 목록 컴포넌트 추가 */}
      </main>
      <footer>
        <p>Copyright 2025 Stock Market</p>
      </footer>
    </div>
  )
}

export default App;