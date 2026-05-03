import { supabase } from '../../utils/supabase'; // <-- Перевір правильність шляху до свого файлу supabase
import React, { useState, useEffect } from 'react';
import './About.css';

interface AboutProps {
  onChatOpen: () => void;
}

interface UserProfile {
  id: number;
  full_name: string;
  avatar_url: string;
}

interface Comment {
  id: number;
  client_id: number;
  rating: number;
  text: string;
  created_at: string;
  clients?: UserProfile | null;
}

const About: React.FC<AboutProps> = ({ onChatOpen }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [user, setUser] = useState<any>(null);
  
  // Стейт для нового коментаря (*new comment state* [стан нового коментаря])
  const [newText, setNewText] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Сортування (*sorting* [сортування])
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'lowest'>('newest');

  useEffect(() => {
    // Отримуємо поточну сесію користувача
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    fetchComments();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        id,
        rating,
        text,
        created_at,
        clients (
          id, 
          full_name,
          avatar_url
        )
      `) // ФІКС: Тут було client_id, тепер всюди просто id
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Помилка завантаження відгуків:", error.message);
    } else if (data) {
      setComments(data as unknown as Comment[]);
    }
  };

  const handleSubmit = async () => {
    if (!user || !newText.trim() || newRating === 0) return;
    
    setIsSubmitting(true);
    
    // Спочатку знаходимо id клієнта в таблиці clients за його email з Auth
    const { data: clientData, error: clientError } = await supabase
      .from('clients')
      .select('id')
      .eq('email', user.email)
      .single();

    if (clientError || !clientData) {
      console.error("Клієнта не знайдено в базі даних:", clientError?.message);
      setIsSubmitting(false);
      return;
    }

    const { error } = await supabase
      .from('reviews')
      .insert([
        { 
          client_id: clientData.id, 
          rating: newRating, 
          text: newText 
        }
      ]);

    if (!error) {
      setNewText('');
      setNewRating(0);
      await fetchComments();
    } else {
      console.error("Помилка відправки відгуку:", error.message);
    }
    
    setIsSubmitting(false);
  };

  // Аналітика (*analytics* [аналітика])
  const totalReviews = comments.length;
  const averageRating = totalReviews 
    ? (comments.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1)
    : '0.0';

  const getRatingPercent = (star: number) => {
    if (totalReviews === 0) return 0;
    const count = comments.filter(c => c.rating === star).length;
    return (count / totalReviews) * 100;
  };

  // Сортування коментарів (*sorting comments* [сортування коментарів])
  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    if (sortBy === 'highest') return b.rating - a.rating;
    if (sortBy === 'lowest') return a.rating - b.rating;
    return 0;
  });

  return (
    <section id="about" className="about-section">
      <div className="about-container">
        
        <div className="about-grid">
          {/* TEXT */}
          <div className="about-text">
            <div className="section-label">Головна сторінка</div>
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

        {/* REVIEWS SECTION */}
        <div className="about-comments">
          
          <div className="comments-header">
            <div>
              <div className="section-label">Відгуки</div>
              <h3>Рейтинг та коментарі</h3>
            </div>
            
            {/* Сортування */}
            <select 
              className="sort-dropdown" 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="newest">Найновіші</option>
              <option value="highest">Найвища оцінка</option>
              <option value="lowest">Найнижча оцінка</option>
            </select>
          </div>

          {/* Аналітика в стилі Google Play */}
          <div className="reviews-analytics">
            <div className="average-score">
              <span className="big-number">{averageRating}</span>
              <div className="stars-display">
                {'★'.repeat(Math.round(Number(averageRating)))}
                {'☆'.repeat(5 - Math.round(Number(averageRating)))}
              </div>
              <span className="total-count">{totalReviews} відгуків</span>
            </div>
            
            <div className="progress-bars">
              {[5, 4, 3, 2, 1].map((star) => (
                <div className="bar-row" key={star}>
                  <span className="bar-num">{star}</span>
                  <div className="bar-track">
                    <div 
                      className="bar-fill" 
                      style={{ width: `${getRatingPercent(star)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Форма нового відгуку (*new review form* [форма нового відгуку]) */}
          <div className="comment-form-container">
            {user ? (
              <div className="comment-form">
                <div className="rating-selector">
                  <span className="selector-label">Оцініть сервіс:</span>
                  <div className="interactive-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`interactive-star ${star <= (hoveredStar || newRating) ? 'active' : ''}`}
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(0)}
                        onClick={() => setNewRating(star)}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                
                <textarea 
                  placeholder="Поділіться своїми враженнями від польоту..."
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                />
                
                <button 
                  className="btn-submit-review" 
                  onClick={handleSubmit}
                  disabled={!newText.trim() || newRating === 0 || isSubmitting}
                >
                  {isSubmitting ? 'Відправка...' : 'Опублікувати'}
                </button>
              </div>
            ) : (
              <div className="login-prompt">
                <div className="login-icon">🔒</div>
                <p>Лише авторизовані пасажири можуть залишати відгуки.</p>
              </div>
            )}
          </div>

          {/* Список коментарів */}
          <div className="comment-list">
            {sortedComments.map((c) => (
              <article className="comment-card" key={`comment-${c.id}`}>
                <div className="comment-header">
                  <div className="avatar">
                    {c.clients?.avatar_url ? (
                      <img src={c.clients.avatar_url} alt={c.clients?.full_name || 'Користувач'} />
                    ) : (
                      <span>👤</span>
                    )}
                  </div>
                  <div className="comment-meta">
                    <strong>{c.clients?.full_name || 'Невідомий користувач'}</strong>
                    <span className="comment-date">
                      {new Date(c.created_at).toLocaleDateString('uk-UA', { 
                        day: 'numeric', month: 'long', year: 'numeric' 
                      })}
                    </span>
                    <div className="stars">
                      {'★'.repeat(c.rating)}
                      <span className="empty-stars">{'★'.repeat(5 - c.rating)}</span>
                    </div>
                  </div>
                </div>
                <p className="comment-text">{c.text}</p>
              </article>
            ))}
            
            {sortedComments.length === 0 && (
              <div className="no-comments-yet">
                <p>Ще немає жодного відгуку. Будьте першим!</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;