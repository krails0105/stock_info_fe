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
                    // onClick={() => onSelectSector(sector.sectorName)}
                    // 
                    // - onClick: 이 속성은 해당 li 요소를 클릭했을 때 실행할 함수를 지정합니다.
                    // - { ... } : 중괄호 안에 자바스크립트 코드를 넣을 수 있습니다.
                    // - () => ... : 화살표 함수(Arrow Function) 문법입니다. 클릭 시 실행할 코드를 함수로 만듭니다.
                    // - onSelectSector(sector.sectorName): onSelectSector 함수에 sector.sectorName(섹터 이름)을 인자로 넘깁니다.
                    // 
                    // 즉, li를 클릭하면 sector.sectorName이 onSelectSector 함수에 전달됩니다.
                    
                    // 화살표 함수(Arrow Function)는 ES6에서 도입된 함수 선언 방식으로, function 키워드 대신 => 기호를 사용합니다.
                    // 예시: (매개변수) => { 실행코드 }
                    // 여기서는 onClick 이벤트에 사용할 때, 
                    // onClick={() => onSelectSector(sector.sectorName)}
                    // 와 같이 작성하면 해당 li를 클릭할 때 sector.sectorName을 onSelectSector 함수에 전달합니다.
                    <li key={sector.sectorId} onClick={() => onSelectSector(sector.sectorName)}>
                        {sector.sectorName}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SectorList;