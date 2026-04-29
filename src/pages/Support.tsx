import React from 'react';
import Footer from '../Components/Allused_0/Footer';

const Support: React.FC = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <main className="page-wrapper" style={{ flex: 1 }}>
        <section className="section-center">
          <div className="section-header">
            <div className="section-label">Підтримка</div>
            <h1>Контакти та допомога для пасажирів</h1>
          </div>
          <p>
            Зверніться до служби підтримки SkyLink у будь-який час. Ми допоможемо вам
            з бронюванням, змінами квитка та іншими запитами.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Support;
