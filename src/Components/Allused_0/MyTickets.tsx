import React, { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase';
import './MyTickets.css';

interface Flight {
  id: number;
  flight_number: string;
  departure_airport: string;
  arrival_airport: string;
  departure_time: string;
  arrival_time: string;
}

interface TicketOrder {
  id: number;
  flight_id: number;
  seat_number: string;
  seat_class: string;
  passenger_first_name: string;
  passenger_last_name: string;
  passenger_middle_name?: string;
  email: string;
  phone?: string;
  payment_type?: string;
  final_price: number;
  status: string;
  created_at: string;
  flights?: Flight | null;
}

const MyTickets: React.FC = () => {
  const [tickets, setTickets] = useState<TicketOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      setErrorMessage('');

      const { data: authData, error: authError } = await supabase.auth.getUser();

      if (authError) {
        console.error('Auth error:', authError);
        setErrorMessage('Не вдалося перевірити акаунт.');
        setLoading(false);
        return;
      }

      const email = authData.user?.email?.trim().toLowerCase() || null;
      setUserEmail(email);

      if (!email) {
        setLoading(false);
        return;
      }

      const { data: orders, error: ordersError } = await supabase
        .from('ticket_orders')
        .select('*')
        .ilike('email', email)
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error('Tickets error:', ordersError);
        setErrorMessage('Не вдалося завантажити квитки.');
        setTickets([]);
        setLoading(false);
        return;
      }

      const flightIds = [
        ...new Set((orders || []).map((order) => order.flight_id).filter(Boolean))
      ];

      let flights: Flight[] = [];

      if (flightIds.length > 0) {
        const { data: flightsData, error: flightsError } = await supabase
          .from('flights')
          .select(
            'id, flight_number, departure_airport, arrival_airport, departure_time, arrival_time'
          )
          .in('id', flightIds);

        if (flightsError) {
          console.error('Flights error:', flightsError);
        } else {
          flights = flightsData || [];
        }
      }

      const ticketsWithFlights = (orders || []).map((order) => ({
        ...order,
        flights: flights.find((flight) => flight.id === order.flight_id) || null
      }));

      setTickets(ticketsWithFlights);
      setLoading(false);
    };

    fetchTickets();
  }, []);

  return (
    <main className="my-tickets-page">
      <section className="my-tickets-container">
        <div className="my-tickets-hero">
          <div>
            <span className="my-tickets-badge">Sky Link</span>
            <h1>Мої квитки</h1>
            <p>Тут зберігаються всі квитки, куплені з твого акаунта.</p>
          </div>

          <div className="my-tickets-user">
            <span>Акаунт</span>
            <strong>{userEmail || 'Не авторизовано'}</strong>
          </div>
        </div>

        {loading && (
          <div className="tickets-state">
            <h2>Завантаження...</h2>
            <p>Шукаємо твої квитки.</p>
          </div>
        )}

        {!loading && errorMessage && (
          <div className="tickets-state error">
            <h2>Помилка</h2>
            <p>{errorMessage}</p>
          </div>
        )}

        {!loading && !errorMessage && !userEmail && (
          <div className="tickets-state">
            <h2>Увійдіть в акаунт</h2>
            <p>Щоб побачити свої квитки, потрібно авторизуватись.</p>
          </div>
        )}

        {!loading && !errorMessage && userEmail && tickets.length === 0 && (
          <div className="tickets-state">
            <h2>Квитків поки немає</h2>
            <p>Після покупки вони автоматично з’являться тут.</p>
          </div>
        )}

        {!loading && !errorMessage && tickets.length > 0 && (
          <div className="tickets-list">
            {tickets.map((ticket) => (
             <article className="my-ticket-pass" key={ticket.id}>
  <div className="my-ticket-pass-header">
    <div>
      <span>SkyLink</span>
      <h2>{ticket.flights?.flight_number || '—'}</h2>
    </div>

    <span className="my-ticket-paid">
      {ticket.status === 'paid' ? 'Оплачено' : ticket.status || 'created'}
    </span>
  </div>

  <div className="my-ticket-route">
    <div>
      <h3>{ticket.flights?.departure_airport || '—'}</h3>
      <p>
        {ticket.flights?.departure_time
          ? new Date(ticket.flights.departure_time).toLocaleTimeString('uk-UA', {
              hour: '2-digit',
              minute: '2-digit'
            })
          : '—'}
      </p>
    </div>

    <div className="my-ticket-plane">✈</div>

    <div>
      <h3>{ticket.flights?.arrival_airport || '—'}</h3>
      <p>
        {ticket.flights?.arrival_time
          ? new Date(ticket.flights.arrival_time).toLocaleTimeString('uk-UA', {
              hour: '2-digit',
              minute: '2-digit'
            })
          : '—'}
      </p>
    </div>
  </div>

  <div className="my-ticket-body">
    <div className="my-ticket-info">
      <div>
        <span>Дата</span>
        <strong>
          {ticket.flights?.departure_time
            ? new Date(ticket.flights.departure_time).toLocaleDateString('uk-UA', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })
            : '—'}
        </strong>
      </div>

      <div>
        <span>Пасажир</span>
        <strong>
          {ticket.passenger_last_name || ''} {ticket.passenger_first_name || '—'}
        </strong>
      </div>

      <div>
        <span>Клас</span>
        <strong>{ticket.seat_class || '—'}</strong>
      </div>

      <div>
        <span>Місце</span>
        <strong>{ticket.seat_number || '—'}</strong>
      </div>

      <div>
        <span>Оплата</span>
        <strong>{ticket.payment_type === 'card' ? 'Карта' : ticket.payment_type || '—'}</strong>
      </div>

      <div>
        <span>Сума</span>
        <strong>{ticket.final_price || 0} грн</strong>
      </div>
    </div>

    <div className="my-ticket-qr-area">
      <div className="my-ticket-qr-placeholder">QR</div>
      <p>QR-код додамо пізніше</p>
    </div>
  </div>
</article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default MyTickets;