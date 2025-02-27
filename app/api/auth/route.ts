// app/api/auth/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase/client';

export async function POST(request: Request) {
  try {
    const { email, password, type } = await request.json();

    // 必須パラメータのチェック
    if (!email || !password || !type) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
    }

    let result;
    if (type === 'login') {
      result = await supabase.auth.signInWithPassword({ email, password });
    } else if (type === 'register') {
      result = await supabase.auth.signUp({ email, password });
    } else {
      return NextResponse.json({ error: 'Invalid auth type' }, { status: 400 });
    }

    // Supabase からエラーが返された場合
    if (result.error) {
      console.error('Auth error:', result.error);
      return NextResponse.json({ error: result.error.message }, { status: 400 });
    }
    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Unexpected error occurred' }, { status: 500 });
  }
}