import React, { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase';
import './PlaneSeatMap.css';

interface Seat {
  id: number;
  seat_number: string;
  seat_class: string;
  is_occupied: boolean;
}

interface PlaneSeatMapProps {
  flightId: number;
  allowedClass: string;
  selectedSeatId: number | null;
  onSelectSeat: (seat: Seat) => void;
}

const PlaneSeatMap: React.FC<PlaneSeatMapProps> = ({
  flightId,
  allowedClass,
  selectedSeatId,
  onSelectSeat
}) => {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSeats();
  }, [flightId]);

  const fetchSeats = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('flight_seats')
      .select('id, seat_number, seat_class, is_occupied')
      .eq('flight_id', flightId)
      .order('id', { ascending: true });

    if (error) {
      console.error('Seat load error:', error.message);
    } else {
      setSeats(data || []);
    }

    setLoading(false);
  };

  const businessSeats = seats.filter((seat) => seat.seat_class === 'Business');
  const economySeats = seats.filter((seat) => seat.seat_class === 'Economy');

  const renderSeat = (seat: Seat) => {
    const isLocked = seat.seat_class !== allowedClass;
    const isSelected = selectedSeatId === seat.id;

    return (
      <button
        key={seat.id}
        className={`plane-seat ${
          seat.is_occupied
            ? 'occupied'
            : isLocked
            ? 'locked'
            : isSelected
            ? 'selected'
            : 'free'
        }`}
        disabled={seat.is_occupied || isLocked}
        onClick={() => onSelectSeat(seat)}
      >
        {seat.seat_number}
      </button>
    );
  };

  if (loading) {
    return <div className="plane-loader">Завантаження місць...</div>;
  }

  return (
    <div className="plane-wrapper">
      <div className="plane-scroll">
        <div className="aircraft">
          <div className="cockpit">
            <div>
                <h1 className="pilot-seat"></h1>
                <h1 className="pilot-seat"></h1>
            </div>
          </div>

          <div className="cabin">
            <div className="section business-section">
              <div className="section-title">Business</div>

              <div className="business-grid">
                {businessSeats.map(renderSeat)}
              </div>
            </div>

            <div className="divider"></div>

            <div className="section economy-section">

              <div className="economy-grid">
                {economySeats.map(renderSeat)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="plane-legend">
        <span><i className="legend-free"></i> Вільно</span>
        <span><i className="legend-occupied"></i> Зайнято</span>
        <span><i className="legend-locked"></i> Недоступно</span>
        <span><i className="legend-selected"></i> Обрано</span>
      </div>
    </div>
  );
};

export default PlaneSeatMap;