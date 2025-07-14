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

function SectorList() {
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
            {/* sectors를 순회하면서 각 섹터의 정보를 표시 */}
            {sectors.map(sector => (
                <li key={sector.sectorId}>
                    {sector.sectorName}
                    {sector.discription}
                    (관심도: {sector.interestScore})
                    (종목수: {sector.stockCount})
                    (평균PER: {sector.avgPer})
                    (평균PBR: {sector.avgPbr})
                </li>
            ))}
        </div>
    );
}

export default SectorList;