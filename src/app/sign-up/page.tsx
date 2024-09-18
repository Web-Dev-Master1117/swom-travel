import SignUpForm from "@/components/SignUpForm";
import React from "react";

type Props = {};

const Page = (props: Props) => {
  return (
    <main className="w-full flex flex-col min-h-screen py-12">
      <SignUpForm />
    </main>
  );
};

export default Page;
