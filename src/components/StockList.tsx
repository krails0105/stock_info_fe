// src/components/StockList.tsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Stock {
    code: string;
    name: string;
    price: number;
    per: number;
    pbr: number;
}

interface StockListProps {
    sector: string;
}

function StockList({ sector }: StockListProps) {
    const [stocks, setStocks] = useState<Stock[]>([]);

    useEffect(() => {
        axios.get(`http://localhost:8080/api/stocks?sector=${sector}`)
            .then(response => {
                setStocks(response.data);
            })
            .catch(error => {
                console.error('Error fetching stocks:', error);
            });
    }, [sector]); // sector가 변경될 때마다 useEffect 실행

    return (
        <div>
            <h3>{sector} 관련주</h3>
            
            <table className="stock-table">
                <thead>
                    <tr>
                        <th>종목코드</th>
                        <th>종목명</th>
                        <th>현재가</th>
                        <th>PER</th>
                        <th>PBR</th>
                    </tr>
                </thead>
                <tbody>
                    {stocks.map(stock => (
                        <tr key={stock.code}>
                            <td>
                                <Link to={`/stock/${stock.code}`}>{stock.name}</Link>
                            </td>
                            <td>{stock.code}</td>
                            <td>{stock.price.toLocaleString()}</td>
                            <td>{stock.per}</td>
                            <td>{stock.pbr}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default StockList;