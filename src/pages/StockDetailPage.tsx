// src/pages/StockDetailPage.tsx

import { useParams } from 'react-router-dom';

function StockDetailPage() {
    // url의 path parameter 중 stockCode를 추출
    const { stockCode } = useParams();

    return (
        <div>
            <h2>Stock Detail Page: {stockCode}</h2>
            {/* 종목 상세 정보를 표시하는 컴포넌트 */}
        </div>
    )
}

export default StockDetailPage;