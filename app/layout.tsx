// app/layout.tsx
import '../styles/globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <title>シフト管理アプリ</title>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}