/*Навігація по сайту має дублюватись на кожну вкладку*/

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

interface NavigationProps {
  user: any | null;
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onSignOut: () => void;
  onChatOpen: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ user, onLoginClick, onRegisterClick, onSignOut }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((current) => !current);
  const closeMenu = () => setMenuOpen(false);
  const toggleUserMenu = () => setUserMenuOpen((current) => !current);
  const closeUserMenu = () => setUserMenuOpen(false);

  const displayName = user?.user_metadata?.full_name || user?.email || 'Користувач';
  const avatarUrl = user?.user_metadata?.avatar_url || user?.app_metadata?.provider_avatar_url || null;
  const initials = displayName
    .split(' ')
    .map((part: string) => part[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

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
      <button
        type="button"
        className={`burger ${menuOpen ? 'open' : ''}`}
        aria-expanded={menuOpen}
        aria-label="Toggle navigation menu"
        onClick={toggleMenu}
      >
        <span />
        <span />
        <span />
      </button>

      <ul className={`nav-menu ${menuOpen ? 'open' : ''}`}>
        <li><Link to="/" onClick={closeMenu}>Головна</Link></li>
        <li><Link to="/flights" onClick={closeMenu}>Рейси</Link></li>
        <li><Link to="/Reservation" onClick={closeMenu}>Бронювання</Link></li>
        <li><Link to="/luggage" onClick={closeMenu}>Багаж</Link></li>
        <li><Link to="/support" onClick={closeMenu}>Підтримка</Link></li>
      </ul>
      <div className="nav-btns">
        {user ? (
          <div className="user-block">
            <button className="user-pill" type="button" onClick={toggleUserMenu}>
              {avatarUrl ? (
                <img className="user-avatar" src={avatarUrl} alt="Аватар" />
              ) : (
                <div className="user-avatar user-avatar--fallback">{initials}</div>
              )}
              <span>{displayName}</span>
            </button>
            {userMenuOpen && (
              <div className="user-menu" onMouseLeave={closeUserMenu}>
                <div className="user-menu__header">Мій акаунт</div>
                <div className="user-menu__actions">
                  <button type="button" className="btn-ghost">Профіль</button>
                  <button type="button" className="btn-ghost">Мої квитки</button>
                </div>
                <button type="button" className="btn-ghost btn-ghost--danger user-menu__logout" onClick={onSignOut}>
                  Вийти
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <button className="btn-ghost" type="button" onClick={onLoginClick}>Увійти</button>
            <button className="btn-primary" type="button" onClick={onRegisterClick}>Реєстрація</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
