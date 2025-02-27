// components/layout/Footer.tsx
import React from 'react';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#333', color: 'white', padding: '1rem', textAlign: 'center' }}>
      <p>&copy; {new Date().getFullYear()} シフト管理アプリ</p>
    </footer>
  );
}