'use client';
import { Provider } from 'jotai';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

export default function Providers({ children }) {
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
  return (
    <Provider>
      <Elements stripe={stripePromise}>{children}</Elements>
    </Provider>
  );
}
