import React, { useEffect } from 'react';
import CarouselPage from './Carousel';
import Link from 'next/link';
import { supabaseClient } from '@/utils/supabaseClient';
import Image from 'next/image';
import ImageUrlBuilder from '@sanity/image-url';
import { sanityClient } from '../utils/sanityClient';
import { useAtom } from 'jotai';
import { globalStateAtom } from '@/context/atoms';
import { usePathname } from 'next/navigation';

type Props = {
  listingInfo: any;
  setListings?: any;
  setAllListings?: any;
  myListingPage?: boolean;
};

const ListingCard = (props: Props) => {
  const [state, setState] = useAtom(globalStateAtom);
  const supabase = supabaseClient();
  const builder = ImageUrlBuilder(sanityClient);

  function urlFor(source: any) {
    return builder.image(source);
  }

  const handleFavorite = async (listingId: any) => {
    if (state?.loggedInUser?.email) {
      // fetch all liked listings first and then check if the listing is already liked
      const isLiked = props.listingInfo.favorite == true ? true : false;

      const { data: allLiked, error: allLikedError } = await supabase
        .from('appUsers')
        .select('favorites')
        .eq('id', state?.loggedInUser?.id);

      let combinedFavorites = (allLiked && allLiked[0]?.favorites) || [];

      if (isLiked) {
        // If already liked, remove it from the favorites
        combinedFavorites = combinedFavorites.filter(
          (favorite: any) => favorite.listingId !== listingId
        );
        props.setListings((prev: any) => {
          return prev.map((listing: any) => {
            if (listing._id === listingId) {
              return { ...listing, favorite: false };
            }
            return listing;
          });
        });
        setState((prev: any) => {
          return {
            ...prev,
            allListings: {
              ...prev.allListings,
              listings: prev.allListings.listings.map((listing: any) => {
                if (listing._id === listingId) {
                  return { ...listing, favorite: false };
                }
                return listing;
              }),
            },
          };
        });
      } else {
        // If not liked, add it to the favorites
        combinedFavorites = [...combinedFavorites, { listingId: listingId }];
        props.setListings((prev: any) => {
          return prev.map((listing: any) => {
            if (listing._id === listingId) {
              return { ...listing, favorite: true };
            }
            return listing;
          });
        });
      }

      const { data, error } = await supabase
        .from('appUsers')
        .upsert({
          id: state?.loggedInUser?.id,
          favorites: combinedFavorites,
        })
        .eq('id', state?.loggedInUser?.id)
        .select('*');

      if (!error) {
        // Update local state
        props.setListings((prev: any) => {
          return prev.map((listing: any) => {
            if (listing.user_id === listingId) {
              return { ...listing, favorite: !isLiked };
            }
            return listing;
          });
        });
        props.setAllListings((prev: any) => {
          return prev.map((listing: any) => {
            if (listing._id === listingId) {
              return { ...listing, favorite: !isLiked };
            }
            return listing;
          });
        });
        setState((prev: any) => {
          return {
            ...prev,
            allListings: {
              ...prev.allListings,
              listings: prev.allListings.listings.map((listing: any) => {
                if (listing._id === listingId) {
                  return { ...listing, favorite: !isLiked };
                }
                return listing;
              }),
            },
          };
        });
      }
    }
  };

  return (
    <div className="rounded-xl p-[16px] flex-col md:m-2 bg-white relative flex h-auto my-2 m-auto w-[90%] md:w-[45%]">
      <div className="h-[25vh] relative">
        <Link
          href={
            props.listingInfo?.userInfo.email == state?.loggedInUser?.email
              ? !props.myListingPage
                ? `/listings/my-listing`
                : `/listings/my-listing?listing=${props.listingInfo?._id}`
              : `/listings/${props.listingInfo?._id}`
          }>
          <Image
            src={
              props.listingInfo?.homeInfo?.listingImages?.[0]?.asset
                ? urlFor(
                    props.listingInfo?.homeInfo.listingImages[0].asset
                  ).url()
                : '/placeholder.png'
            }
            alt="listing image"
            layout="fill"
            objectFit="cover"
            className="rounded-xl"
          />
        </Link>
      </div>
      <div className="flex-col flex">
        <div className="pt-2 mt-2 flex justify-between align-middle">
          <Link
            href={
              props.listingInfo?.userInfo.email == state?.loggedInUser?.email
                ? `listings/my-listing`
                : `/listings/${props.listingInfo?._id}`
            }
            className="cursor-pointer flex-col flex">
            <h1 className="text-xl">{props.listingInfo?.homeInfo?.title}</h1>
            <p className="">{props.listingInfo?.homeInfo?.city}</p>
          </Link>
          <div className={`flex ${!props.setListings && 'hidden'}`}>
            <button
              onClick={() => {
                handleFavorite(props.listingInfo._id);
              }}>
              <svg
                stroke={
                  props.listingInfo.favorite === true
                    ? '#7F8119'
                    : 'rgb(0, 0, 0)'
                }
                fill={
                  props.listingInfo.favorite === true
                    ? '#7F8119'
                    : 'transparent'
                }
                width="20px"
                height="20px"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path d="M14 20.408c-.492.308-.903.546-1.192.709-.153.086-.308.17-.463.252h-.002a.75.75 0 01-.686 0 16.709 16.709 0 01-.465-.252 31.147 31.147 0 01-4.803-3.34C3.8 15.572 1 12.331 1 8.513 1 5.052 3.829 2.5 6.736 2.5 9.03 2.5 10.881 3.726 12 5.605 13.12 3.726 14.97 2.5 17.264 2.5 20.17 2.5 23 5.052 23 8.514c0 3.818-2.801 7.06-5.389 9.262A31.146 31.146 0 0114 20.408z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
