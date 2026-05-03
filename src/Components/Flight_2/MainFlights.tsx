import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabase';
import './MainFlights.css';

interface Flight {
  id: number;
  flight_number: string;
  departure_airport: string;
  arrival_airport: string;
  departure_time: string;
  arrival_time: string;
  price: number;
  duration: string;
  from_image?: string | null;
  to_image?: string | null;
  seat_class?: string | null;
}

const MainFlights: React.FC = () => {
  const navigate = useNavigate();

  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [departDate, setDepartDate] = useState('');
  const [maxPrice, setMaxPrice] = useState('30000');
  const [sortBy, setSortBy] = useState<'price' | 'date' | 'destination'>('price');

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('flights')
        .select(`
          id,
          flight_number,
          departure_airport,
          arrival_airport,
          departure_time,
          arrival_time,
          price,
          duration,
          from_image,
          to_image,
          seat_class
        `)
        .order('departure_time', { ascending: true });

      if (error) throw error;

      setFlights(data || []);
    } catch (err) {
      console.error('Помилка завантаження рейсів:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('uk-UA', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (date: string) => {
    return new Date(date).toISOString().split('T')[0];
  };

  const filteredFlights = flights.filter((flight) => {
    const matchFrom =
      fromCity === '' ||
      flight.departure_airport.toLowerCase().includes(fromCity.toLowerCase());

    const matchTo =
      toCity === '' ||
      flight.arrival_airport.toLowerCase().includes(toCity.toLowerCase());

    const matchPrice = flight.price <= Number(maxPrice);

    const matchDate =
      departDate === '' ||
      formatDate(flight.departure_time) === departDate;

    return matchFrom && matchTo && matchPrice && matchDate;
  });

  const sortedFlights = [...filteredFlights].sort((a, b) => {
    if (sortBy === 'price') {
      return a.price - b.price;
    }

    if (sortBy === 'date') {
      return new Date(a.departure_time).getTime() - new Date(b.departure_time).getTime();
    }

    return a.arrival_airport.localeCompare(b.arrival_airport, 'uk');
  });

  const itemsPerPage = 4;
  const totalPages = Math.ceil(sortedFlights.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentFlights = sortedFlights.slice(startIdx, startIdx + itemsPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  if (loading) {
    return <div className="flights-page">Завантаження рейсів...</div>;
  }

  return (
    <div className="flights-page">
      <header className="flights-hero">
        <div className="hero-content">
          <h1>Відкривайте світ разом зі SkyLink</h1>
          <p>Міжнародні стандарти комфорту та надійності</p>
        </div>
      </header>

      <div className="flights-main-content">
        <section className="search-filter-section">
          <div className="filter-card">
            <div className="filter-inputs">
              <div className="input-field">
                <label>Звідки</label>
                <input
                  type="text"
                  placeholder="Місто або аеропорт"
                  value={fromCity}
                  onChange={(e) => {
                    setFromCity(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>

              <div className="input-field">
                <label>Куди</label>
                <input
                  type="text"
                  placeholder="Місто або аеропорт"
                  value={toCity}
                  onChange={(e) => {
                    setToCity(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>

              <div className="input-field">
                <label>Дата вильоту</label>
                <input
                  type="date"
                  value={departDate}
                  onChange={(e) => {
                    setDepartDate(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>

            <div className="filter-actions">
              <div className="price-range">
                <label>Ціна: до {Number(maxPrice).toLocaleString('uk-UA')} грн</label>
                <input
                  type="range"
                  min="0"
                  max="30000"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>

              <button className="btn-search" onClick={() => setCurrentPage(1)}>
                Пошук
              </button>
            </div>
          </div>
        </section>

        <section className="available-flights">
          <div className="flights-header-bar">
            <h2>Рейси які доступні</h2>

            <div className="sort-control">
              <label htmlFor="sort">Сортування:</label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'price' | 'date' | 'destination')}
              >
                <option value="price">За ціною</option>
                <option value="date">За часом вильоту</option>
                <option value="destination">За пунктом призначення</option>
              </select>
            </div>
          </div>

          {sortedFlights.length === 0 ? (
            <p className="no-flights">На жаль, рейсів за вашими критеріями не знайдено</p>
          ) : (
            <>
              <div className="flights-grid-view">
                {currentFlights.map((flight) => (
                  <div key={flight.id} className="flight-card-big">
                    <div className="card-header">
                      <span className="airline">SkyLink • {flight.flight_number}</span>
                      <span className="available-badge">
                        {flight.seat_class || 'Доступний'}
                      </span>
                    </div>
                    <div className="flight-images">
                  <div className="flight-image flight-image-from">
                  <img src={flight.from_image || ''} alt={flight.departure_airport} />
                  <span>{flight.departure_airport}</span>
                  </div>

                    <div className="flight-image flight-image-to">
                  <img src={flight.to_image || ''} alt={flight.arrival_airport} />
                  <span>{flight.arrival_airport}</span>
                  </div>

                    <div className="diagonal-line"></div>
                  </div>

                    <div className="card-content">
                      <div className="flight-info">
                        <div className="time-block">
                          <div className="time">{formatTime(flight.departure_time)}</div>
                          <div className="city">{flight.departure_airport}</div>
                        </div>

                        <div className="flight-path">
                          <div className="duration">{flight.duration}</div>
                          <div className="plane-icon">✈</div>
                        </div>

                        <div className="time-block text-right">
                          <div className="time">{formatTime(flight.arrival_time)}</div>
                          <div className="city">{flight.arrival_airport}</div>
                        </div>
                      </div>
                    </div>

                    <div className="card-footer-big">
                      <div className="price-section">
                        <span className="price-label">Від</span>
                        <span className="price">
                          {flight.price.toLocaleString('uk-UA')} грн
                        </span>
                      </div>

                      <button
                        className="btn-book"
                        onClick={() => navigate(`/booking/${flight.id}`)}
                      >
                        Обрати рейс
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pagination">
                <button
                  className="pg-btn"
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                >
                  Попередня
                </button>

                <span className="pg-info">
                  Сторінка {currentPage} з {totalPages}
                </span>

                <button
                  className="pg-btn active"
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                >
                  Наступна
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default MainFlights;