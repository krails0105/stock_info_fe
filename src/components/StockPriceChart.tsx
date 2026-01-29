// src/components/StockPriceChart.tsx
// 종목 가격 차트 컴포넌트 (기간 탭: 1D/1W/1M/3M/1Y)

import { useEffect, useState, useCallback } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';
import { getStockChart } from '../services/api';
import type { ChartResponse, ChartRange, ChartDataPoint } from '../types';
import './StockPriceChart.css';

interface StockPriceChartProps {
  stockCode: string;
}

const RANGE_OPTIONS: { value: ChartRange; label: string }[] = [
  { value: '1D', label: '1일' },
  { value: '1W', label: '1주' },
  { value: '1M', label: '1개월' },
  { value: '3M', label: '3개월' },
  { value: '1Y', label: '1년' },
];

function StockPriceChart({ stockCode }: StockPriceChartProps) {
  const [range, setRange] = useState<ChartRange>('1M');
  const [data, setData] = useState<ChartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChartData = useCallback(() => {
    setLoading(true);
    setError(null);
    getStockChart(stockCode, range)
      .then(setData)
      .catch(() => setError('차트 데이터를 불러올 수 없습니다'))
      .finally(() => setLoading(false));
  }, [stockCode, range]);

  useEffect(() => {
    fetchChartData();
  }, [fetchChartData]);

  // 가격 포맷팅
  const formatPrice = (value: number) => {
    return value.toLocaleString() + '원';
  };

  // 날짜 포맷팅 (차트 X축용)
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (range === '1D') {
      return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    }
    if (range === '1W' || range === '1M') {
      return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
    }
    return date.toLocaleDateString('ko-KR', { year: '2-digit', month: 'short' });
  };

  // Skeleton 로딩
  if (loading) {
    return (
      <div className="stock-chart">
        <div className="stock-chart__header">
          <h3 className="stock-chart__title">
            <TrendingUp size={18} />
            가격 차트
          </h3>
          <div className="stock-chart__tabs">
            {RANGE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                className={`stock-chart__tab ${range === opt.value ? 'active' : ''}`}
                disabled
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <div className="stock-chart__skeleton">
          <div className="stock-chart__skeleton-chart" />
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="stock-chart">
        <div className="stock-chart__header">
          <h3 className="stock-chart__title">
            <TrendingUp size={18} />
            가격 차트
          </h3>
        </div>
        <div className="stock-chart__error">
          <AlertCircle size={32} />
          <p>{error}</p>
          <button className="stock-chart__retry" onClick={fetchChartData}>
            <RefreshCw size={14} />
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  // 데이터 없음 상태
  if (!data || data.dataPoints.length === 0) {
    return (
      <div className="stock-chart">
        <div className="stock-chart__header">
          <h3 className="stock-chart__title">
            <TrendingUp size={18} />
            가격 차트
          </h3>
          <div className="stock-chart__tabs">
            {RANGE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                className={`stock-chart__tab ${range === opt.value ? 'active' : ''}`}
                onClick={() => setRange(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <div className="stock-chart__empty">
          <TrendingUp size={32} />
          <p>차트 데이터가 없습니다</p>
        </div>
      </div>
    );
  }

  // 차트 데이터 변환
  const chartData = data.dataPoints.map((point: ChartDataPoint) => ({
    ...point,
    formattedDate: formatDate(point.date),
  }));

  // 가격 범위 계산 (Y축 범위)
  const prices = data.dataPoints.map((p) => p.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice;
  const yMin = Math.floor((minPrice - priceRange * 0.1) / 100) * 100;
  const yMax = Math.ceil((maxPrice + priceRange * 0.1) / 100) * 100;

  return (
    <div className="stock-chart">
      <div className="stock-chart__header">
        <h3 className="stock-chart__title">
          <TrendingUp size={18} />
          가격 차트
        </h3>
        <div className="stock-chart__tabs">
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={`stock-chart__tab ${range === opt.value ? 'active' : ''}`}
              onClick={() => setRange(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="stock-chart__container">
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="formattedDate"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
              interval="preserveStartEnd"
              minTickGap={40}
            />
            <YAxis
              domain={[yMin, yMax]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
              tickFormatter={(value) => (value / 1000).toFixed(0) + 'k'}
              width={45}
            />
            <Tooltip
              contentStyle={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-md)',
              }}
              labelStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
              formatter={(value: number) => [formatPrice(value), '가격']}
              labelFormatter={(label) => label}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="var(--accent-primary)"
              strokeWidth={2}
              fill="url(#priceGradient)"
              animationDuration={300}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="stock-chart__meta">
        기준: {new Date(data.meta.asOf).toLocaleString('ko-KR')} · 출처: {data.meta.source}
      </div>
    </div>
  );
}

export default StockPriceChart;
