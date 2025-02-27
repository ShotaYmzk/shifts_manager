//app/login/page.tsx
'use client'

import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { Database } from '../../database.types'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleSignIn = async () => {
    setMessage('')
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      setMessage(`Sign in error: ${error.message}`)
    } else {
      setMessage('Sign in successful!')
      router
        .push('/dashboard')
    }
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#141E30] via-[#243B55] to-[#141E30] relative overflow-hidden">
      {/* 背景アニメーションのブロブ */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500 opacity-20 rounded-full filter blur-3xl animate-blob" />
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500 opacity-20 rounded-full filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-500 opacity-20 rounded-full filter blur-3xl animate-blob animation-delay-4000" />
      </div>
      <div className="relative z-10 w-full max-w-md p-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl">
        <h2 className="text-4xl font-bold text-center text-white mb-8">Welcome Back</h2>
        {message && <p className="text-center text-red-400 mb-4">{message}</p>}
        <div className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1 block w-full px-4 py-3 rounded-md bg-gray-800 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="mt-1 block w-full px-4 py-3 rounded-md bg-gray-800 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
          <button
            onClick={handleSignIn}
            className="w-full py-3 rounded-md bg-blue-600 hover:bg-blue-700 transition font-semibold text-white shadow-lg"
          >
            Sign in
          </button>
          <p className="mt-6 text-center text-gray-300 text-sm">
            Don&apos;t have an account?{' '}
            <a href="/register" className="text-blue-400 hover:underline">
              Register
            </a>
          </p>
        </div>
      </div>
      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}