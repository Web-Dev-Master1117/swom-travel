import { supabaseClient } from '@/utils/supabaseClient';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const supabase = supabaseClient();
  const body = await req.json();
  const user = body.id;

  const { data, error } = await supabase
    .from('read_receipts')
    .select('conversation_id')
    .eq('user_id', user)

  if (error) {
    console.error('Error fetching unread messages:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const unreadCount = data.length;
  const conversations = data;

  return NextResponse.json({ conversations, unreadCount }, { status: 200 });
}
