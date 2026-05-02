import React, { useEffect, useMemo, useState } from 'react';
import './Reservation.css';
import { supabase } from '../../utils/supabase';

interface Hotel {
  id: number | string;
  city: string | null;
  name: string | null;
  price: string | null;
  image: string | null;
}

const FALLBACK_IMAGE = 'https://via.placeholder.com/400x250?text=No+image';

const Reservation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'hotels' | 'taxi'>('hotels');
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState<number>(0);
  const itemsPerPage = 3;

  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('hotels')
          .select('id, city, name, price, image');

        if (error) {
          console.error('Supabase error:', error);
          setError('Помилка при завантаженні даних.');
          setHotels([]);
        } else {
          setHotels((data as Hotel[]) || []);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Невідома помилка при завантаженні.');
        setHotels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  const cities = useMemo(() => {
    const setCities = new Set<string>();
    hotels.forEach(h => {
      const cityRaw = h.city ?? '';
      const cityName = cityRaw.split(',')[0].trim();
      if (cityName) setCities.add(cityName);
    });
    return ['All', ...Array.from(setCities)];
  }, [hotels]);

  useEffect(() => {
    setCurrentPage(0);
  }, [selectedCity]);

  const filteredHotels = useMemo(() => {
    if (selectedCity === 'All') return hotels;
    return hotels.filter(h => {
      const cityRaw = h.city ?? '';
      const cityName = cityRaw.split(',')[0].trim();
      return cityName.toLowerCase().includes(selectedCity.toLowerCase());
    });
  }, [hotels, selectedCity]);

  const totalPages = Math.max(1, Math.ceil(filteredHotels.length / itemsPerPage));

  useEffect(() => {
    if (currentPage > totalPages - 1) {
      setCurrentPage(Math.max(0, totalPages - 1));
    }
  }, [totalPages, currentPage]);

  const displayedHotels = filteredHotels.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <section className="reservation-section">
      <div className="reservation-header">
        <h2>Найпопулярніші варіанти</h2>
        <p>Бронюйте найкращі готелі через нашу систему.</p>
      </div>

      <div className="reservation-tabs" role="tablist" aria-label="Reservation tabs">
        <button
          role="tab"
          aria-selected={activeTab === 'hotels'}
          className={activeTab === 'hotels' ? 'active' : ''}
          onClick={() => setActiveTab('hotels')}
        >
          🏨 Готелі
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'taxi'}
          className={activeTab === 'taxi' ? 'active' : ''}
          onClick={() => setActiveTab('taxi')}
        >
          🚕 Трансфер
        </button>
      </div>

      {activeTab === 'hotels' && (
        <>
          <div className="city-filters" aria-label="City filters">
            {cities.map(city => (
              <button
                key={city}
                className={selectedCity === city ? 'city-btn active' : 'city-btn'}
                onClick={() => setSelectedCity(city)}
                aria-pressed={selectedCity === city}
              >
                {city}
              </button>
            ))}
          </div>

          <div className="hotels-grid">
            {loading ? (
              <p>Завантаження...</p>
            ) : error ? (
              <p className="error">{error}</p>
            ) : filteredHotels.length === 0 ? (
              <p>Готелі не знайдено.</p>
            ) : (
              displayedHotels.map((hotel) => (
                <div key={hotel.id?.toString() ?? Math.random()} className="hotel-card">
                  <img
                    src={hotel.image ?? FALLBACK_IMAGE}
                    alt={hotel.name ?? 'Hotel image'}
                    className="hotel-image"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      if (target.src !== FALLBACK_IMAGE) target.src = FALLBACK_IMAGE;
                    }}
                  />
                  <div className="hotel-info">
                    <span className="hotel-city">{hotel.city ?? '—'}</span>
                    <h3 className="hotel-name">{hotel.name ?? 'Без назви'}</h3>
                    <div className="hotel-bottom">
                      <span className="hotel-price">{hotel.price ?? 'Ціна не вказана'}</span>
                      <button
                        className="book-btn"
                        onClick={() => {
                          alert(`Бронювання: ${hotel.name ?? 'готель'}`);
                        }}
                      >
                        Забронювати
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {filteredHotels.length > itemsPerPage && (
            <div className="pagination" role="navigation" aria-label="Pagination">
              <button
                disabled={currentPage === 0}
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
              >
                ← Назад
              </button>
              <span>Сторінка {currentPage + 1} з {totalPages}</span>
              <button
                disabled={currentPage >= totalPages - 1}
                onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
              >
                Вперед →
              </button>
            </div>
          )}
        </>
      )}

      {activeTab === 'taxi' && (
        <div className="taxi-form-container">
          <form className="taxi-form" onSubmit={(e) => e.preventDefault()}>
            <h3>Замовити трансфер</h3>
            <div className="form-group">
              <label htmlFor="from">Звідки</label>
              <input id="from" name="from" type="text" placeholder="Аеропорт чи місто" />
            </div>
            <div className="form-group">
              <label htmlFor="to">Куди</label>
              <input id="to" name="to" type="text" placeholder="Ваш готель" />
            </div>
            <button type="button" className="book-taxi-btn">Знайти авто</button>
          </form>
        </div>
      )}
    </section>
  );
};

export default Reservation;
