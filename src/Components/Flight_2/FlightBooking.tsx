import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../utils/supabase';
import PlaneSeatMap from './PlaneSeatMap';
import './PlaneSeatMap.css';
import './FlightBooking.css';

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

interface ClientProfile {
  full_name: string;
  email: string;
  phone_number: string | null;
  bonus_points: number;
}

interface Seat {
  id: number;
  seat_number: string;
  seat_class: string;
  is_occupied: boolean;
}

type Step = 0 | 1 | 2 | 3;
type PaymentType = 'card' | 'cash';

const normalizeClass = (value?: string | null) => {
  if (!value) return 'Economy';

  return value.toLowerCase() === 'business' ? 'Business' : 'Economy';
};

const FlightBooking: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [flight, setFlight] = useState<Flight | null>(null);
  const [client, setClient] = useState<ClientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  const [step, setStep] = useState<Step>(0);
  const [paymentType, setPaymentType] = useState<PaymentType>('card');
  const [bonusToUse, setBonusToUse] = useState(0);
  const [remind, setRemind] = useState(true);

  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [saving, setSaving] = useState(false);

  const [passenger, setPassenger] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    edrpou: '',
    passport: '',
    passportDate: '',
    phone: '',
    email: ''
  });

  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardDate: '',
    cvv: '',
    cardHolder: ''
  });

  useEffect(() => {
    loadPage();
  }, [id]);

  const loadPage = async () => {
    try {
      setLoading(true);

      const {
        data: { session }
      } = await supabase.auth.getSession();

      if (!session?.user?.email) {
        setAllowed(false);
        return;
      }

      setAllowed(true);

      const { data: flightData, error: flightError } = await supabase
        .from('flights')
        .select('*')
        .eq('id', Number(id))
        .single();

      if (flightError) throw flightError;

      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('full_name, email, phone_number, bonus_points')
        .eq('email', session.user.email)
        .single();

      if (clientError) throw clientError;

      setFlight(flightData);
      setClient(clientData);

      const nameParts = (clientData.full_name || '').split(' ');

      setPassenger((prev) => ({
        ...prev,
        firstName: nameParts[0] || '',
        lastName: nameParts[1] || '',
        middleName: nameParts.slice(2).join(' ') || '',
        phone: clientData.phone_number || '',
        email: clientData.email || ''
      }));
    } catch (err) {
      console.error('Flight booking error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date: string) =>
    new Date(date).toLocaleTimeString('uk-UA', {
      hour: '2-digit',
      minute: '2-digit'
    });

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('uk-UA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

  const handlePassportDateChange = (value: string) => {
    let numbers = value.replace(/\D/g, '');
    if (numbers.length > 8) numbers = numbers.slice(0, 8);

    let formatted = numbers;

    if (numbers.length > 2) {
      formatted = numbers.slice(0, 2) + '.' + numbers.slice(2);
    }

    if (numbers.length > 4) {
      formatted =
        numbers.slice(0, 2) +
        '.' +
        numbers.slice(2, 4) +
        '.' +
        numbers.slice(4);
    }

    setPassenger({ ...passenger, passportDate: formatted });
  };

  const handleManualSeatChange = (value: string) => {
    const seatNumber = value.toUpperCase().replace(/\s/g, '');
    const allowedClass = normalizeClass(flight?.seat_class);

    setSelectedSeat((prev) =>
      prev
        ? { ...prev, seat_number: seatNumber, seat_class: allowedClass }
        : {
            id: 0,
            seat_number: seatNumber,
            seat_class: allowedClass,
            is_occupied: false
          }
    );
  };

  const handleBonusChange = (value: string) => {
    const numberValue = Number(value);
    const maxBonus = client?.bonus_points || 0;

    if (numberValue < 0) {
      setBonusToUse(0);
      return;
    }

    if (numberValue > maxBonus) {
      setBonusToUse(maxBonus);
      return;
    }

    setBonusToUse(numberValue);
  };

  const handleGoToPayment = () => {
    if (!selectedSeat?.seat_number) {
      alert('Оберіть місце');
      return;
    }

    setStep(2);
  };

  const handleConfirmBooking = async () => {
    if (!flight) return;

    if (!selectedSeat?.seat_number) {
      alert('Оберіть місце');
      return;
    }

    try {
      setSaving(true);

      const allowedClass = normalizeClass(flight.seat_class);
      const seatNumber = selectedSeat.seat_number.toUpperCase().replace(/\s/g, '');

      const { data: realSeats, error: seatFindError } = await supabase
        .from('flight_seats')
        .select('id, flight_id, seat_number, seat_class, is_occupied')
        .eq('flight_id', flight.id)
        .eq('seat_number', seatNumber);

      if (seatFindError) {
        console.error(seatFindError);
        alert('Помилка пошуку місця');
        return;
      }

      if (!realSeats || realSeats.length === 0) {
        alert(`Місце ${seatNumber} не знайдено саме для цього рейсу`);
        return;
      }

      const realSeat = realSeats[0];

      if (normalizeClass(realSeat.seat_class) !== allowedClass) {
        alert(`Це місце не з класу ${allowedClass}`);
        return;
      }

      if (realSeat.is_occupied === true) {
        alert(`Місце ${seatNumber} вже зайняте`);
        return;
      }

const { data: updatedSeats, error: updateError } = await supabase
  .from('flight_seats')
  .update({ is_occupied: true })
  .eq('id', realSeat.id)
  .eq('flight_id', flight.id)
  .select('id, seat_number, seat_class, is_occupied');

console.log('UPDATE RESULT:', updatedSeats);
console.log('UPDATE ERROR:', updateError);

if (updateError) {
  alert('Помилка бронювання');
  console.error(updateError);
  return;
}

if (!updatedSeats || updatedSeats.length === 0) {
  alert('Не оновилось місце (скоріше за все RLS блокує)');
  return;
}

const updatedSeat = updatedSeats[0];
      const priceToPay = Math.max(flight.price - bonusToUse, 0);

      const { error: ticketError } = await supabase.from('ticket_orders').insert({
        flight_id: flight.id,
        seat_id: updatedSeat.id,
        seat_number: updatedSeat.seat_number,
        seat_class: normalizeClass(updatedSeat.seat_class),
        passenger_first_name: passenger.firstName,
        passenger_last_name: passenger.lastName,
        passenger_middle_name: passenger.middleName,
        edrpou: passenger.edrpou,
        passport: passenger.passport,
        passport_date: passenger.passportDate,
        phone: passenger.phone,
        email: passenger.email,
        payment_type: paymentType,
        bonus_used: bonusToUse,
        final_price: priceToPay,
        status: paymentType === 'cash' ? 'waiting_cash_payment' : 'paid'
      });

      if (ticketError) {
        await supabase
          .from('flight_seats')
          .update({ is_occupied: false })
          .eq('id', updatedSeat.id)
          .eq('flight_id', flight.id);

        console.error(ticketError);
        alert('Місце було звільнено, бо квиток не зберігся');
        return;
      }

      setSelectedSeat({
        id: updatedSeat.id,
        seat_number: updatedSeat.seat_number,
        seat_class: normalizeClass(updatedSeat.seat_class),
        is_occupied: true
      });

      setStep(3);
    } catch (err) {
      console.error('Booking save error:', err);
      alert('Помилка при оформленні квитка');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="booking-page">Завантаження...</div>;
  }

  if (!allowed) {
    return (
      <div className="booking-page">
        <div className="auth-block">
          <h1>Потрібна авторизація</h1>
          <p>Щоб купити квиток, потрібно увійти в акаунт.</p>
          <button onClick={() => navigate('/')}>Повернутися на головну</button>
        </div>
      </div>
    );
  }

  if (!flight) {
    return <div className="booking-page">Рейс не знайдено</div>;
  }

  const finalPrice = Math.max(flight.price - bonusToUse, 0);
  const allowedClass = normalizeClass(flight.seat_class);
  return (
    <div className="booking-page">
      <div className="booking-container">
        <section className="booking-hero">
          <div className="booking-city" style={{ backgroundImage: `url(${flight.from_image})` }}>
            <span>{flight.departure_airport}</span>
          </div>

          <div className="booking-city" style={{ backgroundImage: `url(${flight.to_image})` }}>
            <span>{flight.arrival_airport}</span>
          </div>

          <div className="booking-divider"></div>
        </section>

        <section className="flight-details-card">
          <div className="details-top">
            <div>
              <span className="small-label">Рейс</span>
              <h1>SkyLink • {flight.flight_number}</h1>
            </div>

            <span className="class-badge">{allowedClass}</span>
          </div>

          <div className="route-row">
            <div className="route-point">
              <strong>{formatTime(flight.departure_time)}</strong>
              <span>{flight.departure_airport}</span>
              <small>{formatDate(flight.departure_time)}</small>
            </div>

            <div className="route-line">
              <span>{flight.duration}</span>
              <div>✈</div>
            </div>

            <div className="route-point right">
              <strong>{formatTime(flight.arrival_time)}</strong>
              <span>{flight.arrival_airport}</span>
              <small>{formatDate(flight.arrival_time)}</small>
            </div>
          </div>

          <div className="booking-price">
            <div>
              <span>Вартість квитка</span>
              <strong>{flight.price.toLocaleString('uk-UA')} грн</strong>
            </div>

            <button className="btn-buy-ticket" onClick={() => setStep(1)}>
              Купити квиток
            </button>
          </div>
        </section>

        {step > 0 && (
          <section className="checkout-box">
<div className="steps">
  <button
    type="button"
    className={step === 1 ? 'active' : ''}
    onClick={() => setStep(1)}
  >
    1. Дані пасажира
  </button>

  <button
    type="button"
    className={step === 2 ? 'active' : ''}
    disabled={!selectedSeat?.seat_number}
    onClick={() => setStep(2)}
  >
    2. Оплата
  </button>

  <button
    type="button"
    className={step === 3 ? 'active' : ''}
    disabled={step !== 3}
    onClick={() => setStep(3)}
  >
    3. Квиток
  </button>
</div>

            {step === 1 && (
              <div className="checkout-step">
                <h2>Дані пасажира</h2>
                <p className="step-description">
                  Заповніть інформацію для оформлення квитка.
                </p>

                <div className="form-grid">
                  <input placeholder="Ім'я" value={passenger.firstName} onChange={(e) => setPassenger({ ...passenger, firstName: e.target.value })} />
                  <input placeholder="Прізвище" value={passenger.lastName} onChange={(e) => setPassenger({ ...passenger, lastName: e.target.value })} />
                  <input placeholder="По батькові" value={passenger.middleName} onChange={(e) => setPassenger({ ...passenger, middleName: e.target.value })} />
                  <input placeholder="Номер ЄДРПОУ" value={passenger.edrpou} onChange={(e) => setPassenger({ ...passenger, edrpou: e.target.value })} />
                  <input placeholder="Паспорт" value={passenger.passport} onChange={(e) => setPassenger({ ...passenger, passport: e.target.value })} />

                  <input
                    placeholder="Дата виготовлення паспорту: 12.12.2026"
                    value={passenger.passportDate}
                    maxLength={10}
                    onChange={(e) => handlePassportDateChange(e.target.value)}
                  />

                  <input placeholder="Телефон" value={passenger.phone} onChange={(e) => setPassenger({ ...passenger, phone: e.target.value })} />
                  <input placeholder="Email" value={passenger.email} onChange={(e) => setPassenger({ ...passenger, email: e.target.value })} />
                </div>

                <div className="seat-select-box">
                  <h3>Вибір місця в літаку</h3>

                  <PlaneSeatMap
                    flightId={flight.id}
                    allowedClass={allowedClass}
                    selectedSeatId={selectedSeat?.id || null}
                    onSelectSeat={(seat) => setSelectedSeat(seat)}
                  />

                  <input
                    placeholder="Місце, наприклад E28"
                    value={selectedSeat?.seat_number || ''}
                    onChange={(e) => handleManualSeatChange(e.target.value)}
                  />
                </div>

                <button
                  className="btn-next"
                  disabled={!selectedSeat?.seat_number}
                  onClick={handleGoToPayment}
                >
                  Перейти до оплати
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="checkout-step">
                <h2>Оплата</h2>
                <p className="step-description">
                  Оберіть спосіб оплати. Дані карти тестові, тому поля можна залишити пустими.
                </p>

                <div className="payment-options">
                  <button
                    className={paymentType === 'card' ? 'active' : ''}
                    onClick={() => setPaymentType('card')}
                  >
                    Карта
                  </button>

                  <button
                    className={paymentType === 'cash' ? 'active' : ''}
                    onClick={() => setPaymentType('cash')}
                  >
                    Готівка
                  </button>
                </div>

                <div className="bonus-box">
                  <div>
                    <strong>Бонуси</strong>
                    <p>Доступно: {client?.bonus_points || 0} бонусів</p>
                  </div>

                  <input
                    type="number"
                    min="0"
                    max={client?.bonus_points || 0}
                    value={bonusToUse}
                    onChange={(e) => handleBonusChange(e.target.value)}
                    placeholder="Скільки списати"
                  />
                </div>

                {paymentType === 'card' ? (
                  <div className="form-grid">
                    <input placeholder="Номер карти" value={cardData.cardNumber} onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })} />
                    <input placeholder="MM/YY" value={cardData.cardDate} onChange={(e) => setCardData({ ...cardData, cardDate: e.target.value })} />
                    <input placeholder="CVV" value={cardData.cvv} onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })} />
                    <input placeholder="Ім'я власника" value={cardData.cardHolder} onChange={(e) => setCardData({ ...cardData, cardHolder: e.target.value })} />
                  </div>
                ) : (
                  <div className="cash-info">
                    При виборі оплати готівкою ви бронюєте квиток і місце, а оплату здійснюєте на касі при прибутті.
                  </div>
                )}

                <div className="payment-summary">
                  <span>Ціна квитка: {flight.price.toLocaleString('uk-UA')} грн</span>
                  <span>Списано бонусів: {bonusToUse}</span>
                  <strong>До оплати: {finalPrice.toLocaleString('uk-UA')} грн</strong>
                </div>

                <button
                  className="btn-next"
                  disabled={saving || !selectedSeat?.seat_number}
                  onClick={handleConfirmBooking}
                >
                  {saving ? 'Зберігаємо...' : 'Підтвердити оформлення'}
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="checkout-step ticket-final">
                <div className="success-icon">✓</div>
                <h2>Квиток оформлено</h2>
                <p className="step-description">
                  Ваш квиток успішно створено. Нижче основна інформація про поїздку.
                </p>

                <div className="final-ticket-card">
                  <div className="ticket-top">
                    <div>
                      <span>SkyLink</span>
                      <h3>{flight.flight_number}</h3>
                    </div>

                    <div className="ticket-status">
                      {paymentType === 'cash' ? 'Очікує оплати' : 'Оплачено'}
                    </div>
                  </div>

                  <div className="ticket-route">
                    <div>
                      <strong>{flight.departure_airport}</strong>
                      <span>{formatTime(flight.departure_time)}</span>
                    </div>

                    <div className="ticket-plane">✈</div>

                    <div>
                      <strong>{flight.arrival_airport}</strong>
                      <span>{formatTime(flight.arrival_time)}</span>
                    </div>
                  </div>

                  <div className="ticket-info-grid">
                    <p><strong>Дата:</strong> {formatDate(flight.departure_time)}</p>
                    <p><strong>Пасажир:</strong> {passenger.lastName} {passenger.firstName} {passenger.middleName}</p>
                    <p><strong>Клас:</strong> {allowedClass}</p>
                    <p><strong>Місце:</strong> {selectedSeat?.seat_number}</p>
                    <p><strong>Оплата:</strong> {paymentType === 'cash' ? 'Готівка' : 'Карта'}</p>
                    <p><strong>Бонуси:</strong> {bonusToUse}</p>
                    <p><strong>Сума:</strong> {finalPrice.toLocaleString('uk-UA')} грн</p>
                  </div>
                </div>

                <label className="reminder-check">
                  <input checked={remind} onChange={(e) => setRemind(e.target.checked)} type="checkbox" />
                  Нагадати за 24 години до квитка
                </label>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default FlightBooking;