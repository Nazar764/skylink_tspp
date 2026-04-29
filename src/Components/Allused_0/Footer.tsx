/* Це кінець сайту він має дублюватися на інші вкладки постійно його не треба чіпати хіба добавити якісь силки*/

import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
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
  );
};

export default Footer;
