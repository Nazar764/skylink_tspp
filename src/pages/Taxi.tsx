import React from 'react';
import Footer from '../Components/Allused_0/Footer';
import Reservation from '../Components/Reservation/Reservation'; // Прибрали .tsx на кінці

const TAXI_HOTEL: React.FC = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 1. Головний контент сторінки */}
      <main style={{ flex: 1 }}>
        <Reservation />
      </main>

      {/* 2. Підвал сторінки */}
      <Footer />
    </div>
  );
};

export default TAXI_HOTEL;