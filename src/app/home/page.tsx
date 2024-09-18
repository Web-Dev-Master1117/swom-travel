import Carousel from "@/components/Carousel";
import Image from "next/image";
import Link from "next/link";
import React, { Suspense } from "react";
import { sanityClient } from "../../../sanity/lib/client";
import { urlForImage } from "../../../sanity/lib/image";

import HomeMapComponent from "@/components/HomeMapComponent";

type Props = {};

const fetchListings = async () => {
  try {
    const query = `
      *[_type == 'highlightedListings']{
        listings[]->{
          _id,
          slug,
          title,
          homeInfo,
          highlightTag,
        }
      }
    `;

    const response = await sanityClient.fetch(query, {}, { cache: "no-store" });
    const data = response[0]?.listings || []; // Ensuring safety with fallback to an empty array

    const updatedData = data.map((listing: any) => ({
      ...listing,
      homeInfo: {
        ...listing.homeInfo,
        firstImage:
          listing.homeInfo && listing.homeInfo.listingImages[0]
            ? urlForImage(listing.homeInfo.listingImages[0])
            : undefined,
      },
    }));

    return updatedData;
  } catch (error) {
    console.error("Error fetching data:", error);
    return []; // Returning an empty array on error
  }
};

const Page = async (props: Props) => {
  const highlightedListings = await fetchListings();

  return (
    <main>
      <div className="">
        <div className="md:h-[calc(92vh-69px)] h-[80vh] bg-black relative w-screen flex">
          <div className="absolute text-[#ffffff] backdrop-blur-[2px] rounded-3xl px-8 lg:px-0 gap-4 flex flex-col text-center max-w-[600px] font-bold w-fit z-50 h-fit top-0 bottom-0 left-0 right-0 m-auto ">
            <h1 className=" uppercase text-4xl lg:text-5xl tracking-widest text-center">
              Make Memories All over the world
            </h1>
            <p className="  w-[85%] mx-auto text-base lg:text-xl">
              Join our community of travelers and swap your home for free. No
              rent, no hidden fees, no hassle.
            </p>
            <div className="flex gap-2 w-fit mx-auto ">
              <button className="bg-[#7F8119] hover:bg-[#6d7016] capitalize px-5 py-2 rounded-xl">
                <Link href="/become-member">Sign Up</Link>
              </button>
              <button className="bg-[#7F8119] capitalize hover:bg-[#6d7016] px-5 py-2 rounded-xl">
                <Link href="/how-it-works">How It Works</Link>
              </button>
            </div>
          </div>
          <Carousel
            images={highlightedListings?.map((listing: any) => ({
              src: listing.homeInfo.firstImage,
              highlightTag: listing.highlightTag,
              slug: listing.slug.current,
              listingNum: listing._id,
            }))}
            thumbnails={false}
            overlay={true}
            homePage={true}
          />
        </div>
        <div className="flex bg-[#7F8119] flex-wrap   md:flex-row py-5  tracking-widest justify-center text-xl gap-2 md:gap-5">
          <p className="!text-[#fff] font-sans">LONDON</p>
          <p className="!text-[#fff] font-sans">•</p>
          <p className="!text-[#fff] font-sans">PARIS</p>
          <p className="!text-[#fff] font-sans">•</p>
          <p className="!text-[#fff] font-sans">NEW YORK</p>
          <p className="!text-[#fff] font-sans">•</p>
          <p className="!text-[#fff] font-sans">VIETNAM</p>
          <p className="!text-[#fff] font-sans">•</p>
          <p className="!text-[#fff] font-sans">COLOMBIA</p>
          <p className="!text-[#fff] font-sans">•</p>
          <p className="!text-[#fff] font-sans">SWITZERLAND</p>
        </div>
      </div>

      <section className="md:h-[50vh] bg-[#F4ECE8] h-fit md:flex-row flex-col  flex px-10 align-middle md:gap-16  md:justify-evenly">
        <div className="md:w-[40%] h-fit md:my-auto my-4">
          <h1 className="text-4xl tracking-wider uppercase">Swom</h1>
          <h2 className="font-thin">(Verb): to swap you home.</h2>
          <p className="mt-6 text-xl">
            Get ready to SWOM your way to a whole new address and a suitcase
            full of memories.
          </p>
        </div>
        <div className="md:w-1/4 md:my-auto my-4 relative h-[200px] ">
          <div className="circle-button">
            <div className="main_circle_text">
              <svg
                viewBox="0 -4 100 100"
                style={{ borderRadius: "50%" }}
                width="200"
                height="200">
                <defs>
                  <path
                    id="circle"
                    d="
                        M 50, 50
                        m -37, 0
                        a 37,37 0 1,1 74,0
                        a 37,37 0 1,1 -74,0"
                  />
                </defs>

                <text>
                  <textPath xlinkHref="#circle">
                    WE CELEBRATE OTHER CULTURES
                  </textPath>
                </text>
              </svg>
            </div>
          </div>
        </div>
      </section>

      <section className="md:h-[45vh]  md:flex-row flex-col justify-evenly flex bg-[#F4ECE8]">
        <div className="md:w-1/2 h-[30vh] md:h-full flex my-auto relative">
          <div className="w-full relative h-full overflow-hidden">
            <div className="absolute z-50 top-[10%] -left-4 text-md ">
              <div className="absolute inset-0 transform skew-x-[-10deg]  bg-[#f4ece7b3]"></div>
              <div className="relative py-4 px-8 text-[#172544]">
                <strong>Listing No. 5704</strong>
              </div>
            </div>
            <Image
              src="/homepage/hero-image-6.png"
              alt="cto image"
              fill
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 gradient-mask"></div>
          </div>
        </div>

        <div className="md:w-1/3 p-4  m-auto">
          <div className="relative justify-center m-auto w-1/2 h-[30px] flex ">
            <Image
              className="m-auto object-contain"
              src="/swom-logo.jpg"
              alt="swom logo"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
              fill></Image>
          </div>
          <div className="w-fit justify-center text-center">
            <p className="">Swap your home</p>

            <p className="my-4">
              Welcome to our members-only community of travelers around the
              globe.{" "}
              <strong>
                Exchange your home for free, for travel, for work, for fun!
              </strong>
            </p>
            <button className="bg-[#172544] text-[#EBDECC] px-4 py-2 rounded-3xl">
              <Link href="/become-member">Become a Member</Link>
            </button>
          </div>
        </div>
      </section>

      <section
        style={{
          backgroundImage: "url(/homepage/explore-bg.png)",
          backgroundSize: "cover",
        }}
        className="md:h-[30vh] py-6  m-auto justify-center  flex flex-col">
        <div className="w-2/3 m-auto justify-center">
          <div className="w-fit ">
            <h1 className="text-4xl font-bold  mb-4">Explore</h1>
          </div>
          <HomeMapComponent />
        </div>
      </section>

      <section className="md:min-h-[1000px] py-6 h-full gap-4 overflow-hidden w-10/12 m-auto justify-center md:grid  flex   flex-col  ">
        <div className="md:grid md:grid-cols-3 gap-4  h-[70%]">
          <div className="sm:grid flex flex-col grid-rows-4 gap-4">
            <div className="row-span-1 text-right">
              <h1 className="text-2xl word-wrap  h-fit">
                THE JOY OF <br /> BEGINNING
              </h1>
            </div>
            <div className="row-span-1">
              <h2 className="text-lg font-sans tracking-widest">
                HOME, SWEET HOME
              </h2>
              <h1 className="text-4xl  font-bold font-sans my-6">
                WE ARE A REVOLUTION IN THE WAY OF TRAVELING
              </h1>
              <p className="text-xl">
                Get ready to gain diverse cultural experiences and broaden your
                perspective on life
              </p>
            </div>
            <div className="relative h-[40vh] md:h-full row-span-3">
              <Image
                src="/homepage/bottom-1.jpg"
                className="object-cover"
                alt="bottom image"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
                fill></Image>
            </div>
          </div>

          <div className="sm:grid  flex flex-col grid-rows-4 gap-4">
            <div className="relative h-[40vh] sm:h-auto row-span-2">
              <Image
                src="/homepage/bottom-2.jpg"
                className="object-cover"
                alt="bottom image"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
                fill></Image>
            </div>
            <div className="relative h-[40vh] md:h-auto row-span-2">
              <Image
                src="/homepage/bottom-3.jpg"
                className="object-cover"
                alt="bottom image"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
                fill></Image>
            </div>
          </div>

          <div className="sm:grid flex flex-col grid-rows-5 gap-4">
            <div className="row-span-1 my-auto">
              <h1 className="text-3xl font-bold font-sans">
                A photo, a <br /> moment a <br /> short story
              </h1>
            </div>

            <div className="relative h-[40vh] md:h-auto  row-span-2">
              <Image
                src="/homepage/bottom-4.jpg"
                className="object-cover"
                alt="bottom image"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
                fill></Image>
            </div>

            <div className="relative h-[40vh] md:h-auto  row-span-2">
              <Image
                src="/homepage/bottom-5.jpg"
                className="object-cover"
                alt="bottom image"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
                fill></Image>
            </div>
          </div>
        </div>

        <div className=" my-4 flex">
          <div className="relative flex-col md:flex-row  w-full py-4  justify-evenly align-middle px-8 m-auto border-l-0 rounded-xl  flex border-2 border-[#7F8119]">
            <h1 className="h-fit m-auto text-2xl md:w-2/3 font-bold font-sans">
              BE PART OF A HARMONIOUS COOPERATIVE GLOBAL COMMUNITY
            </h1>
            <p className="h-fit text-xl m-auto md:w-6/12">
              Opening your home to others fosters your capacity for trust and
              generosity.
            </p>
          </div>

          <div className="relative hidden object-contain lg:flex w-1/3 h-2/3 xl:h-full my-auto">
            <Image
              src="/homepage/bottom-logo.png"
              className="object-contain"
              alt="bottom image"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
              fill></Image>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Page;
