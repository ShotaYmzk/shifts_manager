// app/register/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    // パスワードが一致しているか確認
    if (password !== confirmPassword) {
      setError('パスワードが一致しません');
      return;
    }

    try {
      // JSON形式でAPIにリクエストを送信
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, type: 'register' }),
      });
      const result = await res.json();

      if (!res.ok) {
        setError(result.error || '登録に失敗しました');
        return;
      }
      // 登録成功時はダッシュボード（またはログインページ）へ遷移
      router.push('/dashboard');
    } catch (err) {
      setError('登録中にエラーが発生しました');
    }
  };

  return (
    <div className="auth-container">
      <header className="auth-header">
        <Link href="/">
          <h2>Shift Management</h2>
        </Link>
      </header>
      <div className="auth-form">
        <h1>Register</h1>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit">Register</button>
        </form>
        <p>
          Already have an account? <Link href="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}