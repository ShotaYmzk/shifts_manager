// app/register/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, type: 'register' }),
    });
    if (res.ok) {
      router.push('/dashboard');
    } else {
      alert('登録に失敗しました');
    }
  };

  return (
    <div>
      <h1>新規登録</h1>
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
        <button type="submit">登録</button>
      </form>
    </div>
  );
}