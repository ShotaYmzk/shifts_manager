// components/shifts/GanttChart.tsx
'use client';

import { useEffect, useState } from 'react';
import { format, parseISO, addHours } from 'date-fns';
import { ja } from 'date-fns/locale';
import { supabase } from '../../lib/supabase/client';

interface User {
  id: string;
  full_name: string;
}

interface Shift {
  id: string;
  user_id: string;
  date: string;
  start_time: string;
  end_time: string;
  status: 'scheduled' | 'completed' | 'absent';
}

interface GanttChartProps {
  selectedDate: string;
}

// 時間を分単位に変換する関数
const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

// 営業時間の設定（例：8:00 - 22:00）
const BUSINESS_HOURS_START = 8;
const BUSINESS_HOURS_END = 22;
const TOTAL_HOURS = BUSINESS_HOURS_END - BUSINESS_HOURS_START;
const HOUR_WIDTH = 120; // ピクセル単位での1時間の幅

export default function GanttChart({ selectedDate }: GanttChartProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 時間軸の生成
  const timeSlots = [];
  for (let hour = BUSINESS_HOURS_START; hour <= BUSINESS_HOURS_END; hour++) {
    timeSlots.push(hour);
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // 選択された日付のシフトを取得
        const { data: shiftsData, error: shiftsError } = await supabase
          .from('shifts')
          .select('*')
          .eq('date', selectedDate);

        if (shiftsError) {
          throw shiftsError;
        }

        // ユーザー情報を取得
        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('id, full_name');

        if (usersError) {
          throw usersError;
        }

        setShifts(shiftsData);
        setUsers(usersData);
      } catch (err: any) {
        setError(err.message || 'データの取得に失敗しました。');
      } finally {
        setLoading(false);
      }
    };

    if (selectedDate) {
      fetchData();
    }
  }, [selectedDate]);

  if (loading) {
    return <div className="text-center py-10">データを読み込み中...</div>;
  }

  if (error) {
    return <div className="text-red-500 py-10">{error}</div>;
  }

  const formatDisplayDate = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, 'yyyy年M月d日(E)', { locale: ja });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
      <h2 className="text-2xl font-bold mb-6">
        {selectedDate ? formatDisplayDate(selectedDate) : '日付を選択してください'}
      </h2>

      <div className="min-w-max">
        {/* 時間軸ヘッダー */}
        <div className="flex border-b">
          <div className="w-40 flex-shrink-0 p-2 font-medium">従業員名</div>
          <div className="flex">
            {timeSlots.map((hour) => (
              <div
                key={hour}
                className="text-center font-medium p-2"
                style={{ width: `${HOUR_WIDTH}px` }}
              >
                {`${hour}:00`}
              </div>
            ))}
          </div>
        </div>

        {/* ユーザー毎の行 */}
        {users.map((user) => {
          // このユーザーのシフト
          const userShifts = shifts.filter((shift) => shift.user_id === user.id);
          
          return (
            <div key={user.id} className="flex border-b hover:bg-gray-50">
              <div className="w-40 flex-shrink-0 p-2 border-r">{user.full_name}</div>
              <div className="relative" style={{ height: '50px', width: `${TOTAL_HOURS * HOUR_WIDTH}px` }}>
                {userShifts.map((shift) => {
                  // 開始・終了時間を分に変換
                  const startMinutes = timeToMinutes(shift.start_time) - BUSINESS_HOURS_START * 60;
                  const endMinutes = timeToMinutes(shift.end_time) - BUSINESS_HOURS_START * 60;
                  const durationMinutes = endMinutes - startMinutes;
                  
                  // 位置とサイズを計算
                  const leftPosition = (startMinutes / 60) * HOUR_WIDTH;
                  const width = (durationMinutes / 60) * HOUR_WIDTH;
                  
                  // シフトのステータスに応じた色
                  const statusColors = {
                    scheduled: 'bg-blue-500',
                    completed: 'bg-green-500',
                    absent: 'bg-red-500'
                  };
                  
                  return (
                    <div
                      key={shift.id}
                      className={`absolute top-1 rounded-md ${statusColors[shift.status]} text-white text-sm overflow-hidden`}
                      style={{
                        left: `${leftPosition}px`,
                        width: `${width}px`,
                        height: '38px',
                      }}
                    >
                      <div className="p-1 truncate">
                        {shift.start_time} - {shift.end_time}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {users.length === 0 && (
        <div className="text-center py-10 text-gray-500">従業員データはありません</div>
      )}

      {users.length > 0 && shifts.length === 0 && (
        <div className="text-center py-10 text-gray-500">この日のシフトデータはありません</div>
      )}
    </div>
  );
}