'use client';
import React, { useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { supabaseClient } from '@/utils/supabaseClient';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Stripe from 'stripe';
import { useAtom } from 'jotai';
import { globalStateAtom } from '@/context/atoms';
import { sanityClient } from '@/utils/sanityClient';

type Props = {
  setSignInActive: React.Dispatch<React.SetStateAction<boolean>>;
};

const SignIn = (props: Props) => {
  const supabase = supabaseClient();
  const stripeActivation = new Stripe(
    process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!,
    {
      apiVersion: '2023-08-16',
    }
  );

  const [state, setState] = useAtom(globalStateAtom);

  async function isUserSubscribed(
    email: string,
    stripe: any
  ): Promise<boolean> {
    console.log('checking subscription status');
    try {
      if (!stripe) {
        console.log('Stripe.js has not loaded yet.');
        return false;
      }
      // Retrieve the customer by email
      const customers = await stripe.customers.list({ email: email });
      const customer = customers.data[0]; // Assuming the first customer is the desired one

      if (customer) {
        // Retrieve the customer's subscriptions
        const subscriptions = await stripe.subscriptions.list({
          customer: customer.id,
          limit: 1, // Assuming only checking the latest subscription
        });

        return subscriptions.data.length > 0; // User is subscribed if there's at least one subscription
      } else {
        // Customer not found
        console.log('Customer not found');
        return false;
      }
    } catch (error) {
      console.error('Error checking subscription status:', error);
      throw error;
    }
  }

  useEffect(() => {
    const { data: authListener } =
      supabase.auth.onAuthStateChange(handleAuthChange);
    // Simulate a delay for the loading animation

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchLoggedInUser = async (user: any) => {
    console.log('fetching logged in user', user);

    try {
      // Make a GET request to the API route with the user ID as a query parameter
      const response = await fetch(`/api/getUser`, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ id: user.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();

      if (data) {
        return data;
      } else {
        console.log('No data found for the user');
        return null;
      }
    } catch (error: any) {
      console.error('Error fetching user data:', error.message);
      return null;
    }
  };

  const handleAuthChange = async (event: any, session: any) => {
    console.log('session', session);
    if (event === 'SIGNED_IN' && session !== null) {
      console.log('session', session);
      toast.success('Signed in successfully');
      const loggedInUser = await fetchLoggedInUser(session.user);
      const subbed = await isUserSubscribed(
        session.user.email,
        stripeActivation
      );
      setState({
        ...state,
        session,
        user: session.user,
        loggedInUser: loggedInUser,
        isSubscribed: subbed,
        activeNavButtons: true,
      });

      props.setSignInActive(false);
    } else if (event === 'SIGNED_OUT') {
      console.log('session', event);
      console.log('SignIn Failed');

      toast.error('Sign in failed');
    }
  };
  return (
    <div
      className={`fixed w-full h-full top-0 bottom-0 left-0 right-0     flex m-auto z-[200000000] `}>
      <div
        className="fixed w-full h-full bg-gray-600 opacity-50 top-0 bottom-0 left-0 right-0 z-[20000000]"
        onClick={() => {
          props.setSignInActive(false);
        }}
      />

      <div className="z-[20000001] rounded-2xl fixed max-w-[800px] md:w-2/3 bottom-0 m-auto top-0    left-0 right-0 h-fit pt-8 bg-[#F7F1EE] border-[6px] border-[#7F8019] ">
        <div className="lg:flex-row flex flex-col">
          <div className="flex lg:w-[40%] ">
            <h2 className="uppercase font-sans leading-[60px] p-4 lg:p-10 text-right tracking-[0.3rem] m-auto text-2xl lg:text-4xl">
              Members Login
            </h2>
          </div>
          <div className="flex lg:w-[60%] w-[90%] m-auto ">
            <ToastContainer
              position="bottom-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
            <div className="m-auto w-full">
              <Auth
                supabaseClient={supabase}
                appearance={{
                  style: {
                    button: {
                      width: 'fit-content',
                      maxWidth: '100%',
                      textTransform: 'uppercase',
                      background: '#EB8828',
                      color: 'white',
                      padding: '0.5rem 2rem',
                      borderRadius: '0.375rem',
                      fontFamily: 'sans-serif',
                    },
                    input: {
                      letterSpacing: '0.25rem',
                      // textTransform: 'uppercase',
                      color: '#F7F1EE',
                      background: '#7F8019',
                      borderRadius: '0.375rem',
                      padding: '1rem 0.75rem',
                    },
                    message: {
                      fontSize: '18px',
                      color: '#ff0f0f',
                      margin: '0 0 20px 0',
                    },
                  },
                }}
                localization={{
                  variables: {
                    sign_in: {
                      email_label: '',
                      password_label: '',
                      email_input_placeholder: 'Email address',
                      password_input_placeholder: 'Password',
                      button_label: 'Sign in',
                    },
                    sign_up: {
                      link_text: '',
                    },
                  },
                }}
                providers={[]}
              />
            </div>
          </div>
        </div>
        <div className="bg-[#7F8019]  w-fit m-auto px-4 py-1 rounded-t-xl flex">
          <div className="flex w-fit m-auto gap-2">
            <p className="text-[#F7F1EE]">Don&apos;t have an account?</p>
            <Link
              onClick={() => {
                props.setSignInActive(false);
              }}
              className="font-sans text-sm text-blue-300"
              href="/become-member">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
