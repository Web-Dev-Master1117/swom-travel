import { supabaseClient } from '@/utils/supabaseClient';
import { NextResponse } from 'next/server';

export async function POST(req: Request, res: Response) {
  const supabase = supabaseClient();
  const body = await req.json();

  const { data: existingData, error: existingError } = await supabase
    .from('messages')
    .select('messagesObj')
    .eq('conversation_id', body.selectedConversation);

  if (existingError) {
    return NextResponse.json({ res, error: existingError });
  }

  // Check if messagesObj is defined and is an array
  const existingMessagesObj =
    existingData[0] && Array.isArray(existingData[0].messagesObj)
      ? existingData[0].messagesObj
      : [];

  // Append the new message to the existing messages
  const updatedMessages = [
    ...existingMessagesObj,
    {
      sender_id: body.sender_id,
      content: body.content,
      timestamp: new Date(),
    },
  ];
  console.log("sending this message", body.contacted_user, body.selectedConversation)
  const { data, error } = await supabase
    .from('messages')
    .upsert([
      {
        conversation_id: body.conversation_id,
        messagesObj: updatedMessages,
      },
    ])
    .eq('conversation_id', body.selectedConversation)
    .select('*');
    
    // Insert into read_receipts table
    const { data: readReceiptData, error: readReceiptError } = await supabase
      .from('read_receipts')
      .insert([
        {
          conversation_id: body.conversation_id,
          user_id: body.contacted_user,
        },
      ])
      .select('*');

    if (readReceiptError) {
      return NextResponse.json({ res, error: readReceiptError });
    }

    console.log('server - messages data', data);
    console.log('server - read receipts data', readReceiptData);
  if (data) {
    console.log('server - messages data', data);
    return NextResponse.json(data);
  } else {
    throw error;
  }
}
