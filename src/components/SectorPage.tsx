import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Filter, Search, ArrowUpDown } from 'lucide-react';

interface Stock {
  code: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  per: number;
  pbr: number;
  sector: string;
}

const SectorPage: React.FC = () => {
  const [selectedSector, setSelectedSector] = useState('전체');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // 임시 데이터 (실제로는 API에서 가져올 데이터)
  const sectors = ['전체', '반도체', '자동차', '바이오', '화학', '금융', '에너지'];
  
  const stockData: Stock[] = [
    {
      code: '005930',
      name: '삼성전자',
      price: 73500,
      change: 1500,
      changePercent: 2.08,
      volume: 15420000,
      marketCap: 439000000,
      per: 15.2,
      pbr: 1.8,
      sector: '반도체'
    },
    {
      code: '000660',
      name: 'SK하이닉스',
      price: 128000,
      change: -2000,
      changePercent: -1.54,
      volume: 8250000,
      marketCap: 93000000,
      per: 12.5,
      pbr: 1.2,
      sector: '반도체'
    },
    {
      code: '005380',
      name: '현대자동차',
      price: 198000,
      change: 3000,
      changePercent: 1.54,
      volume: 2450000,
      marketCap: 42000000,
      per: 8.9,
      pbr: 0.9,
      sector: '자동차'
    },
    {
      code: '207940',
      name: '삼성바이오로직스',
      price: 850000,
      change: -15000,
      changePercent: -1.73,
      volume: 145000,
      marketCap: 61000000,
      per: 45.2,
      pbr: 3.2,
      sector: '바이오'
    },
    {
      code: '051910',
      name: 'LG화학',
      price: 420000,
      change: 8000,
      changePercent: 1.94,
      volume: 1250000,
      marketCap: 29000000,
      per: 18.5,
      pbr: 1.5,
      sector: '화학'
    },
  ];

  const filteredStocks = selectedSector === '전체' 
    ? stockData 
    : stockData.filter(stock => stock.sector === selectedSector);

  const sortedStocks = [...filteredStocks].sort((a, b) => {
    const aValue = a[sortBy as keyof Stock];
    const bValue = b[sortBy as keyof Stock];
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

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

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold text-gray-900">섹터별 종목</h1>
        
        {/* 검색 및 필터 */}
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="종목 검색..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="h-4 w-4 mr-2" />
            필터
          </button>
        </div>
      </div>

      {/* 섹터 탭 */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 overflow-x-auto">
          {sectors.map((sector) => (
            <button
              key={sector}
              onClick={() => setSelectedSector(sector)}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                selectedSector === sector
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {sector}
            </button>
          ))}
        </nav>
      </div>

      {/* 종목 테이블 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    종목명
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('price')}
                >
                  <div className="flex items-center">
                    현재가
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('change')}
                >
                  <div className="flex items-center">
                    등락률
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('volume')}
                >
                  <div className="flex items-center">
                    거래량
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('per')}
                >
                  <div className="flex items-center">
                    PER
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('pbr')}
                >
                  <div className="flex items-center">
                    PBR
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  시가총액
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedStocks.map((stock) => (
                <tr key={stock.code} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{stock.name}</div>
                      <div className="text-sm text-gray-500">{stock.code}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {stock.price.toLocaleString()}원
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`flex items-center ${getChangeColor(stock.change)}`}>
                      {getChangeIcon(stock.change)}
                      <span className="ml-1 text-sm font-medium">
                        {stock.change > 0 ? '+' : ''}{stock.change.toLocaleString()}
                      </span>
                    </div>
                    <div className={`text-sm ${getChangeColor(stock.change)}`}>
                      ({stock.changePercent > 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {stock.volume.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {stock.per.toFixed(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {stock.pbr.toFixed(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {(stock.marketCap / 10000).toFixed(0)}억원
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SectorPage; 