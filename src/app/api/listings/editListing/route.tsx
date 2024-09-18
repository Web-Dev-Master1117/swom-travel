import { supabaseClient } from '@/utils/supabaseClient';
import { NextResponse } from 'next/server';

export async function POST(req: Request, res: Response) {
  const supabase = supabaseClient();

  const body = await req.json();
  const { data: user, error: userError } = await supabase
    .from('listings')
    .upsert(
      {
        user_id: body.id,
        userInfo: body.data.userInfo,
        homeInfo: body.data.homeInfo,
        amenities: body.data.amenities,
      },
      {
        ignoreDuplicates: false,
      }
    )
    .eq('user_id', body.id)
    .select('*');

  const { data: appUserData, error: appUserDataError } = await supabase
    .from('appUsers')
    .upsert({
      id: body.id,
      name: body.data.userInfo.name,
      profession: body.data.userInfo.profession,
      age: body.data.userInfo.age,
      profileImage: body.data.userInfo.profileImage,
    })
    .eq('id', body.id);

  if (userError || appUserDataError) {
    return NextResponse.json({ res, error: userError || appUserDataError });
  } else {
    return NextResponse.json(user);
  }
}
