'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

type Props = {};

const Footer = (props: Props) => {
  const [messageContents, setMessageContents] = useState({
    email: '',
    language: 'English',
  });

  const [messageSent, setMessageSent] = useState(false);
  const handleSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch('/api/sendMail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: messageContents.email,
        language: messageContents.language,
      }),
    });

    if (response.ok) {
      setMessageSent(true);

      console.log('Email sent successfully');
    } else {
      console.error('Failed to send email');
    }
  };

  return (
    <div className="md:h-[250px] h-[400px] bg-[#7F8119] md:flex-row flex-col flex justify-center align-middle w-full">
      <div className="md:w-1/2 flex align-middle justify-center gap-4 my-auto  h-1/2">
        <div
          style={{
            filter:
              'invert(98%) sepia(3%) saturate(2%) hue-rotate(304deg) brightness(105%) contrast(100%)',
          }}
          className="relative flex my-auto h-1/2 w-1/3 ">
          <Image
            src="/footer-logo.jpg"
            alt="logo"
            fill
            sizes=" (max-width: 768px) 30vw, (max-width: 1024px) 20vw, 15vw"
            className="object-contain"
          />
        </div>
        <div className=" my-auto border-l-2 px-4 border-white">
          <ul className="text-[#ffffff] gap-1 flex flex-col font-extralight">
            <Link href="/how-it-works">What is Swom</Link>
            <Link href="/become-member">Become a member</Link>
            <Link href="/how-it-works">How it works</Link>
            <Link href="/about-us">About us</Link>
            <Link href="/terms-conditions">Terms & Conditions</Link>
            <Link href="/privacy-policy">Privacy Policy</Link>
          </ul>
          <div>{/* media icons */}</div>
        </div>
      </div>

      <div className="md:w-1/3 w-3/4  m-auto flex flex-col">
        {messageSent ? (
          <p className="text-[#ffffff]">
            Thank you for contacting us. We will get back to you as soon as
            possible.
          </p>
        ) : (
          <form
            onSubmit={(e) => {
              handleSubmission(e);
            }}>
            <p className="text-[#ffffff]">Contact us</p>
            <input
              name="email"
              onChange={(e) => {
                setMessageContents({
                  ...messageContents,
                  email: e.target.value,
                });
              }}
              placeholder="Email"
              className="w-full p-4  rounded-lg my-2 bg-[#ffffff]"
              type="text"
            />
            <select
              name="language"
              onChange={(e) => {
                setMessageContents({
                  ...messageContents,
                  language: e.target.value,
                });
              }}
              className="w-fit p-4 rounded-lg my-1 bg-[#ffffff]"
              id="">
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
            </select>
            <button
              type="submit"
              className="bg-[#ffffff] ml-4 w-fit  p-4 rounded-lg my-1">
              Send
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Footer;
