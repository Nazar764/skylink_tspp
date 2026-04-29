import React from 'react';
import './Hero.css';

const Hero: React.FC = () => {
  return (
    <section className="hero">
      <div className="hero-clouds">
        <div className="cloud c1"></div>
        <div className="cloud c2"></div>
        <div className="cloud c3"></div>
        <div className="cloud c4"></div>
      </div>

      <div className="hero-badge">✈ Надійні перельоти з SkyLink</div>

      <h1>
        Летіть <em>вище</em> —<br />
        з комфортом та впевненістю
      </h1>

      <p>
        Купуйте квитки онлайн, відстежуйте рейси в реальному часі 
        та отримуйте миттєву підтримку 24/7
      </p>

      <div className="hero-cta">
        <button className="btn-hero btn-hero-primary">Знайти рейс</button>
        <button className="btn-hero btn-hero-outline">Дізнатися більше</button>
      </div>
    </section>
  );
};

export default Hero;