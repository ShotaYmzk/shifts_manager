// app/dashboard/page.tsx
'use client';
import { useRouter } from 'next/navigation';
import { useUser } from '@supabase/auth-helpers-react';
import Header from '../../components/layout/Header';
import Sidebar from '../../components/layout/Sidebar';
import Footer from '../../components/layout/Footer';
import ShiftCalendar from '../../components/shifts/ShiftCalendar';
import { useEffect } from 'react';

export default function Dashboard() {
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      // ログインしていない場合は /login にリダイレクト
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return null; // またはローディングスピナーなど
  }

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