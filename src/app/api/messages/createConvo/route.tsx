import { supabaseClient } from '@/utils/supabaseClient';
import { NextResponse } from 'next/server';

export async function POST(req: Request, res: Response) {
  const supabase = supabaseClient();
  const body = await req.json();
  console.log('body', body);

  const { data: convoData, error: convoError } = await supabase
    .from('conversations')
    .insert(body)
    .select('*');

  console.log('convoData', convoData);

  if (convoData) {
    const { data: messagesData, error: messagesError } = await supabase
      .from('messages')
      .insert([
        {
          conversation_id: convoData[0].conversation_id,
        },
      ])
      .select('*');
    if (messagesData) {
      return NextResponse.json({
        res,
        data: { convoData, messagesData },
        error: messagesError,
      });
    } else {
      return NextResponse.json({ res, error: 'error with messageData' });
    }
  }

  if (convoError) {
    return NextResponse.json({ res, error: convoError });
  }
}
