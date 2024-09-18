import Image from 'next/image';
import React from 'react';

type Props = {};

const Page = (props: Props) => {
  return (
    <main className="bg-[#F7F1EE]">
      <div className="flex py-8 bg-[#7F8119] justify-center gap-8 align-middle">
        <div className="h-[2px] my-auto w-1/4 border-[1px] border-white" />
        <h1 className="uppercase font-sans text-white text-2xl">About Us</h1>
        <div className="h-[2px] my-auto w-1/4 border-[1px] border-white" />
      </div>

      <div className="flex px-8  flex-col md:flex-row h-[50vh] justify-center m-auto py-4">
        <div className="md:w-1/3 px-4 my-auto">
          <h1 className="inline tracking-[0.1rem] text-center md:text-left font-light font-serif pb-4 text-4xl md:text-5xl">
            &quot;I&apos;ve got a life to <br />{' '}
            <strong className="italic ">start living.</strong>
            &quot;{' '}
          </h1>
          <p className="text-center uppercase tracking-[0.3rem] font-light font-sans pb-4 text-xs">
            - The Holiday (2006)
          </p>
        </div>
        <div className="relative w-full h-full md:w-1/3">
          <Image
            fill
            objectFit="cover"
            className="rounded-2xl"
            src="/about-us/about-1.png"
            alt="hero"
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row h-[70vh] md:h-[50vh] justify-center md:justify-end m-auto py-4">
        <div className="relative order-2  md:w-1/2 lg:w-1/3 -rotate-[4deg] h-full md:-mr-12">
          <Image
            fill
            objectFit="contain"
            src="/about-us/about-2.png"
            alt="hero"
          />
        </div>

        <div className="md:w-[60%] md:order-2 flex flex-col align-middle  p-8">
          <div className="my-auto md:ml-12 max-w-[600px] text-lg  flex flex-col gap-5 text-center">
            <p className="font-sans">
              Traveling has always been our lifestyle. Swapping homes has become
              our way to do so. We wanted to create a community of trust.
              Travelers who are kindred spirits.
            </p>
            <p className="font-sans">
              Paula is a design lover and Ana is tech oriented. We combined both
              worlds into SWOM.
            </p>
            <p className="font-serif text-xl tracking-[0.1rem]">
              Above all, we are friends.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row py-16 w-[80%] justify-evenly align-middle m-auto h-[120vh] md:h-[100vh]">
        <div className="md:w-1/3">
          <h1 className=" text-5xl font-  font-serif tracking-[0.1rem]">
            Why we <br /> created <strong className="italic">SWOM</strong>
          </h1>
          <div className="border my-6 border-black w-full" />
          <p className="font-sans text-left text-lg font-thin">
            We believe in TRUST and we make it our main currency. We celebrate
            other cultures and value cross-cultural understanding.
          </p>
          <p className="font-sans my-4 text-left text-lg font-light">
            We believe that gaining knowledge about other cultures helps us be
            better informed citizens of the world and allows us to come together
            as one human family. We recognize that its important to create
            meaningful relationships with people from all walks of life, and
            that traveling is a way to do so.
          </p>
          <p className="font-sans text-left text-lg font-semibold">
            This is what moves us. Traveling is our way.
          </p>
        </div>

        <div className="md:w-1/2 w-full h-full grid grid-cols-2 grid-rows-4">
          <div className="grid mr-2 row-span-3">
            <div className="relative w-full h-full ">
              <Image
                fill
                className="w-full h-full pb-2 rounded-2xl"
                objectFit="cover"
                objectPosition="top"
                src="/about-us/about-7.png"
                alt=""
              />
            </div>

            <div className="relative w-full h-full  ">
              <Image
                fill
                className="w-full h-full pt-2 rounded-2xl"
                objectFit="cover"
                objectPosition="  right"
                src="/about-us/about-8.png"
                alt=""
              />
            </div>
          </div>

          <div className="grid grid-cols-1 ml-2 row-span-3 grid-rows-4">
            <div className="relative w-full  h-full row-span-3">
              <Image
                fill
                className="w-full h-full pb-2 rounded-2xl"
                objectFit="cover"
                objectPosition="top"
                src="/about-us/about-6.png"
                alt=""
              />
            </div>

            <div className="relative w-full h-full col-span-1 row-span-1">
              <Image
                fill
                className="w-full h-full pt-2 rounded-2xl"
                objectFit="cover"
                objectPosition="center"
                src="/about-us/about-9.png"
                alt=""
              />
            </div>
          </div>

          <div className="relative w-full col-span-2">
            <Image
              fill
              className="w-full h-full pt-4 rounded-2xl"
              objectFit="cover"
              objectPosition="center"
              src="/about-us/about-10.png"
              alt=""
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Page;
