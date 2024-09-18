import { supabaseClient } from '@/utils/supabaseClient';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const supabase = supabaseClient();
  const body = await req.json();
  const { id } = body;

  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('conversation_id', id);

  if (error) {
    console.error('Error fetching conversation:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}
