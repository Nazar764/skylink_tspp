/*Навігація по сайту має дублюватись на кожну вкладку*/

import React from 'react';
import './Navigation.css';

interface NavigationProps {
  onChatOpen: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ onChatOpen }) => {
  return (
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
        <button className="btn-ghost" onClick={onChatOpen}>Увійти</button>
        <button className="btn-primary" onClick={onChatOpen}>Реєстрація</button>
      </div>
    </nav>
  );
};

export default Navigation;
