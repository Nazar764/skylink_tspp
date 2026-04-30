import React, { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase';
import './Navigation.css';

type AuthMode = 'signIn' | 'signUp' | null;

interface AuthModalProps {
  mode: AuthMode;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ mode, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!mode) {
      setEmail('');
      setPassword('');
      setFullName('');
      setPhone('');
      setError('');
      setLoading(false);
    }
  }, [mode]);

  if (!mode) return null;

  const title = mode === 'signIn' ? 'Увійти в акаунт' : 'Створити акаунт';
  const buttonText = mode === 'signIn' ? 'Увійти' : 'Реєстрація';
  const helperText = mode === 'signIn'
    ? 'Увійдіть за допомогою email, паролю або через Google / GitHub.'
    : 'Введіть email та пароль, або оберіть один із соціальних варіантів.';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'signIn') {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
      } else {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              phone,
            },
          },
        });
        if (signUpError) throw signUpError;

        const { error: insertError } = await supabase.from('clients').insert({
          full_name: fullName,
          email,
          phone_number: phone,
        });
        if (insertError) throw insertError;
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Помилка авторизації');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'github') => {
    setLoading(true);
    setError('');

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (oauthError) {
      setError(oauthError.message);
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close" type="button" onClick={onClose}>
          ×
        </button>
        <div className="auth-header">
          <h2>{title}</h2>
          <p>{helperText}</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@email.com"
              required
            />
          </label>
          {mode === 'signUp' && (
            <>
              <label>
                Повне ім’я
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ім'я Прізвище"
                  required
                />
              </label>
              <label>
                Телефон
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+380"
                  required
                />
              </label>
            </>
          )}
          <label>
            Пароль
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </label>
          {error && <div className="auth-error">{error}</div>}
          <button className="btn-primary auth-submit" type="submit" disabled={loading}>
            {loading ? 'Зачекайте...' : buttonText}
          </button>
        </form>
        <div className="auth-divider">Або</div>
        <div className="auth-socials">
          <button className="btn-ghost social-btn" type="button" onClick={() => handleOAuth('google')} disabled={loading}>
            <span className="social-icon social-icon--google" aria-hidden="true">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.35 11.1H12v2.8h5.35c-.22 1.18-.88 2.18-1.86 2.86v2.36h3.02c1.76-1.62 2.77-4.01 2.77-6.72 0-.54-.05-1.06-.16-1.57z" fill="#4285F4" />
                <path d="M12 22c2.43 0 4.46-.8 5.95-2.18l-3.02-2.36c-.82.55-1.88.88-2.93.88-2.25 0-4.16-1.52-4.84-3.56H3.98v2.23C5.49 19.75 8.5 22 12 22z" fill="#34A853" />
                <path d="M7.16 13.78a5.41 5.41 0 0 1 0-3.49V8.06H3.98a8.99 8.99 0 0 0 0 7.88l3.18-2.16z" fill="#FBBC05" />
                <path d="M12 7.18c1.32 0 2.49.45 3.42 1.34l2.56-2.5C16.44 4.72 14.44 4 12 4a8.99 8.99 0 0 0-8.02 4.06l3.18 2.23C7.84 8.7 9.75 7.18 12 7.18z" fill="#EA4335" />
              </svg>
            </span>
            Google
          </button>
          <button className="btn-ghost social-btn" type="button" onClick={() => handleOAuth('github')} disabled={loading}>
            <span className="social-icon social-icon--github" aria-hidden="true">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0C5.37 0 .003 5.37.003 12c0 5.3 3.438 9.8 8.205 11.39.6.11.82-.26.82-.58 0-.29-.01-1.05-.02-2.06-3.34.73-4.04-1.61-4.04-1.61-.55-1.4-1.35-1.77-1.35-1.77-1.1-.75.08-.74.08-.74 1.22.09 1.87 1.25 1.87 1.25 1.08 1.85 2.83 1.31 3.52 1 .11-.78.42-1.31.76-1.61-2.66-.3-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.24-3.22-.12-.31-.54-1.56.12-3.25 0 0 1.01-.32 3.3 1.23a11.44 11.44 0 0 1 3.01-.4c1.02.01 2.05.14 3.01.4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.69.24 2.94.12 3.25.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.62-5.47 5.92.43.37.81 1.1.81 2.22 0 1.6-.01 2.88-.01 3.27 0 .32.22.69.82.57C20.565 21.796 24 17.3 24 12c0-6.63-5.37-12-12-12z" fill="#181717" />
              </svg>
            </span>
            GitHub
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
