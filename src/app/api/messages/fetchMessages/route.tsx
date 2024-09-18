import { supabaseClient } from '@/utils/supabaseClient';
import { NextResponse } from 'next/server';

export async function POST(req: Request, res: Response) {
  const supabase = supabaseClient();
  const body = await req.json();
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', body.id);


    // Delete all read receipts for the given conversation ID and user ID
    const { error: deleteError } = await supabase
    .from('read_receipts')
    .delete()
    .eq('conversation_id', body.id)
    .eq('user_id', body.user);

  if (deleteError) {
    console.error('Error deleting read receipts:', deleteError);
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  console.log('Deleted read receipts for conversation:', body.id, 'user:', body.user);

  if (error) {
    throw error;
  }
  console.log('messages', data);
  return NextResponse.json(data);
}
