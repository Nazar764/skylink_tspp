import React from 'react';
import Footer from '../Components/Allused_0/Footer';

const Tickets: React.FC = () => {
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
            <div className="section-label">Квитки</div>
            <h1>Придбайте квиток за кілька хвилин</h1>
          </div>
          <p>
            Ознайомтесь з тарифами, оберіть зручний клас і оформлюйте квиток
            онлайн. Підтримка та підтвердження — миттєво.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Tickets;
