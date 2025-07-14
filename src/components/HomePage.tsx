import React from 'react';
import { TrendingUp, TrendingDown, BarChart3, ArrowRight } from 'lucide-react';

interface HomePageProps {
  onPageChange?: (page: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onPageChange }) => {
  // 임시 데이터 (실제로는 API에서 가져올 데이터)
  const marketIndices = [
    { name: 'KOSPI', value: 2650.45, change: 15.32, changePercent: 0.58 },
    { name: 'KOSDAQ', value: 850.12, change: -8.45, changePercent: -0.98 },
    { name: 'KRX100', value: 4520.78, change: 22.15, changePercent: 0.49 },
  ];

  const sectors = [
    { name: '반도체', stockCount: 25, change: 2.34, color: 'bg-blue-100 text-blue-800' },
    { name: '자동차', stockCount: 18, change: -1.12, color: 'bg-green-100 text-green-800' },
    { name: '바이오', stockCount: 32, change: 0.89, color: 'bg-purple-100 text-purple-800' },
    { name: '화학', stockCount: 15, change: 1.45, color: 'bg-yellow-100 text-yellow-800' },
    { name: '금융', stockCount: 22, change: -0.67, color: 'bg-indigo-100 text-indigo-800' },
    { name: '에너지', stockCount: 12, change: 3.21, color: 'bg-red-100 text-red-800' },
  ];

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-red-600';
    if (change < 0) return 'text-blue-600';
    return 'text-gray-600';
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4" />;
    if (change < 0) return <TrendingDown className="h-4 w-4" />;
    return null;
  };

  const handleViewAllSectors = () => {
    if (onPageChange) {
      onPageChange('sectors');
    }
  };

  return (
    <div className="space-y-8">
      {/* 시장 지수 */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">시장 지수</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {marketIndices.map((index) => (
            <div key={index.name} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{index.name}</h3>
                  <p className="text-2xl font-bold text-gray-900">{index.value.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <div className={`flex items-center ${getChangeColor(index.change)}`}>
                    {getChangeIcon(index.change)}
                    <span className="ml-1 font-semibold">
                      {index.change > 0 ? '+' : ''}{index.change.toFixed(2)}
                    </span>
                  </div>
                  <div className={`text-sm ${getChangeColor(index.change)}`}>
                    ({index.changePercent > 0 ? '+' : ''}{index.changePercent.toFixed(2)}%)
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 섹터별 종목 */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">섹터별 종목</h2>
          <button 
            onClick={handleViewAllSectors}
            className="btn-primary flex items-center"
          >
            전체보기 <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sectors.map((sector) => (
            <div 
              key={sector.name} 
              className="card hover:shadow-lg transition-shadow cursor-pointer"
              onClick={handleViewAllSectors}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${sector.color}`}>
                  {sector.name}
                </span>
                <BarChart3 className="h-5 w-5 text-gray-400" />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">{sector.stockCount}개 종목</p>
                <div className={`flex items-center ${getChangeColor(sector.change)}`}>
                  {getChangeIcon(sector.change)}
                  <span className="ml-1 font-semibold">
                    {sector.change > 0 ? '+' : ''}{sector.change.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 주요 뉴스 */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">주요 뉴스</h2>
        <div className="card">
          <div className="space-y-4">
            {[
              { title: "삼성전자, 3분기 실적 시장 기대치 상회", time: "2시간 전", source: "한국경제" },
              { title: "SK하이닉스, HBM 메모리 수주 증가로 주가 상승", time: "4시간 전", source: "매일경제" },
              { title: "현대차, 전기차 시장 확대로 글로벌 경쟁력 강화", time: "6시간 전", source: "조선일보" },
            ].map((news, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg cursor-pointer">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 hover:text-blue-600">{news.title}</h4>
                  <div className="flex items-center space-x-2 mt-1 text-sm text-gray-500">
                    <span>{news.source}</span>
                    <span>•</span>
                    <span>{news.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 