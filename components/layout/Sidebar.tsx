// components/layout/Sidebar.tsx
import React from 'react';
import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside style={{ width: '200px', backgroundColor: '#f4f4f4', padding: '1rem', position: 'fixed', height: '100vh' }}>
      <nav>
        <ul>
          <li><Link href="/dashboard">マイシフト</Link></li>
          <li><Link href="/dashboard/availability">利用可能時間</Link></li>
          <li><Link href="/dashboard/admin">管理者</Link></li>
        </ul>
      </nav>
    </aside>
  );
}