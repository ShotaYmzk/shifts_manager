// components/availability/AvailabilityCalendar.tsx
'use client';
import { useState, useEffect } from 'react';

interface Availability {
  id: string;
  user_id: string;
  date: string;
  start_time: string;
  end_time: string;
}

export default function AvailabilityCalendar({ date }: { date: string }) {
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);

  useEffect(() => {
    if(date) {
      fetch(`/api/availability?date=${date}`)
        .then(res => res.json())
        .then(data => setAvailabilities(data));
    }
  }, [date]);

  return (
    <div>
      <h2>{date} の利用可能時間</h2>
      <ul>
        {availabilities.map((a) => (
          <li key={a.id}>
            ユーザー: {a.user_id} &nbsp; {a.start_time} - {a.end_time}
          </li>
        ))}
      </ul>
    </div>
  );
}