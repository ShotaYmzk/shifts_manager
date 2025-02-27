// components/shifts/ShiftCalendar.tsx
'use client';
import { useState, useEffect } from 'react';
import GanttChart from './GanttChart';

export default function ShiftCalendar() {
  const [date, setDate] = useState('');
  const [shifts, setShifts] = useState([]);

  useEffect(() => {
    if (date) {
      fetch(`/api/shifts?date=${date}`)
        .then(res => res.json())
        .then(data => setShifts(data));
    }
  }, [date]);

  return (
    <div>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      {date && <GanttChart shifts={shifts} date={date} />}
    </div>
  );
}