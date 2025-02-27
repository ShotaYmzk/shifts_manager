// components/availability/AvailabilityForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase/client';
import { formatISO, parseISO } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Calendar } from '../../components/ui/Calendar';

export default function AvailabilityForm() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  // 時間の選択肢を生成（30分間隔）
  const timeOptions = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute of [0, 30]) {
      const formattedHour = hour.toString().padStart(2, '0');
      const formattedMinute = minute.toString().padStart(2, '0');
      timeOptions.push(`${formattedHour}:${formattedMinute}`);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate) {
      setError('日付を選択してください。');
      return;
    }
    
    if (startTime >= endTime) {
      setError('開始時間は終了時間より前である必要があります。');
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        throw new Error('ユーザー情報の取得に失敗しました。再度ログインしてください。');
      }
      
      const userId = userData.user.id;
      
      // 日付をYYYY-MM-DD形式に変換
      const formattedDate = formatISO(selectedDate, { representation: 'date' });
      
      const { data, error } = await supabase
        .from('availability')
        .upsert({
          user_id: userId,
          date: formattedDate,
          start_time: startTime,
          end_time: endTime,
          note: note || null,
        }, {
          onConflict: 'user_id, date, start_time'
        });
      
      if (error) {
        throw error;
      }
      
      setSuccess('出勤可能時間を登録しました。');
      // フォームをリセット
      setNote('');
      
      // データを更新したことをシステムに通知
      router.refresh();
    } catch (err: any) {
      setError(err.message || '出勤可能時間の登録に失敗しました。');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">出勤可能時間の登録</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            日付を選択
          </label>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            locale={ja}
            className="border rounded-md p-2"
            disabled={(date) => {
              // 過去の日付を無効化
              return date < new Date(new Date().setHours(0, 0, 0, 0));
            }}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
              開始時間
            </label>
            <select
              id="startTime"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              {timeOptions.map((time) => (
                <option key={`start-${time}`} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
              終了時間
            </label>
            <select
              id="endTime"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              {timeOptions.map((time) => (
                <option key={`end-${time}`} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div>
          <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
            備考（任意）
          </label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="特記事項があれば記入してください"
          />
        </div>
        
        <div>
          <button
            type="submit"
            disabled={loading || !selectedDate}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
          >
            {loading ? '登録中...' : '登録する'}
          </button>
        </div>
      </form>
    </div>
  );
}