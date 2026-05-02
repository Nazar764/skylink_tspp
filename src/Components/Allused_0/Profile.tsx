import React, { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase';
import './Profile.css';

interface UserData {
  full_name: string;
  phone_number: string;
  avatar_url: string;
  email: string;
  bonus_points: number;
}

const months = [
  'Січ', 'Лют', 'Бер', 'Кві', 'Тра', 'Чер',
  'Лип', 'Сер', 'Вер', 'Жов', 'Лис', 'Гру'
];

const Profile: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState('');

  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    avatar_url: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) return;

      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('email', session.user.email)
        .single();

      if (error) throw error;

      if (data) {
        setUser(data);
        setAvatarPreview(data.avatar_url || '');
        setFormData({
          full_name: data.full_name || '',
          phone_number: data.phone_number || '',
          avatar_url: data.avatar_url || ''
        });
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.type !== 'image/png') {
      alert('Можна завантажити тільки PNG файл');
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        alert('Користувач не авторизований');
        return;
      }

      const filePath = `${session.user.id}/avatar.png`;

      await supabase.storage
        .from('avatars')
        .remove([filePath]);

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const publicUrl = `${data.publicUrl}?v=${Date.now()}`;

      setAvatarPreview(publicUrl);
      setFormData((prev) => ({
        ...prev,
        avatar_url: publicUrl
      }));

    } catch (err) {
      console.error(err);
      alert('Помилка завантаження аватарки');
    }
  };

  const handleUpdate = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) return;

      const { error } = await supabase
        .from('clients')
        .update({
          full_name: formData.full_name,
          phone_number: formData.phone_number,
          avatar_url: formData.avatar_url
        })
        .eq('email', session.user.email);

      if (error) throw error;

      setUser({
        ...user!,
        full_name: formData.full_name,
        phone_number: formData.phone_number,
        avatar_url: formData.avatar_url
      });

      setAvatarPreview(formData.avatar_url);
      setIsEditing(false);

      alert('Дані успішно оновлено!');
    } catch (err) {
      alert('Помилка при оновленні');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="profile-loader">Завантаження профілю...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-layout">

        <aside className="profile-sidebar">
          <div className="avatar-wrapper">
            <img
              src={avatarPreview || 'https://via.placeholder.com/250'}
              alt="Avatar"
              className="profile-avatar-big"
            />

            {isEditing && (
              <label className="avatar-upload-btn">
                PNG
                <input
                  type="file"
                  accept="image/png"
                  onChange={handleAvatarFile}
                  hidden
                />
              </label>
            )}
          </div>

          <h1>{user?.full_name || 'Користувач'}</h1>
          <p className="profile-email">{user?.email}</p>

          <div className="bonus-card">
            <span>Бонуси</span>
            <strong>{user?.bonus_points || 0}</strong>
            <small>для майбутніх польотів</small>
          </div>

          <div className="profile-actions">
            {isEditing ? (
              <>
                <button className="btn-save" onClick={handleUpdate}>
                  Зберегти
                </button>
                <button className="btn-cancel" onClick={() => setIsEditing(false)}>
                  Скасувати
                </button>
              </>
            ) : (
              <button className="btn-edit" onClick={() => setIsEditing(true)}>
                Редагувати профіль
              </button>
            )}
          </div>
        </aside>

        <main className="profile-main">

          <section className="profile-section">
            <div className="section-title-row">
              <h2>Ваші польоти за 2026 рік</h2>
              <span className="year-badge">2026</span>
            </div>

            <div className="flights-grid">
              <div className="flight-card">
                <span>Усього польотів</span>
                <strong>0</strong>
                <p>Пізніше підтягнемо з бази</p>
              </div>

              <div className="flight-card">
                <span>Країн відвідано</span>
                <strong>0</strong>
                <p>Буде рахуватись по рейсах</p>
              </div>

              <div className="flight-card">
                <span>Годин у небі</span>
                <strong>0</strong>
                <p>Буде братись з часу рейсів</p>
              </div>

              <div className="flight-card highlight">
                <span>Наступний рейс</span>
                <strong>—</strong>
                <p>Поки немає даних</p>
              </div>
            </div>
          </section>

          <section className="profile-section">
            <h2>Особиста інформація</h2>

            <div className="info-grid">
              <div className="info-item">
                <label>Повне ім&apos;я</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) =>
                      setFormData({ ...formData, full_name: e.target.value })
                    }
                  />
                ) : (
                  <p>{user?.full_name || 'Не вказано'}</p>
                )}
              </div>

              <div className="info-item">
                <label>Номер телефону</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.phone_number}
                    onChange={(e) =>
                      setFormData({ ...formData, phone_number: e.target.value })
                    }
                  />
                ) : (
                  <p>{user?.phone_number || 'Додати номер'}</p>
                )}
              </div>
            </div>
          </section>

          <section className="profile-section">
            <div className="activity-title-row">
              <h2>Активність польотів</h2>
              <span className="year-badge">2026</span>
            </div>

            <div className="activity-calendar">
              <div className="months-row">
                {months.map((month) => (
                  <span key={month}>{month}</span>
                ))}
              </div>

              <div className="activity-box">
                {Array.from({ length: 168 }).map((_, index) => (
                  <span
                    key={index}
                    className={`activity-dot ${
                      index % 29 === 0
                        ? 'level-3'
                        : index % 17 === 0
                        ? 'level-2'
                        : index % 9 === 0
                        ? 'level-1'
                        : ''
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="activity-footer">
              <span>Менше</span>
              <span className="activity-dot"></span>
              <span className="activity-dot level-1"></span>
              <span className="activity-dot level-2"></span>
              <span className="activity-dot level-3"></span>
              <span>Більше</span>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
};

export default Profile;