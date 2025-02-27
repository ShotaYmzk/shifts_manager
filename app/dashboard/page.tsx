// app/dashboard/page.tsx
'use client';
import Header from '../../components/layout/Header';
import Sidebar from '../../components/layout/Sidebar';
import Footer from '../../components/layout/Footer';
import ShiftCalendar from '../../components/shifts/ShiftCalendar';

// 以前は使っていなかったため削除
// import { isAfter, isBefore, startOfToday } from 'date-fns';

// シフトの型定義例
export interface Shift {
  id: string;
  user_id: string;
  date: string;
  start_time: string;
  end_time: string;
}

// // any 型の使用例を、Shift 型を利用するように変更
// const processShifts = (shifts: Shift[]): Shift[] => {
//   // シフト情報の加工処理（必要に応じて実装）
//   return shifts;
// };

export default function UserDashboard() {
  return (
    <div>
      <Header />
      <Sidebar />
      <main style={{ marginLeft: '220px', padding: '1rem' }}>
        <h1>マイシフト</h1>
        <ShiftCalendar />
      </main>
      <Footer />
    </div>
  );
}