// app/dashboard/admin/schedule/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { format, parseISO, addDays } from 'date-fns';
import { ja } from 'date-fns/locale';
import { supabase } from '../../../../lib/supabase/client';
import GanttChart from '../../../../components/shifts/GanttChart';
import { Calendar } from '../../../../components/ui/Calendar';

interface User {
  id: string;
  full_name: string;
}

interface Availability {
  id: string;
  user_id: string;
  date: string;
  start_time: string;
  end_time: string;
  note: string | null;
}

interface Shift {
  id?: string;
  user_id: string;
  date: string;
  start_time: string;
  end_time: string;
  status: 'scheduled' | 'completed' | 'absent';
}

export default function AdminSchedulePage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // 選択した日付の文字列形式（YYYY-MM-DD）
  const formattedDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';

  useEffect(() => {
    // 管理者のみアクセス可能
    const fetchData = async () => {
      if (!selectedDate) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // 日付をYYYY-MM-DD形式に変換
        const dateString = format(selectedDate, 'yyyy-MM-dd');
        
        // ユーザー情報を取得
        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('id, full_name, role')
          .eq('role', 'employee');
        
        if (usersError) throw usersError;
        
        // 選択された日付の従業員の利用可能時間を取得
        const { data: availData, error: availError } = await supabase
          .from('availability')
          .select('*')
          .eq('date', dateString);
        
        if (availError) throw availError;
        
        // 選択された日付のシフトを取得
        const { data: shiftsData, error: shiftsError } = await supabase
          .from('shifts')
          .select('*')
          .eq('date', dateString);
        
        if (shiftsError) throw shiftsError;
        
        setUsers(usersData);
        setAvailabilities(availData);
        setShifts(shiftsData || []);
      } catch (err: any) {
        setError(err.message || 'データの取得に失敗しました。');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [selectedDate]);
  
  const handleAddShift = async (shift: Shift) => {
    try {
      setSaving(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('shifts')
        .upsert(shift)
        .select();
      
      if (error) throw error;
      
      // シフトリストを更新
      if (data) {
        setShifts(prevShifts => {
          // 既存のシフトを更新するか新しいシフトを追加
          const exists = prevShifts.some(s => s.id === data[0].id);
          if (exists) {
            return prevShifts.map(s => s.id === data[0].id ? data[0] : s);
          } else {
            return [...prevShifts, data[0]];
          }
        });
      }
      
      setSuccess('シフトを保存しました。');
      
      // 3秒後に成功メッセージをクリア
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'シフトの保存に失敗しました。');
    } finally {
      setSaving(false);
    }
  };
  
  const handleDeleteShift = async (shiftId: string) => {
    if (!confirm('このシフトを削除してもよろしいですか？')) {
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      const { error } = await supabase
        .from('shifts')
        .delete()
        .eq('id', shiftId);
      
      if (error) throw error;
      
      // シフトリストから削除
      setShifts(prevShifts => prevShifts.filter(s => s.id !== shiftId));
      
      setSuccess('シフトを削除しました。');
      
      // 3秒後に成功メッセージをクリア
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'シフトの削除に失敗しました。');
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <div className="container mx-auto py-6 space-y-8">
      <h1 className="text-3xl font-bold">シフト管理</h1>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 text-green-700 p-4 rounded-md">
          {success}
        </div>
      )}
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">日付を選択</h2>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            locale={ja}
            className="border rounded-md p-2 w-full"
          />
        </div>
        
        <div className="md:col-span-2">
          <GanttChart selectedDate={formattedDate} />
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">シフト編集</h2>
        
        {loading ? (
          <div className="text-center py-4">データを読み込み中...</div>
        ) : (
          <>
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">従業員の利用可能時間</h3>
              {availabilities.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          従業員名
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          開始時間
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          終了時間
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          備考
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          アクション
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {availabilities.map((avail) => {
                        const user = users.find(u => u.id === avail.user_id);
                        return (
                          <tr key={avail.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {user?.full_name || '不明なユーザー'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {avail.start_time}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {avail.end_time}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {avail.note || '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => handleAddShift({
                                  user_id: avail.user_id,
                                  date: avail.date,
                                  start_time: avail.start_time,
                                  end_time: avail.end_time,
                                  status: 'scheduled'
                                })}
                                disabled={saving}
                                className="text-indigo-600 hover:text-indigo-900 mr-3"
                              >
                                シフト作成
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-gray-500 py-4">この日の利用可能時間データはありません</div>
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">作成されたシフト</h3>
              {shifts.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          従業員名
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          開始時間
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          終了時間
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ステータス
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          アクション
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {shifts.map((shift) => {
                        const user = users.find(u => u.id === shift.user_id);
                        return (
                          <tr key={shift.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {user?.full_name || '不明なユーザー'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {shift.start_time}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {shift.end_time}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <select
                                value={shift.status}
                                onChange={async (e) => {
                                  const newStatus = e.target.value as 'scheduled' | 'completed' | 'absent';
                                  await handleAddShift({
                                    ...shift,
                                    status: newStatus
                                  });
                                }}
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              >
                                <option value="scheduled">予定</option>
                                <option value="completed">完了</option>
                                <option value="absent">欠勤</option>
                              </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => shift.id && handleDeleteShift(shift.id)}
                                disabled={saving}
                                className="text-red-600 hover:text-red-900"
                              >
                                削除
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-gray-500 py-4">この日のシフトはまだ作成されていません</div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}