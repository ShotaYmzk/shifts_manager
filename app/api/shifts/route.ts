// app/api/shifts/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase/client';

export async function POST(request: Request) {
  const { shiftId, userId, date, startTime, endTime } = await request.json();
  let result;
  if (shiftId) {
    // 既存シフトの更新
    result = await supabase
      .from('shifts')
      .update({ user_id: userId, date, start_time: startTime, end_time: endTime })
      .eq('id', shiftId);
  } else {
    // 新規作成
    result = await supabase
      .from('shifts')
      .insert([{ user_id: userId, date, start_time: startTime, end_time: endTime }]);
  }
  if (result.error) {
    return NextResponse.json({ error: result.error.message }, { status: 400 });
  }
  return NextResponse.json(result.data);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');
  let query = supabase.from('shifts').select('*');
  if (date) {
    query = query.eq('date', date);
  }
  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json(data);
}