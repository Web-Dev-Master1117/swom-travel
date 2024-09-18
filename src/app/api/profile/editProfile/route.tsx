import { supabaseClient } from '@/utils/supabaseClient';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

export async function POST(req: Request, res: Response) {
  const body = await req.json();
  const supabase = supabaseClient();
  console.log('server body', body);
  const { data: getUser, error: getUserError } = await supabase
    .from('listings')
    .select('userInfo')
    .eq('user_id', body.id);

  if (getUser) {
    const combinedUserInfo = {
      ...getUser[0].userInfo,
    };

    combinedUserInfo.name = body.data.name;
    combinedUserInfo.email = body.data.emailAddress;

    if (body.data.profileImage) {
      combinedUserInfo.profileImage = body.data.profileImage;
    }
    const { data: user, error: userError } = await supabase
      .from('listings')
      .update({
        userInfo: combinedUserInfo,
      })
      .eq('user_id', body.id)
      .select('*');

    const { data: appUserData, error: appUserDataError } = await supabase
      .from('appUsers')
      .update({
        profileImage: body.data.profileImage && body.data.profileImage,
        name: body.data.name,
        email: body.data.emailAddress,
      })
      .eq('id', body.id)
      .select('*');

    if (userError || appUserDataError) {
      return NextResponse.json({ res, error: userError || appUserDataError });
    }
    return NextResponse.json(user);
  } else {
    return NextResponse.json({ res, error: getUserError });
  }
}
