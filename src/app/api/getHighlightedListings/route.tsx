import { sanityClient } from '../../../../sanity/lib/client';
import { NextResponse } from 'next/server';

export async function GET(req: Request, res: Response) {
  // get highlightedListings from sanity backend put it in a try catch block
  try {
    const highlightedListings = await sanityClient.fetch(
      `*[_type == 'highlightedListings']`
    );

    // return highlightedListings as json response
    return NextResponse.json(highlightedListings);
  } catch (error) {
    // return error as json response
    return NextResponse.json({ res, error: error });
  }
}
