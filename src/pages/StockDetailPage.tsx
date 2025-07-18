// src/pages/StockDetailPage.tsx

import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import './StockDetailPage.css';

interface News {
    title: string;
    url: string;
}
interface StockDetail {
    code: string;
    name: string;
    price: number;
    per: number;
    pbr: number;
    volume: number;
    news: News[];
}

function StockDetailPage() {
    // url의 path parameter 중 stockCode를 추출
    const { stockCode } = useParams();
    const [stockDetail, setStockDetail] = useState<StockDetail | null>(null);
    
    useEffect(() => {
        axios.get(`http://localhost:8080/api/stock/${stockCode}`)
            .then(response => {
                setStockDetail(response.data);
            })
            .catch(error => {
                console.error('Error fetching stock detail:', error);
            });
    }, [stockCode]);

    if (!stockDetail) {
        return <div>Loading...</div>;
    }

    return (
        <div className="stock-detail-container">
            <div className="stock-title">
                <span>{stockDetail.name}</span>
                <span className="stock-code">{stockDetail.code}</span>
            </div>
            <div className="stock-metrics">
                <div className="metric-item">
                    <span className="metric-label">현재가</span>
                    <span className="metric-value">{stockDetail.price.toLocaleString()}</span>
                </div>
                <div className="metric-item">
                    <span className="metric-label">거래량</span>
                    <span className="metric-value">{stockDetail.volume.toLocaleString()}</span>
                </div>
                <div className="metric-item">
                    <span className="metric-label">PER</span>
                    <span className="metric-value">{stockDetail.per}</span>
                </div>
                <div className="metric-item">
                    <span className="metric-label">PBR</span>
                    <span className="metric-value">{stockDetail.pbr}</span>
                </div>
            </div>
            <div className="stock-section">
                <h3>종목 관련 뉴스</h3>
                <ul className="news-list">
                    {stockDetail.news.map((newsItem, index) => (
                        <li key={index}>
                            <a href={newsItem.url} target="_blank" rel="noopener noreferrer">
                                {newsItem.title}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default StockDetailPage;