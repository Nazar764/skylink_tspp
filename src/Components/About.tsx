/*це вкладка з коментарями і про нас тут треба буде потім підключити базу щоб користувачі могли залишати відгуки*/
import React from 'react';
import './About.css';

interface AboutProps {
  onChatOpen: () => void;
}

const COMMENTS = [
  {
    id: 1,
    name: 'Користувач',
    avatar: '',
    rating: 5,
    date: '2 відгуки • місяць тому',
    text: 'Гарний і приємний сервіс. Дуже зручно користуватись.',
  },
];

const About: React.FC<AboutProps> = ({ onChatOpen }) => {
  return (
    <section id="about" className="about-section">
      <div className="about-container">
        
        <div className="about-grid">
          
          {/* TEXT */}
          <div className="about-text">
            <div className="section-label">Про нас</div>
            <h2 className="section-title">SkyLink — сучасний сервіс для подорожей</h2>
            
            <p>
              SkyLink допомагає обрати найзручніший рейс, купити квиток та отримати підтримку 
              на всіх етапах подорожі. Ми прагнемо зробити ваш переліт простим, комфортним і безпечним.
            </p>

            <div className="about-features">
              <div className="about-feature">
                <strong>Лише потрібна інформація: </strong>
                <span>Чіткий вибір рейсів, гнучкі дати та доступні тарифи.</span>
              </div>

              <div className="about-feature">
                <strong>Підтримка онлайн: </strong>
                <span>Чат-помічник та служба підтримки завжди поруч.</span>
              </div>

              <div className="about-feature">
                <strong>Швидкі результати: </strong>
                <span>Пошук і бронювання проходять менш ніж за хвилину.</span>
              </div>
            </div>
          </div>

          {/* CARDS */}
          <div className="about-cards">
            
            <div className="about-card">
              <div className="about-card-photo photo-1">✈️</div>
              <div className="about-card-label">Сучасний підхід</div>
              <p>Ми поєднуємо інтуїтивний дизайн, швидкий пошук і зручні інструменти.</p>
            </div>

            <div 
              className="about-card clickable"
              onClick={onChatOpen}
            >
              <div className="about-card-photo photo-2">💬</div>
              <div className="about-card-label">Потрібна допомога?</div>
              <p>Натисніть тут, щоб відкрити чат-помічник.</p>
            </div>

            <div className="about-card">
              <div className="about-card-photo photo-3">🌍</div>
              <div className="about-card-label">Мережа SkyLink</div>
              <p>Сервіс розширюється і підтримує більше напрямків.</p>
            </div>

          </div>
        </div>

        {/* COMMENTS */}
        <div className="about-comments">
          
          <div className="comments-header">
            <div>
              <div className="section-label">Коментарі</div>
              <h3>Що говорять користувачі</h3>
            </div>

            <button className="btn-comment" disabled>
              Залишити коментар
            </button>
          </div>

          <div className="comment-list">
            {COMMENTS.map((c) => (
<article className="comment-card">
  
  <div className="comment-header">
    
    <div className="avatar">
      {c.avatar ? (
        <img src={c.avatar} alt={c.name} />
      ) : (
        <span>👤</span>
      )}
    </div>

    <div className="comment-meta">
      <strong>{c.name}</strong>
      <span className="comment-date">{c.date}</span>

      <div className="stars">
        {'★'.repeat(c.rating)}
        {'☆'.repeat(5 - c.rating)}
      </div>
    </div>

  </div>

  <p className="comment-text">{c.text}</p>

</article>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};

export default About;