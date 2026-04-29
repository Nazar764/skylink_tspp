import React from 'react';
import Footer from '../Components/Footer';

const Flights: React.FC = () => {
  return (
    <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <main className="page-wrapper" style={{ flex: 1 }}>
        <section className="section-center">
          <div className="section-header">
            <div className="section-label">Рейси</div>
            <h1>Пошук та бронювання авіарейсів</h1>
          </div>
          <p>
            Знайдіть найшвидші та найвигідніші рейси. Введіть місто відправлення
            та призначення, оберіть дати і ми підберемо найкращі варіанти для вас.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Flights;
