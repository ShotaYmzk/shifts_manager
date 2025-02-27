// components/availability/AvailabilityForm.tsx
'use client';
import { useState } from 'react';

export default function AvailabilityForm() {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // ※本来は認証情報から userId を取得する
    const userId = 'user-id';
    const res = await fetch('/api/availability', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, date, startTime, endTime }),
    });
    if (res.ok) {
      alert('送信成功');
    } else {
      alert('送信失敗');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        日付:
        <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} required />
      </label>
      <br />
      <label>
        開始時間:
        <input type="time" value={startTime} onChange={(e)=>setStartTime(e.target.value)} required />
      </label>
      <br />
      <label>
        終了時間:
        <input type="time" value={endTime} onChange={(e)=>setEndTime(e.target.value)} required />
      </label>
      <br />
      <button type="submit">送信</button>
    </form>
  );
}