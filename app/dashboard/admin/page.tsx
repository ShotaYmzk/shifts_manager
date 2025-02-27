// app/dashboard/admin/schedule/page.tsx
'use client';
import Header from '../../../components/layout/Header';
import Sidebar from '../../../components/layout/Sidebar';
import Footer from '../../../components/layout/Footer';
import ShiftScheduler from '../../../components/shifts/ShiftScheduler';

export default function SchedulePage() {
  return (
    <div>
      <Header />
      <Sidebar />
      <main style={{ marginLeft: '220px', padding: '1rem' }}>
        <h1>シフト編集・確認</h1>
        <ShiftScheduler />
      </main>
      <Footer />
    </div>
  );
}