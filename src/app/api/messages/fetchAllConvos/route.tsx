import { supabaseClient } from '@/utils/supabaseClient';
import { NextResponse } from 'next/server';

export async function POST(req: Request, res: Response) {
  const supabase = supabaseClient();
  const stateId = await req.json();

  const { data: position1Data, error } = await supabase
    .from('conversations')
    .select('*')
    .contains('members', {
      1: { id: stateId.id },
    });

  const { data: position2Data, error: error2 } = await supabase
    .from('conversations')
    .select('*')
    .contains('members', {
      2: { id: stateId.id },
    });

  // i want to organize the data based on their "created_at" field

  if (error || error2) {
    throw error;
  }

  const combinedData = [...position1Data, ...position2Data];

  // Sorting the combined array based on the 'created_at' field
  combinedData.sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  return NextResponse.json(combinedData);
}
