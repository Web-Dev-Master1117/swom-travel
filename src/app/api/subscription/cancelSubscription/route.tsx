import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: Request, res: Response) {
  const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!, {
    apiVersion: '2023-08-16',
  });
  const body = await req.json();

  const subscription = await stripe.subscriptions.update(body.subscriptionId, {
    cancel_at_period_end: true,
  });
  if (subscription) {
    return NextResponse.json(subscription);
  } else {
    return NextResponse.json(res, subscription);
  }
}
