'use client';
import CarouselPage from '@/components/Carousel';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import GoogleMapComponent from '@/components/GoogleMapComponent';
import Link from 'next/link';
import { sanityClient } from '@/utils/sanityClient';
import ImageUrlBuilder from '@sanity/image-url';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAtom } from 'jotai';
import { globalStateAtom } from '@/context/atoms';
import { supabaseClient } from '@/utils/supabaseClient';
type Props = {};

const Page = (props: Props) => {
  const pathName = usePathname();
  const slug = pathName.split('/listings/')[1];
  const [state, setState] = useAtom(globalStateAtom);
  const [imageFiles, setImageFiles] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState(0); // Track selected image
  const [isLoading, setIsLoading] = useState(true);
  const [cities, setCities] = useState<any>([]);
  const [mapsActive, setMapsActive] = useState(true);
  const [listings, setListings] = useState<any>([]);
  const [contactedUser, setContactedUser] = useState(null);

  const builder = ImageUrlBuilder(sanityClient);

  function urlFor(source: any) {
    return builder.image(source);
  }

  const supabase = supabaseClient();

  const fetchUserByEmail = async (email: string) => {
    const { data, error } = await supabase
      .from('appUsers')
      .select('id')
      .eq('email', email);

    if (error) {
      console.error('Error fetching user:', error);
    } else {
      return data;
    }
  };


  useEffect(() => {
    const fetchCities = async () => {
      const query = `*[_type == "city"]`; // Adjust the query to fit your needs
      const data = await sanityClient.fetch(query);
      setCities(data);
    };

    fetchCities();

    if (listings.length > 0) {
      const fetchContactedUser = async () => {
        const user = await fetchUserByEmail(listings[0]?.userInfo.email);
        console.log('user', user);
        if (user) {
          setContactedUser(user[0]?.id);
        }
      };
      fetchContactedUser();
    }
  }, [listings]);

  const fetchListings = async () => {
    try {
      const query = `*[_type == "listing" && _id == $slug]{
        ...,
      "imageUrl": image.asset->url
    }`;
      const data = await sanityClient.fetch(query, { slug });

      const userInfo = data[0]?.userInfo;
      const dob = new Date(userInfo?.dob);
      const today = new Date();
      const age =
        today.getFullYear() -
        dob.getFullYear() -
        (today < new Date(today.getFullYear(), dob.getMonth(), dob.getDate())
          ? 1
          : 0);

      console.log('dob', age);

      const updatedData = data.map((item: any) => ({
        ...item,
        userInfo: {
          ...item.userInfo,
          age: age,
        },
      }));

      if (data[0].homeInfo.listingImages) {
        const updatedImages = data[0].homeInfo.listingImages
          .slice(0, 10)
          .map((image: any, index: number) => {
            const imageUrl = urlFor(image).url();
            setImageFiles((prev) => [...prev, imageUrl]);
            return { src: imageUrl, key: index };
          });

        data[0].homeInfo.listingImages = updatedImages;
      }

      console.log('setting profile image');

      if (data[0].userInfo.profileImage !== undefined) {
        const imageUrl = urlFor(data[0]?.userInfo.profileImage).url();
        console.log('imageUrl', imageUrl);
        data[0].userInfo.profileImage.src = imageUrl;
      }

      setListings(updatedData);
      setIsLoading(false);
    } catch (error: any) {
      toast.error('Error fetching data:', error.message);
      console.error('Error fetching data:', error.message);
    }
  };

  const cityDescription = cities.filter((city: any) => {
    return city.city
      .toLowerCase()
      .includes(listings[0]?.homeInfo?.city?.split(',')[0].toLowerCase());
  });

  useEffect(() => {
    fetchListings();
  }, []);

  console.log('listing', listings[0]);

  if (isLoading) {
    return (
      <div
        role="status"
        className=" flex min-h-screen m-auto h-fit w-fit my-auto mx-auto px-3 py-2 text-white rounded-xl">
        <svg
          aria-hidden="true"
          className="m-auto w-[100px] h-[100px] text-gray-200 animate-spin dark:text-gray-600 fill-[#7F8119]"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="#fff"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    );
  } else {
    return (
      <main className="px-[5%] py-[2%] bg-[#F7F1EE] ">
        <div className="max-w-[1200px] mx-auto">
          {/* title section */}
          <div className="m-auto border-y-[1px] py-4 border-[#172544] justify-between flex">
            <h1 className="text-2xl font-thin">
              {listings[0]?.homeInfo?.title} <br />
              <span className="font-bold"> {listings[0]?.homeInfo?.city}</span>
            </h1>
            <div className="relative w-[30px] flex align-middle my-auto object-contain h-[30px]">
              <Image
                fill
                className="h-full m-auto"
                src="/logo-icons.png"
                alt=""
              />
            </div>
          </div>

          {/* Listing Info Above Fold */}
          <div className="flex flex-col md:flex-row my-8 justify-between">
            {/* User Info - Left Section */}
            <div className="md:w-[25%]  flex flex-col">
              {/* <h1 className="font-sans mx-auto mb-8 font-light text-2xl border border-[#172544] py-2 px-8 rounded-xl w-fit">
                Listing{' '}
                <span className="font-bold">
                  {' '}
                  No.{' '}
                  {listings[0]?.listingNumber || listings[0]?._id.slice(0, 5)}
                </span>
              </h1> */}

              <div className="mx-auto text-center">
                <div className="relative m-auto  h-[100px] w-[100px]">
                  <Image
                    fill
                    src={
                      listings[0]?.userInfo?.profileImage?.src
                        ? listings[0]?.userInfo?.profileImage.src
                        : '/placeholder.png'
                    }
                    sizes="100px"
                    priority
                    className="rounded-full object-cover"
                    alt=""
                  />
                </div>
                <h1 className="text-xl">{listings[0]?.userInfo?.name}</h1>
                <p className="font-bold font-sans">
                  {listings[0]?.userInfo?.profession}
                </p>
                <p className="font-sans">
                  {listings[0]?.userInfo?.age
                    ? `${listings[0]?.userInfo?.age} years old`
                    : ''}
                </p>

                {/* Make sure user cant send themselves message from their own listing*/}
                {contactedUser === state?.user?.id ? (
                  <Link
                    href="/profile"
                    className="bg-[#E78426] w-fit hover:bg-[#e78326d8] text-[#fff] mx-auto my-2 px-3 py-1 rounded-xl">
                    Profile
                  </Link>
                ) : (
                  <Link
                    href={`/messages?contactedUser=${contactedUser}&userId=${state?.user?.id}`}
                    className="bg-[#E78426] w-fit hover:bg-[#e78326d8] text-[#fff] mx-auto my-2 px-3 py-1 rounded-xl">
                    Contact me
                  </Link>
                )}
              </div>

              <div className="my-2 break-all">
                <h1 className="font-serif text-xl font-thin border-b border-[#172544] mb-2">
                  About us
                </h1>
                <p className="break-all">{listings[0]?.userInfo?.about_me}</p>
              </div>

              {listings[0]?.userInfo?.citiesToGo && (
                <div className="my-2">
                  <h1 className="font-serif text-xl font-thin border-b border-[#172544] mb-2">
                    We want to go to
                  </h1>
                  <ul>
                    <li>City</li>
                    <li>City</li>
                    <li>City</li>
                  </ul>
                </div>
              )}

              <div className="my-2">
                <h1 className="font-serif text-xl font-thin border-b border-[#172544] mb-2">
                  Open to other destinations
                </h1>
                {listings[0]?.userInfo?.openToOtherCities &&
                  Object.values(
                    listings[0]?.userInfo?.openToOtherCities
                  ).forEach(
                    // @ts-ignore
                    (city: string) => <p key={city}>{city}</p>
                  )}
              </div>
            </div>

            {/* Listing Info - Right Section */}
            <div className="md:w-2/3 flex flex-col">
              {/* <div className="flex flex-col relative h-[40vh] w-full mx-auto">
                  <Image
                    src={
                      imageFiles[selectedImage]
                        ? imageFiles[selectedImage]
                        : '/placeholder.png'
                    }
                    alt=""
                    className="rounded-3xl object-cover "
                    fill
                    sizes="100%"
                    objectPosition="center"
                  />
                </div> */}

              <div className="flex relative  h-[60vh] my-4">
                <CarouselPage
                  overlay={false}
                  thumbnails={true}
                  images={
                    listings[0]?.homeInfo?.listingImages?.length > 0
                      ? listings[0]?.homeInfo?.listingImages
                      : [1, 2, 3].map((file) => ({
                          key: file,
                          src: '/placeholder.png',
                        }))
                  }
                />
              </div>

              <div
                className={`flex gap-4 ${
                  cityDescription[0]?.description ||
                  listings[0]?.homeInfo?.description
                    ? 'flex-col'
                    : 'flex-row'
                } border-t border-[#172544]`}>
                <div
                  className={` mt-4 border-[#172544] ${
                    cityDescription[0]?.description ||
                    listings[0]?.homeInfo?.description
                      ? 'w-full border-b-2 pb-4'
                      : 'w-1/2 border-r-2 '
                  }`}>
                  <h1 className="font-bold text-xl">About the City</h1>
                  <p>
                    {cityDescription[0]?.description ||
                      'No city description available.'}
                  </p>
                </div>
                <div
                  className={`${
                    cityDescription[0]?.description ||
                    listings[0]?.homeInfo?.description
                      ? 'w-full'
                      : 'w-1/2'
                  } mt-4 break-all`}>
                  <h1 className="font-bold text-xl">About my home</h1>
                  <p>
                    {listings[0]?.homeInfo?.description ||
                      'No home description available.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Below the Fold */}
          <div className="py-2 border-y-[1px] border-[#172544]">
            <div className=" border my-8 border-[#172544] rounded-xl grid grid-cols-3 text-center py-8 justify-evenly">
              <div className="border-r border-[#172544]">
                <div className="relative my-1 m-auto w-[40px] h-[40px] object-contain">
                  <Image
                    fill
                    src="/listings/slug/apartments-icon.png"
                    alt=""
                    sizes="40px"
                  />
                </div>
                <h1 className="font-bold">Type of property</h1>
                <p className="capitalize text-base md:text-xl">
                  {listings[0]?.homeInfo?.property}
                </p>
              </div>
              <div className="border-r border-[#172544]">
                <div className="relative my-1 m-auto w-[40px] h-[40px] object-contain">
                  <Image
                    fill
                    src="/listings/slug/bedroom-icon.png"
                    alt=""
                    sizes="40px"
                  />
                </div>
                <h1 className="font-bold">Bedrooms</h1>
                <p className="text-base md:text-xl">
                  {listings[0]?.homeInfo?.howManySleep}
                </p>
              </div>
              <div className="">
                <div className="relative my-1 m-auto w-[40px] h-[40px] object-contain">
                  <Image
                    fill
                    src="/listings/slug/location-icon.png"
                    alt=""
                    sizes="40px"
                  />
                </div>
                <h1 className="font-bold">Property located in</h1>
                <p className="capitalize text-base md:text-xl">
                  {listings[0]?.homeInfo?.locatedIn}
                </p>
              </div>
            </div>

            <div className=" border my-8 border-[#172544] rounded-xl grid grid-cols-3 text-center py-8 justify-evenly">
              <div className="border-r border-[#172544]">
                <div className="relative my-1 m-auto w-[40px] h-[40px] object-contain">
                  <Image
                    fill
                    src="/listings/slug/finger-icon.png"
                    alt=""
                    sizes="40px"
                  />
                </div>
                <h1 className="font-bold">Kind of property</h1>
                <p className="capitalize text-base md:text-xl">
                  {listings[0]?.homeInfo?.mainOrSecond}
                </p>
              </div>
              <div className="border-r border-[#172544]">
                <div className="relative my-1 m-auto w-[40px] object-contain h-[40px]">
                  <Image
                    fill
                    src="/listings/slug/bathroom-icon.png"
                    alt=""
                    sizes="40px"
                  />
                </div>
                <h1 className="font-bold">Bathrooms</h1>
                <p className="text-base md:text-xl">
                  {listings[0]?.homeInfo?.bathrooms}
                </p>
              </div>
              <div className="">
                <div className="relative my-1 m-auto w-[40px] object-contain h-[40px]">
                  <Image
                    fill
                    src="/listings/slug/square-icon.png"
                    alt=""
                    sizes="40px"
                  />
                </div>
                <h1 className="font-bold">Area</h1>
                <p className="text-base md:text-xl">
                  {listings[0]?.homeInfo?.area
                    ? `${listings[0]?.homeInfo?.area} sqm`
                    : ''}
                </p>
              </div>
            </div>
          </div>

          <div className="my-2">
            <button
              onClick={() => {
                console.log('clicked');
                setMapsActive(!mapsActive);
              }}
              className="text-2xl flex justify-between w-full text-left my-4 pb-4 border-b border-[#172544] font-serif">
              <h1>Where is it?</h1>
              {/* arrow down that switches to up when button active */}
              <svg
                className={`w-6 h-6 inline-block ${
                  mapsActive && 'rotate-180 transform'
                }`}
                viewBox="0 0 20 20">
                <path
                  fill="#172544"
                  d="M10 12.586L4.707 7.293a1 1 0 011.414-1.414L10 9.758l4.879-4.879a1 1 0 111.414 1.414L10 12.586z"
                />
              </svg>
            </button>
            <div
              className={`w-full p-4 h-[40vh] ${
                mapsActive ? 'block' : 'hidden'
              }`}>
              <GoogleMapComponent
                exactAddress={listings[0]?.homeInfo?.address}
                noSearch={true}
                radius={300}
              />
            </div>
          </div>

          <div className="mt-14 mb-6">
            <h1 className="text-2xl flex justify-between w-full text-left my-4 py-4 border-y-[1px] border-[#172544] font-serif">
              Amenities & advantages
            </h1>
            <div className="flex gap-[5%]">
              <ul className="grid w-full flex-wrap break-all gap-4 text-center grid-cols-4">
                {listings[0]?.amenities &&
                  Object.entries(listings[0]?.amenities).map(([key, value]) => {
                    if (value === true) {
                      return (
                        <li key={key} className="capitalize text-xl">
                          {key}
                        </li>
                      );
                    }
                    return null;
                  })}
              </ul>
            </div>
          </div>
        </div>
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick={true}
          rtl={false}
          pauseOnFocusLoss={true}
          draggable={true}
          pauseOnHover={true}
        />
      </main>
    );
  }
};

export default Page;
