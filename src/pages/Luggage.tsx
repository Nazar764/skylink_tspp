import React from 'react';
import Footer from '../Components/Allused_0/Footer';

const Luggage: React.FC = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <main style={{ flex: 1 }} className="page-wrapper">
        <section className="section-center">
          <div className="section-header">
            <div className="section-label">Багаж</div>
            <h1>Нормативи багажу та правила перевезення</h1>
          </div>
          <p>
            Дізнайтесь вимоги до ручної поклажі та реєстрованого багажу. Ми допоможемо
            вам підготуватися до подорожі без зайвого клопоту.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Luggage;
