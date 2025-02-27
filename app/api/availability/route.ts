// app/api/availability/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase/client';

export async function POST(request: Request) {
  const { userId, date, startTime, endTime } = await request.json();
  const { data, error } = await supabase
    .from('availabilities')
    .insert([{ user_id: userId, date, start_time: startTime, end_time: endTime }]);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json(data);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');
  let query = supabase.from('availabilities').select('*');
  if (date) {
    query = query.eq('date', date);
  }
  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json(data);
}