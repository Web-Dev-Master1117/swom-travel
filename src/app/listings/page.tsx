"use client";
import GoogleMapComponent from "@/components/GoogleMapComponent";
import ListingCard from "@/components/ListingCard";
import React, { use, useEffect, useMemo, useState } from "react";
import { useAtom } from "jotai";
import { globalStateAtom } from "@/context/atoms";
import { useSearchParams } from "next/navigation";

type Props = {};

const Page = (props: Props) => {
  const [listings, setListings] = useState<any>([]);
  const [allListings, setAllListings] = useState<any>([]);
  const [whereIsIt, setWhereIsIt] = useState<any>({
    lat: 0,
    lng: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [state, setState] = useAtom(globalStateAtom);
  const [inputValue, setInputValue] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const listingsPerPage = 10;
  const searchParams = useSearchParams();
  const fifteenMin = 1000 * 60 * 15; // 15 minutes
  const totalPages = Math.ceil(allListings.length / listingsPerPage);
  const indexOfLastListing = page * listingsPerPage;
  const indexOfFirstListing = indexOfLastListing - listingsPerPage;
  const currentListings = listings.slice(
    indexOfFirstListing,
    indexOfLastListing
  );

  useEffect(() => {
    const lastFetched = state.allListings.lastFetched;
    const currentTime = new Date().getTime();
    console.log(
      "need to revalidate in:",
      ((fifteenMin - (currentTime - lastFetched)) / 1000 / 60).toFixed(2)
    );

    if (
      currentTime - lastFetched < fifteenMin &&
      state.allListings.listings.length > 0
    ) {
      setTimeout(() => {
        console.log("saved listings", state.allListings.listings);

        setListings(state.allListings.listings);

        setAllListings(state.allListings.listings);
        setIsLoading(false);
      }, 2000);
    } else {
      console.log("fetching listings");
      fetchListings();

      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    }
  }, [state.allListings]);

  useEffect(() => {
    console.log("isloading", isLoading);
  }, [isLoading]);

  useEffect(() => {
    if (searchParams && searchParams.get("lat") && searchParams.get("lng")) {
      setWhereIsIt({
        query: searchParams.get("query") as string,
        lat: parseFloat(searchParams.get("lat") as string),
        lng: parseFloat(searchParams.get("lng") as string),
      });
    }
  }, [searchParams]);

  const searchingParamLocation = async () => {
    if (typeof window !== "undefined" && window.google === undefined) {
      console.log("google not loaded");
      return;
    }
    console.log("searching location", whereIsIt);

    const geocoder = new window.google.maps.Geocoder();

    geocoder.geocode(
      { location: { lat: whereIsIt.lat, lng: whereIsIt.lng } },
      async (results, status) => {
        console.log("results", results);
        if (status === "OK" && results != null) {
          const addressComponents = results[0].address_components;
          const countryComponent = addressComponents.find((component) =>
            component.types.includes("country")
          );
          const country = countryComponent ? countryComponent.long_name : "";
          // Assuming you want to keep the city filter functionality
          const cityComponent = addressComponents.find(
            (component) =>
              component.types.includes("locality") ||
              component.types.includes("administrative_area_level_2") ||
              component.types.includes("administrative_area_level_1")
          );
          console.log("cityComponent", cityComponent);
          const city = cityComponent ? cityComponent.long_name : "";
          setInputValue(city); // If you want to show city name in input
          // Now filter listings by the city or country
          console.log("city", city, "country", country);
          await filteredListings(city.toLowerCase(), country.toLowerCase());
        }
      }
    );
  };

  useEffect(() => {
    setTimeout(() => {
      if (
        (typeof window !== "undefined" && window.google === undefined) ||
        whereIsIt == null ||
        allListings.length === 0
      ) {
        console.log("google not loaded");
        return;
      }
      searchingParamLocation();
      // if whereIsIt is empty, set input value to empty
      if (whereIsIt.lat === 0 && whereIsIt.lng === 0) {
        setInputValue("");
        setListings(allListings);
      }
    }, 1000);
  }, [whereIsIt, allListings]);

  const fetchListings = async (pageNumber = 1) => {
    try {
      const query = `*[_type == "listing" && subscribed == true] | order(orderRank){..., "imageUrl": image.asset->url}`;

      const data = await fetch("/api/getListings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query,
          id: state.loggedInUser.id,
        }),
      });
      const dataJson = await data.json();
      const filteredDataJson = dataJson.filter(
        (listing: any) => !listing._id.includes("drafts")
      );

      setAllListings(filteredDataJson);
      setState((prev: any) => ({
        ...prev,
        allListings: {
          listings: filteredDataJson,
          lastFetched: new Date().getTime(),
        },
      }));
      setListings(filteredDataJson);
      setIsLoading(false);
    } catch (error: any) {
      console.error("Error fetching data:", error.message);
    }
  };

  const filteredListings = async (cityFilter = "", countryFilter = "") => {
    setPage(1);
    let filtered = state.allListings.listings || allListings;
    console.log("filtering", filtered, cityFilter, countryFilter);

    if (cityFilter && filtered.length > 0) {
      filtered = filtered.filter((listing: any) =>
        listing.city.toLowerCase().includes(cityFilter.toLowerCase())
      );

      console.log("city filtered", filtered);
    } else if (countryFilter && filtered.length > 0) {
      filtered = filtered.filter((listing: any) =>
        listing.country.toLowerCase().includes(countryFilter)
      );

      console.log("country filtered", filtered);
    }

    setListings(filtered);
    console.log("filtered listings", filtered);
  };

  return (
    <main className="pt-6  flex   flex-col bg-[#F2E9E7] min-h-screen">
      {isLoading ? (
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
      ) : (
        <>
          <div className="md:w-3/4 w-[90%] h-fit pt-12 pb-4 max-w-[1000px] mx-auto mt-12 mb-4">
            <GoogleMapComponent
              hideMap={
                whereIsIt.lat && whereIsIt.lng && inputValue != ""
                  ? false
                  : true
              }
              whereIsIt={whereIsIt}
              listings={listings}
              setWhereIsIt={setWhereIsIt}
            />
          </div>
          <div className="flex flex-col bg-[#EADEDB]  flex-grow mx-auto w-full mt-8 justify-between">
            <div className={`flex pb-8`}>
              <div
                className={`m-auto  ${
                  whereIsIt.lat && whereIsIt.lng
                    ? "flex flex-col w-fit"
                    : "hidden"
                }`}>
                <p className="text-2xl">Say hello to</p>
                <h2 className="text-3xl capitalize">
                  {whereIsIt.lat && whereIsIt.lng ? inputValue : "the world."}
                </h2>
              </div>
              <h1
                className={`text-3xl m-auto ${
                  whereIsIt.lat && whereIsIt.lng ? "text-right" : "text-center"
                }
            `}>
                Let&apos;s discover your <br /> new adventure.
              </h1>
            </div>
            <div className=" pt-8  flex-grow h-full ">
              {listings.length > 0 && (
                <div className="m-auto gap-4 mb-4 justify-end max-w-[1000px] flex w-full flex-wrap">
                  <button
                    onClick={() => {
                      if (inputValue.length > 0) {
                        filteredListings();
                      } else {
                        setListings(allListings);
                      }
                      setPage(1);
                    }}
                    className=" w-fit hover:bg-[#686926] bg-[#7F8119] text-white px-2 py-1 rounded-md">
                    All Listings
                  </button>
                  {/* favorites */}
                  {listings.filter((listing: any) => listing.favorite === true)
                    .length > 0 && (
                    <button
                      onClick={() => {
                        setListings(
                          listings.filter(
                            (listing: any) => listing.favorite === true
                          )
                        );
                        setPage(1);
                      }}
                      className=" w-fit hover:bg-[#686926] bg-[#7F8119] text-white px-2 py-1 rounded-md">
                      Favorites
                    </button>
                  )}
                </div>
              )}
              <div className="m-auto justify-between max-w-[1000px] flex w-full flex-wrap">
                {listings.length > 0 ? (
                  currentListings?.map((listing: any, index: number) => (
                    <ListingCard
                      setListings={setListings}
                      setAllListings={setAllListings}
                      key={index}
                      listingInfo={listing}
                    />
                  ))
                ) : (
                  <div className="m-auto">
                    <p className="text-xl">No listings found</p>
                  </div>
                )}
              </div>
            </div>
            <div className="my-4">
              {/* pagination functionality  */}
              <div className="flex justify-center gap-4">
                <button
                  type="button"
                  onClick={() => setPage(Math.max(page - 1, 1))}
                  className="hover:bg-[#686926] bg-[#7F8119] text-white px-2 py-1 rounded-md">
                  Prev
                </button>
                {/* current page number */}
                <p className="text-xl">
                  {page}/{totalPages}
                </p>
                <button
                  type="button"
                  className="hover:bg-[#686926] bg-[#7F8119] text-white px-2 py-1 rounded-md"
                  onClick={() => setPage(Math.min(page + 1, totalPages))}>
                  Next
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default Page;
