// app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { format, parseISO, isAfter, isBefore, startOfToday } from 'date-fns';
import { ja } from 'date-fns/locale';
import { supabase } from '../../lib/supabase/client';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'employee';
}

interface Shift {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  status: 'scheduled' | 'completed' | 'absent';
}

interface Availability {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  note: string | null;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [upcomingShifts, setUpcomingShifts] = useState<Shift[]>([]);
  const [recentAvailability, setRecentAvailability] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // 現在のユーザー情報を取得
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !authUser) {
          throw new Error('認証情報の取得に失敗しました');
        }
        
        // ユーザー詳細情報を取得
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single();
        
        if (userError) {
          throw userError;
        }
        
        setUser(userData);
        
        // 今日以降のシフトを取得（最大5件）
        const today = format(new Date(), 'yyyy-MM-dd');
        const { data: shiftsData, error: shiftsError } = await supabase
          .from('shifts')
          .select('*')
          .eq('user_id', authUser.id)
          .gte('date', today)
          .order('date', { ascending: true })
          .order('start_time', { ascending: true })
          .limit(5);
        
        if (shiftsError) {
          throw shiftsError;
        }
        
        setUpcomingShifts(shiftsData || []);
        
        // 最近の出勤可能時間を取得（最大5件）
        const { data: availData, error: availError } = await supabase
          .from('availability')
          .select('*')
          .eq('user_id', authUser.id)
          .gte('date', today)
          .order('date', { ascending: true })
          .limit(5);
        
        if (availError) {
          throw availError;
        }
        
        setRecentAvailability(availData || []);
      } catch (err: any) {
        setError(err.message || 'データの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, 'yyyy年M月d日(E)', { locale: ja });
  };
  
  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="spinner h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-3 text-gray-600">データを読み込み中...</p>
      </div>
    );
  }
  
  if (error) {
    return <div className="text-red-500 p-4 rounded-md bg-red-50">{error}</div>;
  }
  
  return (
    <div className="container mx-auto max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">ダッシュボード</h1>
      
      {user && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">プロフィール</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">名前</p>
              <p className="font-medium">{user.full_name}</p>
            </div>
            <div>
              <p className="text-gray-600">メールアドレス</p>
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-gray-600">役割</p>
              <p className="font-medium">{user.role === 'admin' ? '管理者' : '従業員'}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">今後のシフト</h2>
          {upcomingShifts.length > 0 ? (
            <div className="space-y-4">
              {upcomingShifts.map((shift) => (
                <div key={shift.id} className="border-l-4 border-indigo-500 pl-4 py-2">
                  <p className="font-medium">{formatDate(shift.date)}</p>
                  <p className="text-gray-600">
                    {shift.start_time} - {shift.end_time}
                  </p>
                  <p className="text-sm mt-1">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                      shift.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                      shift.status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {shift.status === 'scheduled' ? '予定' :
                       shift.status === 'completed' ? '完了' : '欠勤'}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">今後のシフトはありません</p>
          )}
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">最近の出勤可能時間</h2>
          {recentAvailability.length > 0 ? (
            <div className="space-y-4">
              {recentAvailability.map((avail) => (
                <div key={avail.id} className="border-l-4 border-green-500 pl-4 py-2">
                  <p className="font-medium">{formatDate(avail.date)}</p>
                  <p className="text-gray-600">
                    {avail.start_time} - {avail.end_time}
                  </p>
                  {avail.note && (
                    <p className="text-sm text-gray-500 mt-1">
                      備考: {avail.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">最近の出勤可能時間の登録はありません</p>
          )}
        </div>
      </div>
    </div>
  );
}