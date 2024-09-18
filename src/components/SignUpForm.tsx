"use client";
import { globalStateAtom } from "@/context/atoms";
import { supabaseClient } from "@/utils/supabaseClient";
import { useAtom } from "jotai";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";
import { sanityClient } from "../../sanity/lib/client";

const STEP = {
  ENTER_EMAIL: "ENTER_EMAIL",
  VERIFY_OTP: "VERIFY_OTP",
  CREATE_PASSWORD: "CREATE_PASSWORD",
};

const SignUpForm = () => {
  const [state, setState] = useAtom(globalStateAtom);
  const [currentStep, setCurrentStep] = useState(STEP.ENTER_EMAIL);
  const [email, setEmail] = useState("");
  const router = useRouter();
  const supabase = supabaseClient();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const handleSendOTP = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false },
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Check your email for the verification code");
      setCurrentStep(STEP.VERIFY_OTP);
    }
  };

  const sendOTP = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
      handleSendOTP(e.currentTarget.email.value);
    } else {
      handleSendOTP(email);
    }
  };

  console.log("email", email);

  const verifyOTP = async (e: any) => {
    e.preventDefault();
    const token = e.currentTarget.otp.value as string;

    const { error, data } = await supabase.auth.verifyOtp({
      email,
      token: token,
      type: "email",
    });

    if (error) {
      console.error(error);
      toast.error(error.message);
    } else if (data.session && data.session.user) {
      setCurrentStep(STEP.CREATE_PASSWORD);
    }
  };

  const resetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = e.currentTarget.email.value;
    const password = e.currentTarget.password.value;
    const { error } = await supabase.auth.updateUser({
      password: password,
    });
    if (error) {
      toast.error(error.message);
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (signInError) {
        toast.error(signInError.message);
      } else {
        toast.success("Signed in successfully");
        handleSubscription();
      }
    }
  };

  const handleSubscription = async () => {
    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);
    const response = await fetch("/api/subscription/makeSubscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId: "price_1PMZn5DhCJq1hRSt1v2StcWD" }),
    });

    if (response.ok) {
      const { id: sessionId } = await response.json();
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) console.error("Error redirecting to Checkout:", error);
      }
    } else {
      toast.error("Something went wrong");
    }
  };

  const updateSubscription = async (email: string) => {
    const query = `*[_type == "listing" && userInfo.email == $email][0]`;
    const params = { email: state.loggedInUser.email };
    const document = await sanityClient.fetch(query, params);

    if (document) {
      await sanityClient
        .patch(document._id)
        .set({ ...document, subscribed: true })
        .commit();
      setState((prev) => ({
        ...prev,
        isSubscribed: true,
        activeNavButtons: true,
      }));
    }
  };

  const fetchLoggedInUser = async (user: any) => {
    const response = await fetch(`/api/getUser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ id: user.id }),
    });

    if (response.ok) {
      return await response.json();
    } else {
      console.error("Failed to fetch user data");
      return null;
    }
  };

  useEffect(() => {
    const { data: userData } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("event", event);
        console.log("session", session);
        if (
          [
            "PASSWORD_RECOVERY",
            "SIGNED_IN",
            "INITIAL_SESSION",
            "TOKEN_REFRESHED",
            "USER_UPDATED",
          ].includes(event) &&
          session
        ) {
          console;
          const loggedInUser = await fetchLoggedInUser(session.user);
          console.log("loggedInUser", loggedInUser);
          setEmail(loggedInUser.email);
          setState({
            ...state,
            session,
            user: session.user,
            loggedInUser,
            activeNavButtons: true,
          });
        }
      }
    );
  }, []);

  useEffect(() => {
    if (sessionId) {
      toast.success("Subscribed successfully");
      updateSubscription(state.loggedInUser.email);
      setTimeout(() => router.push("/home"), 2000);
    }
  }, [sessionId]);

  const renderStep = () => {
    switch (currentStep) {
      case STEP.ENTER_EMAIL:
        return (
          <form onSubmit={(e) => sendOTP(e)}>
            <input
              type="email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="border border-gray-200 w-full p-4 h-12"
              value={email}
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-300 w-full text-white my-4 rounded-lg flex h-12 items-center justify-center">
              Continue
            </button>
          </form>
        );
      case STEP.VERIFY_OTP:
        return (
          <form onSubmit={(e) => verifyOTP(e)}>
            <input
              name="otp"
              placeholder="Enter code"
              type="number"
              className="border border-gray-200 rounded-lg w-full p-3"
            />
            <p className="text-one-text-secondary text-center text-sm mb-3 mt-6">
              Didn&lsquo;t get the code?&nbsp;
              <button
                type="button"
                onClick={() => sendOTP()}
                className="text-blue-600 hover:text-blue-300">
                Resend code
              </button>
            </p>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-300 w-full text-white rounded-lg flex h-12 items-center justify-center">
              Continue
            </button>
            <p className="mt-3 text-center">
              <button
                type="button"
                onClick={() => setCurrentStep(STEP.ENTER_EMAIL)}
                className="text-blue-600 hover:text-blue-300 hover:cursor-pointer">
                Change email
              </button>
            </p>
          </form>
        );
      case STEP.CREATE_PASSWORD:
        return (
          <form onSubmit={(e) => resetPassword(e)}>
            <input
              placeholder="Email address"
              disabled
              value={email}
              className="w-full h-12 p-4 text-gray-400"
            />
            <input
              name="password"
              placeholder="Password"
              type="password"
              className="w-full h-12 border border-gray-200 p-4"
            />
            <button
              type="submit"
              className="bg-blue-600 w-full text-white rounded-lg flex h-12 items-center justify-center">
              <span>Create account</span>
            </button>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex lg:max-w-[500px] w-full mx-auto flex-col justify-center pb-9 lg:px-7">
      <Link
        className="flex items-center justify-center text-4xl font-extrabold mb-4 text-[#7F8119]"
        href="/">
        SWOM
      </Link>
      <h1 className="mb-4 text-center text-3xl font-bold md:text-3xl">
        {currentStep === STEP.ENTER_EMAIL && "Sign up with your email."}
        {currentStep === STEP.VERIFY_OTP && "Verify your email."}
        {currentStep === STEP.CREATE_PASSWORD && "Create your password."}
      </h1>
      <p className="mb-12 text-center">
        {currentStep === STEP.VERIFY_OTP &&
          `A verification code has been sent to ${email}`}
        {currentStep === STEP.ENTER_EMAIL &&
          "Be part of our global community and start traveling today!"}
      </p>
      <div className="w-full max-w-[420px] mx-auto">{renderStep()}</div>
    </div>
  );
};

export default SignUpForm;
