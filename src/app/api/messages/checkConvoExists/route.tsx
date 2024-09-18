import { supabaseClient } from '@/utils/supabaseClient';
import { NextResponse } from 'next/server';

export async function POST(req: Request, res: Response) {
  const supabase = supabaseClient();

  try {
    const body = await req.json();
    const userId1 = body['1'].id;
    const userId2 = body['2'].id;

    // First query: check if userId1 is the first member and userId2 is the second member
    let { data: convoData, error } = await supabase
      .from('conversations')
      .select('*')
      .contains('members', {
        1: { id: userId1 },
        2: { id: userId2 },
      });

    if (error) {
      throw error;
    }

    // If the first query didn't return any results, check the opposite order
    if (convoData?.length === 0) {
      const { data: convoDataAlt, error: errorAlt } = await supabase
        .from('conversations')
        .select('*')
        .contains('members', {
          1: { id: userId2 },
          2: { id: userId1 },
        });
        
      if (errorAlt) {
        throw errorAlt;
      }

      convoData = convoDataAlt;
    }

    // Return the response as JSON
    return NextResponse.json(convoData);
  } catch (error: any) {
    console.error('Error:', error.message);
    return NextResponse.json({ res, error: 'Internal server error' });
  }
}
