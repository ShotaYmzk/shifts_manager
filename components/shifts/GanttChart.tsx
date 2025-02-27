// components/shifts/GanttChart.tsx
'use client';
import React from 'react';

type Shift = {
  id: string;
  user_id: string;
  date: string;
  start_time: string;
  end_time: string;
};

interface GanttChartProps {
  shifts: Shift[];
  date: string;
}

export default function GanttChart({ shifts, date }: GanttChartProps) {
  const calculateMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  return (
    <div style={{ position: 'relative', height: '200px', border: '1px solid #ccc' }}>
      {shifts.map((shift) => {
        if (shift.date !== date) return null;
        const start = calculateMinutes(shift.start_time);
        const end = calculateMinutes(shift.end_time);
        const width = end - start;
        return (
          <div
            key={shift.id}
            style={{
              position: 'absolute',
              left: `${(start / (24 * 60)) * 100}%`,
              width: `${(width / (24 * 60)) * 100}%`,
              top: '20px',
              height: '30px',
              backgroundColor: '#4caf50',
              color: 'white',
              textAlign: 'center'
            }}
          >
            {shift.user_id}
          </div>
        );
      })}
    </div>
  );
}