import React from 'react';
import './Features.css';

const FEATURES = [
  { icon: '🎫', title: 'Купівля квитків онлайн', text: 'Швидке бронювання та оплата з будь-якого пристрою.' },
  { icon: '🧳', title: 'Відстеження багажу', text: 'Отримуйте статус багажу в реальному часі.' },
  { icon: '🤖', title: 'ШІ-підтримка', text: 'AI допомагає швидко вирішити будь-яке питання.' },
  { icon: '📡', title: 'Рейси в реальному часі', text: 'Відстежуйте рейси з точністю до хвилини.' },
  { icon: '💺', title: 'Вибір місць', text: 'Обирайте комфортні місця ще до польоту.' },
  { icon: '🔔', title: 'Сповіщення', text: 'Отримуйте всі важливі оновлення миттєво.' },
];

const Features: React.FC = () => {
  return (
    <section className="features">
      <div className="section-label">Можливості платформи</div>
      <div className="section-title">Все для зручного перельоту</div>

      <div className="feature-grid">
        {FEATURES.map((f, i) => (
          <div key={i} className="feature-card">
            <div className="feature-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;