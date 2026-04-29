import React from 'react';
import Footer from '../Components/Allused_0/Footer';
import MainFlights from '../Components/Flight_2/MainFlights';

const Flights: React.FC = () => {
  return (
    <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <MainFlights />
      <Footer />
    </div>
  );
};

export default Flights;
