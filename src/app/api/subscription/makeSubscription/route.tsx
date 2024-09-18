// app/checkout-sessions/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

// data needed for checkout
export interface CheckoutSubscriptionBody {
  // plan: string;
  // planDescription: string;
  // amount: number;
  // interval: "month" | "year";
  priceId: string;
  // customerId?: string;
}

export async function POST(req: Request) {
  const body = (await req.json()) as CheckoutSubscriptionBody;
  const origin = req.headers.get("origin") || "http://localhost:3000";
  const stripe = new Stripe(
    process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY as string,
    {
      apiVersion: "2023-08-16",
    }
  );

  // if user is logged in, redirect to thank you page, otherwise redirect to signup page.
  const success_url = `${origin}/sign-up?session_id={CHECKOUT_SESSION_ID}`;

  try {
    const session = await stripe.checkout.sessions.create({
      // if user is logged in, stripe will set the email in the checkout page
      // customer: body.customerId,
      mode: "subscription", // mode should be subscription
      payment_method_types: ["card"], // only allow card payments
      line_items: [
        // generate inline price and product
        {
          price: body.priceId,
          quantity: 1,
        },
      ],
      allow_promotion_codes: true,
      success_url: success_url,
      cancel_url: `${origin}/home`,
    });
    return NextResponse.json(session);
  } catch (error) {
    if (error instanceof Stripe.errors.StripeError) {
      const { message } = error;
      return NextResponse.json({ message }, { status: error.statusCode });
    }
  }
}
