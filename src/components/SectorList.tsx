import { useState, useEffect } from 'react';
import axios from 'axios';

// 백엔드의 SectorDto
interface Sector {
    sectorId: string;
    sectorName: string;
    discription: string;
    interestScore: number;
    stockCount: number;
    avgPer: string;
    avgPbr: string;
}

interface SectorListProps {
    onSelectSector: (sectorName: string) => void;
}


function SectorList({ onSelectSector }: SectorListProps) {
    // 섹터 목록 데이터
    const [sectors, setSectors] = useState<Sector[]>([]);

    // 컴포넌트가 처음 렌더링 될 때 한 번만 API 호출
    useEffect(() => {
        axios.get('http://localhost:8080/api/sectors')
            .then(response => {
                setSectors(response.data);
            })
            .catch(error => {
                console.error('Error fetching sectors:', error);
            });
    }, []); // 빈 배열을 전달하여 최초 1회만 실행되도록 설정

    return (
        <div>
            <h2>Sector List</h2>
            <ul className="sector-list">
                {sectors.map(sector => (
                    // li를 클릭하면 onSelectSector 함수를 호출하여 선택된 섹터의 이름을 전달
                    <li key={sector.sectorId} onClick={() => onSelectSector(sector.sectorName)}>
                        {sector.sectorName}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SectorList;