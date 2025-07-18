import { useState } from 'react';
import SectorList from '../components/SectorList';
import StockList from '../components/StockList';
import IndexCard from '../components/IndexCard';

function HomePage() {
  const [selectedSector, setSelectedSector] = useState<string | null>(null);

  const handleSelectSector = (sectorName: string) => {
    setSelectedSector(sectorName);
  };

  return (
    <>
        <IndexCard />
        <SectorList onSelectSector={handleSelectSector} />
        <hr />
        {selectedSector && <StockList sector={selectedSector} />}
    </>
  )
}

export default HomePage;