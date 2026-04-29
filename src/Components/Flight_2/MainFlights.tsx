import React, { useState } from 'react';
import './MainFlights.css';

// Генерація даних для залу очікування (96 крісел)
const seatingData = Array.from({ length: 96 }, (_, i) => ({
  id: i + 1,
  isOccupied: Math.random() > 0.4, // 60% шансу, що місце зайняте
}));

// Дані для рейсів (6 рейсів всього: 4 на першій сторінці + 2 на другій)
const allFlights = [
  { id: 1, airline: 'SkyLink Global', from: 'Київ (KBP)', to: 'Париж (CDG)', time: '10:00 - 12:15', price: 4200, duration: '3 год 15 хв' },
  { id: 2, airline: 'Oceanic Air', from: 'Львів (LWO)', to: 'Нью-Йорк (JFK)', time: '08:30 - 22:10', price: 16700, duration: '18 год 40 хв' },
  { id: 3, airline: 'SkyLink Global', from: 'Варшава (WAW)', to: 'Токіо (HND)', time: '15:10 - 06:50', price: 12800, duration: '14 год 20 хв' },
  { id: 4, airline: 'AeroNova', from: 'Київ (KBP)', to: 'Барселона (BCN)', time: '12:45 - 15:30', price: 5600, duration: '2 год 45 хв' },
  { id: 5, airline: 'BlueWing', from: 'Львів (LWO)', to: 'Дубай (DXB)', time: '09:15 - 18:00', price: 8900, duration: '8 год 45 хв' },
  { id: 6, airline: 'Global Air', from: 'Одеса (ODS)', to: 'Гонконг (HKG)', time: '14:30 - 07:20', price: 19500, duration: '16 год 50 хв' },
];

const MainFlights: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [departDate, setDepartDate] = useState('');
  const [maxPrice, setMaxPrice] = useState('30000');
  const [sortBy, setSortBy] = useState<'price' | 'date' | 'destination'>('price');

  // Фільтрування рейсів
  const filteredFlights = allFlights.filter(flight => {
    const matchFrom = fromCity === '' || flight.from.toLowerCase().includes(fromCity.toLowerCase());
    const matchTo = toCity === '' || flight.to.toLowerCase().includes(toCity.toLowerCase());
    const matchPrice = flight.price <= Number(maxPrice);
    return matchFrom && matchTo && matchPrice;
  });

  // Сортування
  const sortedFlights = [...filteredFlights].sort((a, b) => {
    if (sortBy === 'price') {
      return a.price - b.price;
    } else if (sortBy === 'date') {
      return a.time.localeCompare(b.time);
    } else {
      return a.to.localeCompare(b.to, 'uk');
    }
  });

  // Пагінація
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

  return (
    <div className="flights-page">
      {/* 1. Геро-банер */}
      <header className="flights-hero">
        <div className="hero-content">
          <h1>Відкривайте світ разом зі SkyLink</h1>
          <p>Міжнародні стандарти комфорту та надійності</p>
        </div>
      </header>

      <div className="flights-main-content">
        
        {/* 2. Зал очікування (Seating Chart) */}
        <section className="lounge-section">
          
          <div className="lounge-card-wrapper">
            <div className="seating-grid">
              {seatingData.map(seat => (
                <div 
                  key={seat.id} 
                  className={`seat-box ${seat.isOccupied ? 'occupied' : 'free'}`}
                >
                  <div className="tooltip">
                    {seat.isOccupied ? `Зайнято 1/1 (№${seat.id})` : `Вільно 0/1 (№${seat.id})`}
                  </div>
                  
                </div>
              ))}
            </div>
            
            
            <div className="lounge-stats">
              <div className="stat-box">
                <span className="stat-label">Всього місць</span>
                <span className="stat-value">96</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Вільні крісла</span>
                <span className="stat-value">{seatingData.filter(s => !s.isOccupied).length}</span>
              </div>
                          <div className="lounge-header">
            <h2>Зал очікування (Live)</h2>
            <p>Моніторинг вільних місць у терміналі</p></div>
              <div className="lounge-legend">
                <div className="legend-item"><span className="indicator free"></span> Вільно</div>
                <div className="legend-item"><span className="indicator occupied"></span> Зайнято</div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Фільтрація (Пошукова панель) */}
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
                <label>Ціна: до {maxPrice} грн</label>
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
              <button className="btn-search">Пошук</button>
            </div>
          </div>
        </section>

        {/* 4. Список рейсів */}
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

          {filteredFlights.length === 0 ? (
            <p className="no-flights">На жаль, рейсів за вашими критеріями не знайдено</p>
          ) : (
            <>
              <div className="flights-grid-view">
                {currentFlights.map(flight => (
                  <div key={flight.id} className="flight-card-big">
                    <div className="card-header">
                      <span className="airline">{flight.airline}</span>
                      <span className="available-badge">Доступний</span>
                    </div>
                    
                    <div className="card-content">
                      <div className="flight-info">
                        <div className="time-block">
                          <div className="time">{flight.time.split(' - ')[0]}</div>
                          <div className="city">{flight.from}</div>
                        </div>
                        <div className="flight-path">
                          <div className="duration">{flight.duration}</div>
                          <div className="plane-icon">✈</div>
                        </div>
                        <div className="time-block text-right">
                          <div className="time">{flight.time.split(' - ')[1]}</div>
                          <div className="city">{flight.to}</div>
                        </div>
                      </div>
                    </div>

                    <div className="card-footer-big">
                      <div className="price-section">
                        <span className="price-label">Від</span>
                        <span className="price">{flight.price.toLocaleString('uk-UA')} грн</span>
                      </div>
                      <button className="btn-book">Обрати рейс</button>
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
                <span className="pg-info">Сторінка {currentPage} з {totalPages}</span>
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
