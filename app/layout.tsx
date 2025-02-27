// app/layout.tsx
import React from 'react';
import '../styles/globals.css';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { createBrowserClient } from '@supabase/ssr';


export default function RootLayout({ children }: { children: React.ReactNode }) {
  // ページ全体で利用する Supabase クライアントを作成
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  return (
    <html lang="ja">
      <head>
        <title>シフト管理アプリ</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <SessionContextProvider supabaseClient={supabase}>
          {children}
        </SessionContextProvider>
      </body>
    </html>
  );
}