import axios from 'axios';
import { useEffect, useState } from 'react';
import './IndexCard.css';

interface Index {
    name: string;
    value: number;
    change: number;
    changeRate: number;
}

function IndexCard() {
    const [indices, setIndices] = useState<Index[]>([]);

    useEffect(() => {
        axios.get('http://localhost:8080/api/indices')
        .then(response => {
            setIndices(response.data);
        })
        .catch(error => {
            console.error('Error fetching index:', error);
        });
    }, []);

    return (
        <div className="index-card-container">
            {indices.map(index => {
                const isUp = index.change > 0;
                const cardClassName = isUp ? 'index-card up' : 'index-card down';
                const sign = isUp ? '+' : '-';
                
                return (
                <div key={index.name} className={cardClassName}>
                    <div className="index-name">{index.name}</div>
                    <div className="index-value">{index.value.toFixed(2)}</div>
                    <div className="index-change">
                        {sign}{index.change.toFixed(2)} ({sign}{index.changeRate.toFixed(2)}%)
                    </div>
                </div>
            );
        })}
        </div>
    );
}

export default IndexCard;