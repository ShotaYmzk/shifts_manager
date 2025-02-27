// app/login/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, type: 'login' }),
    });
    if (res.ok) {
      router.push('/dashboard');
    } else {
      alert('ログインに失敗しました');
    }
  };

  return (
    <div>
      <h1>ログイン</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          placeholder="メールアドレス" 
          value={email} 
          onChange={(e)=>setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="パスワード" 
          value={password} 
          onChange={(e)=>setPassword(e.target.value)} 
          required 
        />
        <button type="submit">ログイン</button>
      </form>
    </div>
  );
}