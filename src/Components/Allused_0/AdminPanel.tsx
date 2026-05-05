import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../utils/supabase';
import './AdminPanel.css';

type AdminTab = 'flights' | 'tickets' | 'users';
type UserRole = 'client' | 'admin' | 'cashier' | 'support';

interface Flight {
  id: number;
  flight_number: string;
  departure_airport: string;
  arrival_airport: string;
  departure_time: string;
  arrival_time: string;
  price: number;
  duration: string | null;
  from_image: string | null;
  to_image: string | null;
  seat_class: string | null;
  economy_seats_count: number;
  business_seats_count: number;
  first_class_seats_count: number;
}

interface TicketOrder {
  id: number;
  flight_id: number;
  seat_id: number;
  seat_number: string;
  seat_class: string;
  passenger_first_name: string;
  passenger_last_name: string;
  passenger_middle_name: string | null;
  passport: string | null;
  phone: string | null;
  email: string | null;
  payment_type: string | null;
  bonus_used: number | null;
  final_price: number;
  status: string;
  created_at: string;
  flight?: Flight | null;
}

interface Client {
  id: number;
  full_name: string;
  email: string;
  phone_number: string | null;
  bonus_points: number;
  created_at: string;
  role?: UserRole;
  auth_id?: string | null;
}

interface Profile {
  id: number;
  auth_id: string;
  email: string;
  role: UserRole;
}

interface FlightForm {
  flight_number: string;
  departure_airport: string;
  arrival_airport: string;
  departure_time: string;
  arrival_time: string;
  price: string;
  duration: string;
  from_image: string;
  to_image: string;
  seat_class: string;
  economy_seats_count: string;
  business_seats_count: string;
  first_class_seats_count: string;
}

const emptyFlightForm: FlightForm = {
  flight_number: '',
  departure_airport: '',
  arrival_airport: '',
  departure_time: '',
  arrival_time: '',
  price: '',
  duration: '',
  from_image: '',
  to_image: '',
  seat_class: 'Economy',
  economy_seats_count: '120',
  business_seats_count: '16',
  first_class_seats_count: '8',
};

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('flights');

  const [flights, setFlights] = useState<Flight[]>([]);
  const [tickets, setTickets] = useState<TicketOrder[]>([]);
  const [clients, setClients] = useState<Client[]>([]);

  const [flightForm, setFlightForm] = useState<FlightForm>(emptyFlightForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [flightSearch, setFlightSearch] = useState('');
  const [ticketSearch, setTicketSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');

  useEffect(() => {
    loadAllData();
  }, []);

  const showMessage = (text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(''), 3500);
  };

  const loadAllData = async () => {
    setLoading(true);
    await Promise.all([loadFlights(), loadTickets(), loadUsers()]);
    setLoading(false);
  };

  const loadFlights = async () => {
    const { data, error } = await supabase
      .from('flights')
      .select('*')
      .order('departure_time', { ascending: true });

    if (error) {
      console.error('Flights load error:', error.message);
      showMessage('Не вдалося завантажити рейси');
      return;
    }

    setFlights(data || []);
  };

  const loadTickets = async () => {
    const { data: ticketData, error: ticketError } = await supabase
      .from('ticket_orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (ticketError) {
      console.error('Tickets load error:', ticketError.message);
      showMessage('Не вдалося завантажити квитки');
      return;
    }

    const { data: flightData, error: flightError } = await supabase
      .from('flights')
      .select('*');

    if (flightError) {
      console.error('Ticket flights load error:', flightError.message);
      setTickets(ticketData || []);
      return;
    }

    const flightMap = new Map<number, Flight>();
    (flightData || []).forEach((flight) => {
      flightMap.set(flight.id, flight);
    });

    const mappedTickets = (ticketData || []).map((ticket) => ({
      ...ticket,
      flight: flightMap.get(ticket.flight_id) || null,
    }));

    setTickets(mappedTickets);
  };

  const loadUsers = async () => {
    const { data: clientData, error: clientError } = await supabase
      .from('clients')
      .select('id, full_name, email, phone_number, bonus_points, created_at')
      .order('created_at', { ascending: false });

    if (clientError) {
      console.error('Clients load error:', clientError.message);
      showMessage('Не вдалося завантажити клієнтів');
      return;
    }

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id, auth_id, email, role');

    if (profileError) {
      console.error('Profiles load error:', profileError.message);
      setClients(clientData || []);
      return;
    }

    const profileMap = new Map<string, Profile>();
    (profileData || []).forEach((profile) => {
      profileMap.set(profile.email, profile);
    });

    const mergedUsers = (clientData || []).map((client) => {
      const profile = profileMap.get(client.email);

      return {
        ...client,
        role: profile?.role || 'client',
        auth_id: profile?.auth_id || null,
      };
    });

    setClients(mergedUsers);
  };

  const generateSeats = (
    flightId: number,
    economyCount: number,
    businessCount: number,
    firstCount: number
  ) => {
    const seats = [];

    for (let i = 1; i <= firstCount; i += 1) {
      seats.push({
        flight_id: flightId,
        seat_number: `F${i}`,
        seat_class: 'First',
        is_occupied: false,
      });
    }

    for (let i = 1; i <= businessCount; i += 1) {
      seats.push({
        flight_id: flightId,
        seat_number: `B${i}`,
        seat_class: 'Business',
        is_occupied: false,
      });
    }

    for (let i = 1; i <= economyCount; i += 1) {
      seats.push({
        flight_id: flightId,
        seat_number: `E${i}`,
        seat_class: 'Economy',
        is_occupied: false,
      });
    }

    return seats;
  };

  const addFlight = async (event: React.FormEvent) => {
    event.preventDefault();

    if (
      !flightForm.flight_number ||
      !flightForm.departure_airport ||
      !flightForm.arrival_airport ||
      !flightForm.departure_time ||
      !flightForm.arrival_time ||
      !flightForm.price
    ) {
      showMessage('Заповни основні поля рейсу');
      return;
    }

    const economyCount = Number(flightForm.economy_seats_count) || 0;
    const businessCount = Number(flightForm.business_seats_count) || 0;
    const firstCount = Number(flightForm.first_class_seats_count) || 0;

    if (economyCount + businessCount + firstCount <= 0) {
      showMessage('Кількість місць має бути більше 0');
      return;
    }

    setLoading(true);

    const { data: createdFlight, error: flightError } = await supabase
      .from('flights')
      .insert({
        flight_number: flightForm.flight_number.trim(),
        departure_airport: flightForm.departure_airport.trim().toUpperCase(),
        arrival_airport: flightForm.arrival_airport.trim().toUpperCase(),
        departure_time: new Date(flightForm.departure_time).toISOString(),
        arrival_time: new Date(flightForm.arrival_time).toISOString(),
        price: Number(flightForm.price),
        duration: flightForm.duration.trim() || null,
        from_image: flightForm.from_image.trim() || null,
        to_image: flightForm.to_image.trim() || null,
        seat_class: flightForm.seat_class,
        economy_seats_count: economyCount,
        business_seats_count: businessCount,
        first_class_seats_count: firstCount,
      })
      .select()
      .single();

    if (flightError || !createdFlight) {
      console.error('Add flight error:', flightError?.message);
      showMessage('Не вдалося додати рейс');
      setLoading(false);
      return;
    }

    const seats = generateSeats(createdFlight.id, economyCount, businessCount, firstCount);

    const { error: seatsError } = await supabase.from('flight_seats').insert(seats);

    if (seatsError) {
      console.error('Create seats error:', seatsError.message);
      showMessage('Рейс створено, але місця не додались');
    } else {
      showMessage('Рейс і місця успішно створені');
    }

    setFlightForm(emptyFlightForm);
    await loadFlights();
    setLoading(false);
  };

  const deleteFlight = async (flight: Flight) => {
    const confirmDelete = window.confirm(
      `Видалити рейс ${flight.flight_number}? Також будуть видалені квитки цього рейсу.`
    );

    if (!confirmDelete) return;

    setLoading(true);

    const { data: relatedTickets } = await supabase
      .from('ticket_orders')
      .select('id')
      .eq('flight_id', flight.id);

    const ticketIds = (relatedTickets || []).map((ticket) => ticket.id);

    if (ticketIds.length > 0) {
      const { error: ticketsError } = await supabase
        .from('ticket_orders')
        .delete()
        .in('id', ticketIds);

      if (ticketsError) {
        console.error('Delete flight tickets error:', ticketsError.message);
        showMessage('Не вдалося видалити квитки рейсу');
        setLoading(false);
        return;
      }
    }

    const { error: seatsError } = await supabase
      .from('flight_seats')
      .delete()
      .eq('flight_id', flight.id);

    if (seatsError) {
      console.error('Delete flight seats error:', seatsError.message);
      showMessage('Не вдалося видалити місця рейсу');
      setLoading(false);
      return;
    }

    const { error: flightError } = await supabase
      .from('flights')
      .delete()
      .eq('id', flight.id);

    if (flightError) {
      console.error('Delete flight error:', flightError.message);
      showMessage('Не вдалося видалити рейс');
      setLoading(false);
      return;
    }

    await loadAllData();
    showMessage('Рейс видалено');
    setLoading(false);
  };

  const cancelTicket = async (ticket: TicketOrder) => {
    const confirmCancel = window.confirm(
      `Скасувати квиток №${ticket.id} для ${ticket.passenger_first_name} ${ticket.passenger_last_name}?`
    );

    if (!confirmCancel) return;

    setLoading(true);

    const { error: deleteError } = await supabase
      .from('ticket_orders')
      .delete()
      .eq('id', ticket.id);

    if (deleteError) {
      console.error('Cancel ticket error:', deleteError.message);
      showMessage('Не вдалося скасувати квиток');
      setLoading(false);
      return;
    }

    const { error: seatError } = await supabase
      .from('flight_seats')
      .update({ is_occupied: false })
      .eq('id', ticket.seat_id);

    if (seatError) {
      console.error('Free seat error:', seatError.message);
      showMessage('Квиток скасовано, але місце не звільнилось');
    } else {
      showMessage('Квиток скасовано, місце звільнено');
    }

    await loadTickets();
    setLoading(false);
  };

  const updateUserRole = async (client: Client, role: UserRole) => {
    if (!client.auth_id) {
      showMessage('У цього користувача немає auth_id у profiles');
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('auth_id', client.auth_id);

    if (error) {
      console.error('Update role error:', error.message);
      showMessage('Не вдалося змінити роль');
      return;
    }

    showMessage('Роль оновлено');
    await loadUsers();
  };

  const updateBonusPoints = async (client: Client, amount: number) => {
    const nextBonus = Math.max(0, Number(client.bonus_points || 0) + amount);

    const { error } = await supabase
      .from('clients')
      .update({ bonus_points: nextBonus })
      .eq('id', client.id);

    if (error) {
      console.error('Update bonus error:', error.message);
      showMessage('Не вдалося оновити бонуси');
      return;
    }

    showMessage('Бонуси оновлено');
    await loadUsers();
  };

  const filteredFlights = useMemo(() => {
    const query = flightSearch.toLowerCase().trim();

    return flights.filter((flight) =>
      `${flight.flight_number} ${flight.departure_airport} ${flight.arrival_airport}`
        .toLowerCase()
        .includes(query)
    );
  }, [flights, flightSearch]);

  const filteredTickets = useMemo(() => {
    const query = ticketSearch.toLowerCase().trim();

    return tickets.filter((ticket) =>
      `${ticket.id} ${ticket.email || ''} ${ticket.passenger_first_name} ${ticket.passenger_last_name} ${ticket.seat_number}`
        .toLowerCase()
        .includes(query)
    );
  }, [tickets, ticketSearch]);

  const filteredUsers = useMemo(() => {
    const query = userSearch.toLowerCase().trim();

    return clients.filter((client) =>
      `${client.full_name} ${client.email} ${client.role || ''}`
        .toLowerCase()
        .includes(query)
    );
  }, [clients, userSearch]);

  const formatDate = (value: string) => {
    return new Date(value).toLocaleString('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <main className="admin-page">
      <section className="admin-hero">
        <div>
          <p className="admin-eyebrow">SkyLink Control Center</p>
          <h1>Адмін панель</h1>
          <p>Керування рейсами, квитками, користувачами, ролями та бонусами.</p>
        </div>

        <button className="admin-refresh-btn" type="button" onClick={loadAllData}>
          Оновити дані
        </button>
      </section>

      {message && <div className="admin-message">{message}</div>}
      {loading && <div className="admin-loading">Завантаження...</div>}

      <section className="admin-panel">
        <div className="admin-tabs">
          <button
            className={activeTab === 'flights' ? 'admin-tab active' : 'admin-tab'}
            onClick={() => setActiveTab('flights')}
            type="button"
          >
            Рейси
          </button>

          <button
            className={activeTab === 'tickets' ? 'admin-tab active' : 'admin-tab'}
            onClick={() => setActiveTab('tickets')}
            type="button"
          >
            Квитки
          </button>

          <button
            className={activeTab === 'users' ? 'admin-tab active' : 'admin-tab'}
            onClick={() => setActiveTab('users')}
            type="button"
          >
            Користувачі
          </button>
        </div>

        {activeTab === 'flights' && (
          <div className="admin-grid">
            <form className="admin-card admin-form" onSubmit={addFlight}>
              <h2>Додати рейс</h2>

              <div className="admin-form-grid">
                <label>
                  Номер рейсу
                  <input
                    value={flightForm.flight_number}
                    onChange={(e) =>
                      setFlightForm({ ...flightForm, flight_number: e.target.value })
                    }
                    placeholder="SL-101"
                  />
                </label>

                <label>
                  Звідки
                  <input
                    value={flightForm.departure_airport}
                    onChange={(e) =>
                      setFlightForm({ ...flightForm, departure_airport: e.target.value })
                    }
                    placeholder="LWO"
                  />
                </label>

                <label>
                  Куди
                  <input
                    value={flightForm.arrival_airport}
                    onChange={(e) =>
                      setFlightForm({ ...flightForm, arrival_airport: e.target.value })
                    }
                    placeholder="WAW"
                  />
                </label>

                <label>
                  Ціна
                  <input
                    type="number"
                    value={flightForm.price}
                    onChange={(e) =>
                      setFlightForm({ ...flightForm, price: e.target.value })
                    }
                    placeholder="2500"
                  />
                </label>

                <label>
                  Виліт
                  <input
                    type="datetime-local"
                    value={flightForm.departure_time}
                    onChange={(e) =>
                      setFlightForm({ ...flightForm, departure_time: e.target.value })
                    }
                  />
                </label>

                <label>
                  Приліт
                  <input
                    type="datetime-local"
                    value={flightForm.arrival_time}
                    onChange={(e) =>
                      setFlightForm({ ...flightForm, arrival_time: e.target.value })
                    }
                  />
                </label>

                <label>
                  Тривалість
                  <input
                    value={flightForm.duration}
                    onChange={(e) =>
                      setFlightForm({ ...flightForm, duration: e.target.value })
                    }
                    placeholder="1h 40m"
                  />
                </label>

                <label>
                  Базовий клас
                  <select
                    value={flightForm.seat_class}
                    onChange={(e) =>
                      setFlightForm({ ...flightForm, seat_class: e.target.value })
                    }
                  >
                    <option value="Economy">Economy</option>
                    <option value="Business">Business</option>
                    <option value="First">First</option>
                  </select>
                </label>

                <label>
                  Economy місця
                  <input
                    type="number"
                    value={flightForm.economy_seats_count}
                    onChange={(e) =>
                      setFlightForm({
                        ...flightForm,
                        economy_seats_count: e.target.value,
                      })
                    }
                  />
                </label>

                <label>
                  Business місця
                  <input
                    type="number"
                    value={flightForm.business_seats_count}
                    onChange={(e) =>
                      setFlightForm({
                        ...flightForm,
                        business_seats_count: e.target.value,
                      })
                    }
                  />
                </label>

                <label>
                  First місця
                  <input
                    type="number"
                    value={flightForm.first_class_seats_count}
                    onChange={(e) =>
                      setFlightForm({
                        ...flightForm,
                        first_class_seats_count: e.target.value,
                      })
                    }
                  />
                </label>

                <label>
                  Фото міста відправлення
                  <input
                    value={flightForm.from_image}
                    onChange={(e) =>
                      setFlightForm({ ...flightForm, from_image: e.target.value })
                    }
                    placeholder="https://..."
                  />
                </label>

                <label>
                  Фото міста прибуття
                  <input
                    value={flightForm.to_image}
                    onChange={(e) =>
                      setFlightForm({ ...flightForm, to_image: e.target.value })
                    }
                    placeholder="https://..."
                  />
                </label>
              </div>

              <button className="admin-primary-btn" type="submit" disabled={loading}>
                Додати рейс
              </button>
            </form>

            <div className="admin-card">
              <div className="admin-card-head">
                <h2>Список рейсів</h2>
                <input
                  className="admin-search"
                  value={flightSearch}
                  onChange={(e) => setFlightSearch(e.target.value)}
                  placeholder="Пошук рейсу..."
                />
              </div>

              <div className="admin-list">
                {filteredFlights.map((flight) => (
                  <div className="admin-list-item" key={flight.id}>
                    <div>
                      <strong>{flight.flight_number}</strong>
                      <p>
                        {flight.departure_airport} → {flight.arrival_airport}
                      </p>
                      <span>
                        {formatDate(flight.departure_time)} • {flight.price} ₴
                      </span>
                    </div>

                    <button
                      className="admin-danger-btn"
                      type="button"
                      onClick={() => deleteFlight(flight)}
                    >
                      Видалити
                    </button>
                  </div>
                ))}

                {filteredFlights.length === 0 && (
                  <p className="admin-empty">Рейсів не знайдено</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tickets' && (
          <div className="admin-card">
            <div className="admin-card-head">
              <h2>Квитки</h2>
              <input
                className="admin-search"
                value={ticketSearch}
                onChange={(e) => setTicketSearch(e.target.value)}
                placeholder="Пошук квитка..."
              />
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Пасажир</th>
                    <th>Рейс</th>
                    <th>Місце</th>
                    <th>Email</th>
                    <th>Ціна</th>
                    <th>Статус</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTickets.map((ticket) => (
                    <tr key={ticket.id}>
                      <td>#{ticket.id}</td>
                      <td>
                        {ticket.passenger_last_name} {ticket.passenger_first_name}
                      </td>
                      <td>
                        {ticket.flight
                          ? `${ticket.flight.departure_airport} → ${ticket.flight.arrival_airport}`
                          : `flight_id ${ticket.flight_id}`}
                      </td>
                      <td>
                        {ticket.seat_number} / {ticket.seat_class}
                      </td>
                      <td>{ticket.email || '—'}</td>
                      <td>{ticket.final_price} ₴</td>
                      <td>{ticket.status}</td>
                      <td>
                        <button
                          className="admin-danger-btn"
                          type="button"
                          onClick={() => cancelTicket(ticket)}
                        >
                          Скасувати
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredTickets.length === 0 && (
                <p className="admin-empty">Квитків не знайдено</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="admin-card">
            <div className="admin-card-head">
              <h2>Користувачі</h2>
              <input
                className="admin-search"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Пошук користувача..."
              />
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Імʼя</th>
                    <th>Email</th>
                    <th>Телефон</th>
                    <th>Бонуси</th>
                    <th>Роль</th>
                    <th>Дії</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((client) => (
                    <tr key={client.id}>
                      <td>{client.full_name}</td>
                      <td>{client.email}</td>
                      <td>{client.phone_number || '—'}</td>
                      <td>{client.bonus_points}</td>
                      <td>
                        <select
                          value={client.role || 'client'}
                          onChange={(e) =>
                            updateUserRole(client, e.target.value as UserRole)
                          }
                          disabled={!client.auth_id}
                        >
                          <option value="client">client</option>
                          <option value="admin">admin</option>
                          <option value="cashier">cashier</option>
                          <option value="support">support</option>
                        </select>
                      </td>
                      <td className="admin-actions">
                        <button
                          className="admin-small-btn"
                          type="button"
                          onClick={() => updateBonusPoints(client, 100)}
                        >
                          +100
                        </button>

                        <button
                          className="admin-small-btn"
                          type="button"
                          onClick={() => updateBonusPoints(client, -100)}
                        >
                          -100
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredUsers.length === 0 && (
                <p className="admin-empty">Користувачів не знайдено</p>
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default AdminPanel;