// app/api/auth/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase/client';

export async function POST(request: Request) {
  const { email, password, type } = await request.json();

  let data, error;

  if (type === 'login') {
    ({ data, error } = await supabase.auth.signInWithPassword({ email, password }));
  } else if (type === 'register') {
    ({ data, error } = await supabase.auth.signUp({ email, password }));
  } else {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  }

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json(data);
}