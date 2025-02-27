// app/dashboard/availability/page.tsx
'use client';
import Header from '../../../components/layout/Header';
import Sidebar from '../../../components/layout/Sidebar';
import Footer from '../../../components/layout/Footer';
import AvailabilityForm from '../../../components/availability/AvailabilityForm';

export default function AvailabilityPage() {
  return (
    <div>
      <Header />
      <Sidebar />
      <main style={{ marginLeft: '220px', padding: '1rem' }}>
        <h1>利用可能時間の提出</h1>
        <AvailabilityForm />
      </main>
      <Footer />
    </div>
  );
}