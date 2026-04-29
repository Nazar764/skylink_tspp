import React, { useState } from 'react';
import './APP.css';

// Вказуємо, що SkyLinkLanding — це функціональний компонент React (Functional Component)
const SkyLinkLanding: React.FC = () => {
  // Використовуємо дженерик <string>, щоб явно вказати, що activeTab завжди буде рядком
  const [activeTab, setActiveTab] = useState<string>('В один бік');

  // Вказуємо тип масиву як масив рядків (string[])
  const tabs: string[] = ['В один бік', 'Туди і назад', 'Кілька міст'];

  return (
    <>
      <nav>
        <div className="logo">
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
            </svg>
          </div>
          Sky<span>Link</span>
        </div>
        <ul>
          <li><a href="#flights">Рейси</a></li>
          <li><a href="#tickets">Квитки</a></li>
          <li><a href="#luggage">Багаж</a></li>
          <li><a href="#support">Підтримка</a></li>
          <li><a href="#about">Про нас</a></li>
        </ul>
        <div className="nav-btns">
          <button className="btn-ghost">Увійти</button>
          <button className="btn-primary">Реєстрація</button>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-clouds">
          <div className="cloud c1"></div>
          <div className="cloud c2"></div>
          <div className="cloud c3"></div>
          <div className="cloud c4"></div>
        </div>
        <div className="hero-badge">✈ Надійні перельоти з SkyLink</div>
        <h1>Летіть <em>вище</em> —<br />з комфортом та впевненістю</h1>
        <p>Купуйте квитки онлайн, відстежуйте рейси в реальному часі та отримуйте миттєву підтримку 24/7</p>
        <div className="hero-cta">
          <button className="btn-hero btn-hero-primary">Знайти рейс</button>
          <button className="btn-hero btn-hero-outline">Дізнатися більше</button>
        </div>
        <div className="search-card">
          <div className="search-tabs">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="search-row">
            <div className="field">
              <label>Звідки</label>
              <input type="text" placeholder="Київ (KBP)" />
            </div>
            <div className="field">
              <label>Куди</label>
              <input type="text" placeholder="Місто або аеропорт" />
            </div>
            <div className="field">
              <label>Дата вильоту</label>
              <input type="date" />
            </div>
            <button className="btn-search">Пошук</button>
          </div>
        </div>
      </section>

      <div className="stats">
        <div className="stat"><div className="stat-num">120<span>+</span></div><div className="stat-label">Напрямків польотів</div></div>
        <div className="stat"><div className="stat-num">2.4<span>М</span></div><div className="stat-label">Пасажирів на рік</div></div>
        <div className="stat"><div className="stat-num">98<span>%</span></div><div className="stat-label">Вчасних вильотів</div></div>
        <div className="stat"><div className="stat-num">24<span>/7</span></div><div className="stat-label">Служба підтримки</div></div>
      </div>

      <section className="features">
        <div className="section-label">Можливості платформи</div>
        <div className="section-title">Все для зручного перельоту</div>
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">🎫</div>
            <h3>Купівля квитків онлайн</h3>
            <p>Швидке бронювання та оплата з будь-якого пристрою. Підтримка всіх популярних платіжних систем.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🧳</div>
            <h3>Відстеження багажу</h3>
            <p>Подавайте заявки щодо загубленого або пошкодженого багажу та отримуйте статус у реальному часі.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>ШІ-підтримка</h3>
            <p>Штучний інтелект миттєво класифікує та маршрутизує ваші запити до потрібного спеціаліста.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📡</div>
            <h3>Рейси в реальному часі</h3>
            <p>Відстежуйте місцезнаходження вашого рейсу на інтерактивній карті з точністю до хвилини.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💺</div>
            <h3>Вибір місць</h3>
            <p>Переглядайте вільні місця в залі та в літаку. Обирайте зручне місце ще під час бронювання.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔔</div>
            <h3>Нагадування та сповіщення</h3>
            <p>Отримуйте сповіщення про статус рейсу, реєстрацію та багаж через Telegram або на сайті.</p>
          </div>
        </div>
      </section>

      <section className="destinations">
        <div className="destinations-inner">
          <div className="section-label">Популярні напрямки</div>
          <div className="section-title">Куди хочете полетіти?</div>
          <div className="dest-grid">
            <div className="dest-card">
              <div className="dest-img paris">🗼</div>
              <div className="dest-info">
                <div className="dest-city">Париж</div>
                <div className="dest-price">від 4 200 грн</div>
                <div className="dest-tag">Популярний</div>
              </div>
            </div>
            <div className="dest-card">
              <div className="dest-img tokyo">⛩️</div>
              <div className="dest-info">
                <div className="dest-city">Токіо</div>
                <div className="dest-price">від 12 800 грн</div>
                <div className="dest-tag">Далекі рейси</div>
              </div>
            </div>
            <div className="dest-card">
              <div className="dest-img dubai">🏙️</div>
              <div className="dest-info">
                <div className="dest-city">Дубай</div>
                <div className="dest-price">від 7 600 грн</div>
                <div className="dest-tag">Бізнес</div>
              </div>
            </div>
            <div className="dest-card">
              <div className="dest-img ny">🗽</div>
              <div className="dest-info">
                <div className="dest-city">Нью-Йорк</div>
                <div className="dest-price">від 15 200 грн</div>
                <div className="dest-tag">Трансатлантика</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="roles-section">
        <div className="section-label">Ролі в системі</div>
        <div className="section-title">Для кожного — свій інтерфейс</div>
        <div className="roles-grid">
          <div className="role-card">
            <div className="role-avatar role-av-blue">👤</div>
            <div className="role-info">
              <h3>Пасажир / Клієнт</h3>
              <p>Купівля квитків, відстеження рейсів, подання звернень щодо багажу, перегляд статусу</p>
              <div className="role-tags">
                <span className="tag">Квитки</span>
                <span className="tag">Рейси</span>
                <span className="tag">Багаж</span>
                <span className="tag">Сповіщення</span>
              </div>
            </div>
          </div>
          <div className="role-card">
            <div className="role-avatar role-av-purple">🎫</div>
            <div className="role-info">
              <h3>Касир</h3>
              <p>Оформлення та скасування квитків, реєстрація пасажирів, друк посадкових талонів</p>
              <div className="role-tags">
                <span className="tag">Оформлення</span>
                <span className="tag">Скасування</span>
                <span className="tag">Реєстрація</span>
              </div>
            </div>
          </div>
          <div className="role-card">
            <div className="role-avatar role-av-green">🎧</div>
            <div className="role-info">
              <h3>Оператор підтримки</h3>
              <p>Обробка звернень щодо багажу, перевірка статусів, формування щоденних звітів</p>
              <div className="role-tags">
                <span className="tag">Звернення</span>
                <span className="tag">Статуси</span>
                <span className="tag">Звіти</span>
              </div>
            </div>
          </div>
          <div className="role-card">
            <div className="role-avatar role-av-amber">⚙️</div>
            <div className="role-info">
              <h3>Адміністратор</h3>
              <p>Управління обліковими записами, налаштування тарифів, логи активності, інтеграції</p>
              <div className="role-tags">
                <span className="tag">Акаунти</span>
                <span className="tag">Тарифи</span>
                <span className="tag">Логи</span>
                <span className="tag">Інтеграції</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="footer-inner">
          <div>
            <div className="footer-logo">Sky<span>Link</span></div>
            <div className="footer-desc">Авіакомпанія нового покоління. Сучасні технології, надійний сервіс, зручне обслуговування для кожного пасажира.</div>
          </div>
          <div className="footer-col">
            <h4>Послуги</h4>
            <ul>
              <li>Купити квиток</li>
              <li>Реєстрація на рейс</li>
              <li>Відстеження багажу</li>
              <li>Спеціальні пропозиції</li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Підтримка</h4>
            <ul>
              <li>Центр допомоги</li>
              <li>Telegram-бот</li>
              <li>Зворотній зв'язок</li>
              <li>Статус рейсів</li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Компанія</h4>
            <ul>
              <li>Про нас</li>
              <li>Кар'єра</li>
              <li>Новини</li>
              <li>Партнери</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 SkyLink. Всі права захищено.</span>
          <span>Політика конфіденційності · Умови використання</span>
        </div>
      </footer>
    </>
  );
};

export default SkyLinkLanding;