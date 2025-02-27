// app/dashboard/layout.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase/client';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'employee';
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        // 現在のセッションを取得
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (!session) {
          // セッションがなければログインページへリダイレクト
          router.push('/login');
          return;
        }
        
        // ユーザー情報を取得
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (userError) {
          throw userError;
        }
        
        setUser(userData);
      } catch (err) {
        console.error('認証エラー:', err);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    
    checkUser();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-3 text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">シフト管理システム</h1>
          
          {user && (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {user.full_name} ({user.role === 'admin' ? '管理者' : '従業員'})
              </span>
              <button 
                onClick={handleSignOut}
                className="text-sm text-red-600 hover:text-red-800"
              >
                ログアウト
              </button>
            </div>
          )}
        </div>
      </header>
      
      <div className="flex-grow flex flex-col md:flex-row">
        {/* サイドバー */}
        <aside className="w-full md:w-64 bg-gray-800 md:min-h-screen">
          <nav className="p-4 space-y-1">
            <Link 
              href="/dashboard" 
              className={`block py-2.5 px-4 rounded transition ${
                pathname === '/dashboard' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              ダッシュボード
            </Link>
            
            <Link 
              href="/dashboard/availability" 
              className={`block py-2.5 px-4 rounded transition ${
                pathname === '/dashboard/availability' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              出勤可能時間登録
            </Link>
            
            {user?.role === 'admin' && (
              <>
                <Link 
                  href="/dashboard/admin" 
                  className={`block py-2.5 px-4 rounded transition ${
                    pathname === '/dashboard/admin' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  管理者ダッシュボード
                </Link>
                
                <Link 
                  href="/dashboard/admin/schedule" 
                  className={`block py-2.5 px-4 rounded transition ${
                    pathname === '/dashboard/admin/schedule' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  シフト編集・確認
                </Link>
              </>
            )}
          </nav>
        </aside>
        
        {/* メインコンテンツ */}
        <main className="flex-grow p-6">
          {children}
        </main>
      </div>
    </div>
  );
}