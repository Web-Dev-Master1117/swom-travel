import React, { Suspense } from 'react';
import Image from 'next/image';
import Loading from '../loading';
import Messages from '@/components/Messages';

type Props = {};

const Page = async ({}) => {
  return (
    <>
      <main className="relative flex w-screen min-h-screen">
        <div className=" absolute w-full h-full">
          <Image
            src="/messages/messages-bg.png"
            alt="messages"
            fill
            objectFit="cover"
          />
        </div>

        <div className="bg-[#F7F1EE]  overflow-auto my-auto h-[80vh] w-full md:w-10/12 sm:rounded-r-2xl lg:rounded-r-[6rem] z-20 relative">
          <Suspense fallback={<Loading />}>
            <Messages />
          </Suspense>
        </div>
      </main>
      <div className="flex z-20 bg-[#17212D] flex-wrap  md:flex-row py-5  tracking-widest justify-center text-xl gap-2 md:gap-5">
        <p className="!text-[#EBDECC]">LONDON</p>
        <p className="!text-[#EBDECC]">•</p>
        <p className="!text-[#EBDECC]">PARIS</p>
        <p className="!text-[#EBDECC]">•</p>
        <p className="!text-[#EBDECC]">NEW YORK</p>
        <p className="!text-[#EBDECC]">•</p>
        <p className="!text-[#EBDECC]">VIETNAM</p>
        <p className="!text-[#EBDECC]">•</p>
        <p className="!text-[#EBDECC]">COLOMBIA</p>
        <p className="!text-[#EBDECC]">•</p>
        <p className="!text-[#EBDECC]">SWITZERLAND</p>
      </div>
    </>
  );
};

export default Page;
