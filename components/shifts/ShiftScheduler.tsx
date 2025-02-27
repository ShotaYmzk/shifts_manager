// components/shifts/ShiftScheduler.tsx
'use client';
import { useState } from 'react';

export default function ShiftScheduler() {
  const [shiftData, setShiftData] = useState({
    userId: '',
    date: '',
    startTime: '',
    endTime: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShiftData({ ...shiftData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/shifts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(shiftData),
    });
    if (res.ok) {
      alert('シフトが更新されました');
    } else {
      alert('更新に失敗しました');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        ユーザーID:
        <input type="text" name="userId" value={shiftData.userId} onChange={handleChange} required />
      </label>
      <br />
      <label>
        日付:
        <input type="date" name="date" value={shiftData.date} onChange={handleChange} required />
      </label>
      <br />
      <label>
        開始時間:
        <input type="time" name="startTime" value={shiftData.startTime} onChange={handleChange} required />
      </label>
      <br />
      <label>
        終了時間:
        <input type="time" name="endTime" value={shiftData.endTime} onChange={handleChange} required />
      </label>
      <br />
      <button type="submit">シフト更新</button>
    </form>
  );
}