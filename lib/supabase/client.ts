// lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

// SupabaseのURLとAPIキーを環境変数から読み込む
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY || '';

// Supabaseクライアントを作成
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);