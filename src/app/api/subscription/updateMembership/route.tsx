import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: Request, res: Response) {
  const body = await req.json();
  const origin = req.headers.get('origin') || 'http://localhost:3000';
  const stripe = new Stripe(
    process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY as string,
    {
      apiVersion: '2023-08-16',
    }
  );
  try {
    const customers = await stripe.customers.list({ email: body.email });
    const customer = customers.data[0];

    const session = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: `${origin}/membership?customer_id=${customer.id}`,
    });
    return NextResponse.json(session.url);
  } catch (error) {
    return NextResponse.json({ res, error: error });
  }
}
