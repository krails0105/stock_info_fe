import React from 'react';
import { TrendingUp, Search, Menu } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage?: string;
  onPageChange?: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage = 'home', onPageChange }) => {
  const handleNavigation = (page: string) => {
    if (onPageChange) {
      onPageChange(page);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center cursor-pointer" onClick={() => handleNavigation('home')}>
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">주식정보</span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <button
                onClick={() => handleNavigation('home')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentPage === 'home'
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                홈
              </button>
              <button
                onClick={() => handleNavigation('sectors')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentPage === 'sectors'
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                섹터별 종목
              </button>
              <button
                onClick={() => handleNavigation('search')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentPage === 'search'
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                종목검색
              </button>
            </nav>

            {/* Search & Mobile Menu */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-md">
                <Search className="h-5 w-5" />
              </button>
              <button className="md:hidden p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-md">
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 text-sm">
            <p>&copy; 2024 주식정보. 투자 참고용 정보입니다.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 