import { supabaseClient } from '@/utils/supabaseClient';
import { NextResponse } from 'next/server';

export async function POST(req: Request, res: Response) {
  const supabase = supabaseClient();
  const body = await req.json();
  try {
    // Ensure that id is a string
    if (typeof body.id != 'string') {
      return NextResponse.json({ res, error: 'Invalid user ID' });
    }

    // Fetch the logged-in user using supabaseClient and the provided user ID
    const { data, error } = await supabase
      .from('appUsers')
      .select('*')
      .eq('id', body.id);

    if (error) {
      throw error;
    }

    if (data && data.length > 0) {
      // User found, return it as JSON
      return NextResponse.json(data[0]);
    } else {
      // User not found
      return NextResponse.json({ res, error: 'User not found' });
    }
  } catch (error) {
    // Handle any errors and return an error response
    return NextResponse.json({ res, error: error });
  }
}
