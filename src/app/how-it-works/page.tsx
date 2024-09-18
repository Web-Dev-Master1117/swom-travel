import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import React from 'react';

type Props = {};

const Page: React.FC<Props> = (props) => {
  return (
    <main
      style={{
        background: '#F7F1EE',
      }}
      className="relative flex flex-col">
      <header className="lg:w-3/4 w-11/12 mx-auto h-[30vh] flex  justify-center  align-middle">
        <div className="h-fit flex flex-col md:flex-row m-auto justify-center gap-10">
          <h1 className="h-fit my-auto text-[#406976] mx-auto md:mx-0 flex font-thin text-xl  md:text-4xl uppercase font-sans tracking-[0.3rem] w-fit ">
            How it works
          </h1>
          <p className="md:w-[45%] text-xl text-[#406976]  h-fit font-sans">
            Members-only community of travelers around the globe. Exchange your
            home for free, for travel, for work, for fun!
          </p>
        </div>
      </header>

      <div className="md:w-11/12 w-full pr-4 my-4 flex flex-col relative py-4  ">
        <div className="border-r-2 border-y-2 relative rounded-r-3xl border-[#7F8119]">
          <div className="absolute h-[200%] z-50  xl:max-h-[70vh] max-h-[60vh] w-1/3 md:w-1/2">
            <Image
              src="/how-it-works/hiw-bg-1.png"
              alt="hero"
              fill
              objectFit="contain"
            />
          </div>
          <div
            className="w-1/2 ml-auto"
            style={{ padding: '26.25% 0 0 0', position: 'relative' }}>
            {/* @ts-ignore */}
            <iframe
              src="https://player.vimeo.com/video/726050137?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
              allow="autoplay; fullscreen; picture-in-picture"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
              }}
              title="SWOM_SWAP YOUR HOME"></iframe>
          </div>
        </div>

        <div className="flex w-full relative gap-4 h-fit">
          <div className="absolute h-[160vh] bottom-0 left-0 top-0 w-full  md:w-[80%]">
            <Image
              src="/how-it-works/bg-line.svg"
              alt="hero"
              fill
              objectPosition="top"
              objectFit="cover"
            />
          </div>
          <div className=" md:w-9/12 mt-20 flex flex-col">
            <h1 className="uppercase text-[#7F8119] leading-[50px] mb-20 tracking-[0.2rem] w-1/2 text-right border-b-2 border-[#7F8119] text-3xl ml-auto">
              Follow these <br />{' '}
              <strong className="text-[#7F8119]">simple steps</strong>{' '}
            </h1>
            <div className="grid pl-[10%]  z-50 h-fit grid-cols-2">
              <div className="col-start-2">
                <h1 className="text-7xl font-bold font-sans">1</h1>
                <p className="text-2xl">
                  Complete a straightforward form to apply, and we&apos;ll reach
                  out to you after reviewing your application.
                </p>
              </div>
              <div className="col-start-1 w-1/2 col-span-2">
                <h1 className="text-7xl font-bold font-sans">2</h1>
                <p className="text-2xl">
                  Upon receiving your username and password, sign in, make the
                  membership payment, and proceed to create your personal
                  profile and listing with just a few straightforward steps.
                </p>
              </div>
              <div className="col-start-2">
                <h1 className="text-7xl font-bold font-sans">3</h1>
                <p className="text-2xl">
                  Explore SWOM homes worldwide, connect with fellow members
                  through the messaging system, and turn your travel dreams into
                  reality.
                </p>
              </div>
              <div className="col-start-1">
                <h1 className="text-7xl font-bold font-sans">4</h1>
                <p className="text-2xl">
                  Finally, once you&apos;ve agreed on dates and exchange
                  details, you&apos;re all set to SWOM!
                </p>
              </div>
            </div>
          </div>
          <div className="w-3/12 md:flex  hidden mt-20 gap-4 min-h-screen  flex-col">
            <div className="relative h-1/3 w-full">
              <Image
                src="/how-it-works/step-image-2.png"
                alt="hero"
                fill
                objectFit="cover"
              />
            </div>
            <div className="relative h-1/3">
              <Image
                src="/how-it-works/step-image-1.png"
                alt="hero"
                fill
                objectFit="cover"
              />
            </div>
            <div className="relative h-1/3">
              <Image
                src="/how-it-works/step-image-3.png"
                alt="hero"
                fill
                objectFit="cover"
              />
            </div>
          </div>
        </div>
        <button className="text-lg z-50 font-bold tracking-wider mt-16 hover:bg-[#7f8119d3] text-white rounded-3xl uppercase px-4 py-2 bg-[#7F8119] w-fit mx-auto">
          <Link href="/become-member">Apply Now</Link>
        </button>
      </div>
      <div className="bg-[#EB8828] flex my-10 mb-20 relative w-2/3 h-fit py-10 rounded-l-3xl ml-auto">
        <div className="absolute h-[120%]  right-full max-h-[50vh]  w-[250px] -top-6 ">
          <Image
            src="/how-it-works/bottom-img.png"
            alt="hero"
            fill
            objectPosition="top"
            objectFit="cover"
          />
        </div>

        <div className="flex flex-col m-auto w-3/4">
          <h1 className="tracking-[0.2rem] font-bold opacity-90 mb-2 text-3xl text-white uppercase">
            We love to help
          </h1>
          <p className="flex-wrap gap-1 flex opacity-80  text-white text-lg ">
            Our team is ready to help in any situation. Whether it is to apply
            or create a profile, rest assured that we will be there every step
            of the way. Contact us{' '}
            <span>
              <Link
                className="text-blue-800"
                href="mailto:info@swom.travel"
                target="_blank"
                rel="noopener noreferrer">
                info@swom.travel
              </Link>
            </span>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Page;
