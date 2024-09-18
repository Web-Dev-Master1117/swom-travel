"use client";
import CarouselPage from "@/components/Carousel";
import GoogleMapComponent from "@/components/GoogleMapComponent";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { set, useForm, Controller } from "react-hook-form";
import { supabaseClient } from "@/utils/supabaseClient";
import ProfilePicDropZone from "@/components/ProfilePicDropZone";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { sanityClient } from "@/utils/sanityClient";
import ImageUrlBuilder from "@sanity/image-url";
import { useAtom } from "jotai";
import { globalStateAtom } from "@/context/atoms";
import ListingCard from "@/components/ListingCard";
import dynamic from "next/dynamic";

const BecomeMemberDropzone = dynamic(
  () => import("@/components/BecomeMemberDropzone"),
  {
    loading: () => <p>Loading...</p>,
  }
);

type Props = {};

const Page = (props: Props) => {
  const [editUserInfo, setEditUserInfo] = useState(false);
  // const [userName, setUserName] = useState('');
  const [state, setState] = useAtom(globalStateAtom);
  const [profileImage, setProfileImage] = useState<File[]>([]);
  const [citySearchOpen, setCitySearchOpen] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const supabase = supabaseClient();
  const [selectedImage, setSelectedImage] = useState(0); // Track selected image
  const aboutYourHomeRef = useRef<HTMLTextAreaElement | null>(null);
  const [aboutYou, setAboutYou] = useState(false);
  const [whereIsIt, setWhereIsIt] = useState<any>(null);
  const [listings, setListings] = useState<any>([]);
  const [downloadedImages, setDownloadedImages] = useState<any>([]);
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cities, setCities] = useState<any>([]);
  const builder = ImageUrlBuilder(sanityClient);
  const [formDirty, setFormDirty] = useState(false);

  const searchParams = useSearchParams();
  const listingId = searchParams.get("listing");

  function urlFor(source: any) {
    return builder.image(source);
  }

  const {
    register,
    handleSubmit,
    getValues,
    control,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty, dirtyFields },
  } = useForm({
    defaultValues: {
      userInfo: {
        profileImage: "",
        name: "",
        // userName: '',
        dob: "",
        email: "",
        phone: "",
        age: 0,
        profession: "",
        about_me: "",
        children: "",
        recommended: "",
        openToOtherCities: {
          cityVisit1: "",
          cityVisit2: "",
          cityVisit3: "",
        },
        openToOtherDestinations: "false",
      },
      homeInfo: {
        title: "",
        address: "",
        description: "",
        listingImages: [],
        property: "",
        howManySleep: 0,
        locatedIn: "",
        city: "",
        mainOrSecond: "",
        bathrooms: 0,
        area: "",
      },

      amenities: {
        bike: false, // Default value for the "bike" radio button
        car: false, // Default value for the "car" radio button
        tv: false, // Default value for the "tv" radio button
        dishwasher: false, // Default value for the "dishwasher" radio button
        pingpong: false, // Default value for the "pingpong" radio button
        billiards: false, // Default value for the "billiards" radio button
        washer: false, // Default value for the "washer" radio button
        dryer: false, // Default value for the "dryer" radio button
        wifi: false, // Default value for the "wifi" radio button
        elevator: false, // Default value for the "elevator" radio button
        terrace: false, // Default value for the "terrace" radio button
        scooter: false, // Default value for the "scooter" radio button
        bbq: false, // Default value for the "bbq" radio button
        computer: false, // Default value for the "computer" radio button
        wcAccess: false, // Default value for the "wcAccess" radio button
        pool: false, // Default value for the "pool" radio button
        playground: false, // Default value for the "playground" radio button
        babyGear: false, // Default value for the "babyGear" radio button
        ac: false, // Default value for the "ac" radio button
        fireplace: false, // Default value for the "fireplace" radio button
        parking: false, // Default value for the "parking" radio button
        hotTub: false, // Default value for the "hotTub" radio button
        sauna: false, // Default value for the "sauna" radio button
        other: false, // Default value for the "other" radio button
        doorman: false, // Default value for the "doorman" radio button
        cleaningService: false, // Default value for the "cleaningService" radio button
        videoGames: false, // Default value for the "videoGames" radio button
        tennisCourt: false, // Default value for the "tennisCourt" radio button
        gym: false,
      },
    },
  });

  const setFormValues = (listing: any) => {
    const dob = new Date(listing.userInfo.dob);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    setValue("userInfo.profession", listing.userInfo.profession);
    if (listing.userInfo.age != null) {
      setValue("userInfo.age", listing.userInfo.age);
    } else {
      setValue("userInfo.age", age);
    }
    setValue("userInfo.name", listing.userInfo.name);

    setValue("userInfo.about_me", listing.userInfo.about_me);
    setValue("userInfo.children", listing.userInfo.children);
    setValue("userInfo.recommended", listing.userInfo.recommended);
    setValue("userInfo.email", listing.userInfo.email);
    setValue("userInfo.phone", listing.userInfo.phone);
    setValue("homeInfo.title", listing.homeInfo.title);
    setValue("homeInfo.address", listing.homeInfo.address);
    setValue("homeInfo.description", listing.homeInfo.description);
    setValue("userInfo.dob", listing.userInfo.dob);
    setValue("homeInfo.description", listing.homeInfo.description);
    setValue("homeInfo.listingImages", listing.homeInfo.listingImages);

    setValue(
      "userInfo.openToOtherCities.cityVisit1",
      listing.userInfo.openToOtherCities.cityVisit1
    );
    setValue(
      "userInfo.openToOtherCities.cityVisit2",
      listing.userInfo.openToOtherCities.cityVisit2
    );
    setValue(
      "userInfo.openToOtherCities.cityVisit3",
      listing.userInfo.openToOtherCities.cityVisit3
    );
    setValue(
      "userInfo.openToOtherDestinations",
      listing.userInfo.openToOtherDestinations
        ? listing.userInfo.openToOtherDestinations.toString()
        : "false"
    );
    setValue("homeInfo.city", listing.homeInfo.city);
    if (listing.homeInfo.city) {
      handleSearch();
    }
    setDownloadedImages(
      listing.homeInfo.listingImages.map((image: any) => {
        return urlFor(image).url();
      })
    );
    setValue("homeInfo.description", listing.homeInfo.description);
    setValue("homeInfo.property", listing.homeInfo.property);
    setValue("homeInfo.howManySleep", listing.homeInfo.howManySleep);
    setValue("homeInfo.locatedIn", listing.homeInfo.locatedIn);
    setValue("homeInfo.mainOrSecond", listing.homeInfo.mainOrSecond);
    setValue("homeInfo.bathrooms", listing.homeInfo.bathrooms);
    setValue("homeInfo.area", listing.homeInfo.area);
    setValue("homeInfo.address", listing.homeInfo.address);

    Object.keys(listings[0].amenities).forEach((amenityKey) => {
      // Set the default value for each amenity using setValue
      // @ts-ignore
      setValue(`amenities.${amenityKey}`, listings[0].amenities[amenityKey]);
    });
    setSearchTerm(listings[0].homeInfo.city);
  };

  useEffect(() => {
    console.log("isDirty", isDirty);
    setFormDirty(isDirty);
  }, [isDirty]);

  useEffect(() => {
    const fetchCities = async () => {
      const query = `*[_type == "city"]`; // Adjust the query to fit your needs
      const data = await sanityClient.fetch(query);
      setCities(data);
    };

    fetchCities();

    const fetchListings = async () => {
      if (state.user && state.user.email) {
        try {
          const loggedInUserEmail = state.user.email;
          const data = await fetch("/api/getListings", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: loggedInUserEmail }),
          }).then((response) => response.json());

          // search through data for the listing that matches the listingId
          if (listingId) {
            const listing = data.filter(
              (listing: any) => listing._id === listingId
            );
            setListings(listing);
            setIsLoaded(true);
          } else {
            setListings(data);
            console.log("sanity listing", data);
            setIsLoaded(true);
          }
        } catch (error: any) {
          console.error("Error fetching data:", error.message);
        }
      }
    };
    fetchListings();
  }, [state.user, listingId]);

  const handleInputChange = (e: any) => {
    const value = e.target.value;
    setSearchTerm(value);
    setValue("homeInfo.city", value);
    setFormDirty(true);
    if (value.length > 0) {
      setCitySearchOpen(true);
    }
  };

  const filteredCities = cities.filter((city: any) => {
    return city.city
      .toLowerCase()
      .includes(searchTerm.split(",")[0].toLowerCase());
  });

  const handleCitySelect = (city: any) => {
    setSelectedCity(city);
    setCitySearchOpen(false);
    setSearchTerm(`${city.city}, ${city.country}`);
    setValue("homeInfo.city", `${city.city}, ${city.country}`);
  };

  const handleSearch = () => {
    const matchedCity = cities.find(
      (city: any) =>
        city.city.toLowerCase() ===
        listings[0].homeInfo.city.split(", ")[0].toLowerCase()
    );
    if (matchedCity) {
      setSelectedCity(matchedCity as any);
    }
  };

  const { ref, ...rest } = register("homeInfo.description");

  useEffect(() => {
    const textarea = aboutYourHomeRef.current;

    // Adjust the textarea's height based on its scrollHeight
    if (textarea) {
      textarea.style.height = "auto"; // Set the starting height
      textarea.style.height = textarea.scrollHeight + "px";

      // Set a maximum height of 300px
      if (textarea.scrollHeight > 300) {
        textarea.style.height = "300px";
        textarea.style.overflowY = "auto";
      } else {
        textarea.style.overflowY = "hidden";
      }
    }
  }, [watch("homeInfo.description")]);

  useEffect(() => {
    if (imageFiles && imageFiles.length > 0) {
      setFormDirty(true);
    }
  }, [imageFiles]);

  useEffect(() => {
    if (listings.length > 0) {
      setFormValues(listings[0]);
    }
  }, [listings]);

  useEffect(() => {
    console.log("whereIsIt", whereIsIt);
    if (whereIsIt) {
      setValue("homeInfo.address", whereIsIt);
      setFormDirty(true);
    }
  }, [whereIsIt]);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);

    console.log("data", data);

    if (profileImage.length > 0) {
      const profileImageAsset = await sanityClient.assets.upload(
        "image",
        profileImage[0]
      );
      data.userInfo.profileImage = {
        _type: "image",
        _key: profileImageAsset._id,
        asset: {
          _type: "reference",
          _ref: profileImageAsset._id,
        },
      };
    } else {
      data.userInfo.profileImage = listings[0].userInfo.profileImage;
    }

    try {
      const query = `*[_type == "listing" && userInfo.email == $email][0]._id`;
      const params = { email: listings[0].userInfo.email };
      const documentId = await sanityClient.fetch(query, params);

      if (imageFiles.length > 0) {
        const uploadPromises = imageFiles.map((file) => {
          return sanityClient.assets.upload("image", file);
        });

        const imageAssets = await Promise.all(uploadPromises);

        console.log("imageAssets", imageAssets);

        // Create references for the uploaded images
        const imageReferences = imageAssets.map((asset) => ({
          _type: "image",
          _key: asset._id,
          asset: {
            _type: "reference",
            _ref: asset._id,
          },
        }));
        data.homeInfo.listingImages = imageReferences;
      } else {
        data.homeInfo.listingImages = listings[0].homeInfo.listingImages;
      }

      // Prepare the updated listing data with image references
      const updatedListingData = {
        ...data,
        userInfo: {
          ...data.userInfo,
          age: parseInt(data.userInfo.age),
          profileImage: data.userInfo.profileImage,
          openToOtherDestinations:
            data.userInfo.openToOtherDestinations === "true",
        },
        homeInfo: {
          ...data.homeInfo,
          listingImages: data.homeInfo.listingImages,
          howManySleep: parseInt(data.homeInfo.howManySleep),
          bathrooms: parseInt(data.homeInfo.bathrooms),
        },
      };

      // Update the listing in Sanity
      await sanityClient
        .patch(documentId) // Replace with your listing ID
        .set(updatedListingData)
        .commit();

      // Handle success
      toast.success("Listing updated successfully!");
      // ... update local state and UI as needed
    } catch (error: any) {
      console.error("Error uploading images or updating listing:", error);
      toast.error("Failed to update listing.", error.message);
    }
    setIsSubmitting(false);
    setFormDirty(false);
  };

  const onError = (errors: any, e: any) => {
    console.log(errors, e);
  };

  if (listings.length > 1) {
    return (
      <div className="bg-[#F7F1EE]  pt-8 h-[calc(100vh-69px)]">
        <div className="h-fit flex mx-auto justify-center max-w-[1000px]">
          {listings.map((listing: any) => (
            <ListingCard
              myListingPage={true}
              listingInfo={listing}
              key={listing._id}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F7F1EE]">
      {isLoaded ? (
        <form
          onSubmit={handleSubmit(onSubmit, onError)}
          className=" max-w-[1200px] mx-auto relative">
          {listingId && (
            <div className="flex">
              <button
                type="button"
                onClick={() => {
                  router.push("/listings/my-listing");
                }}
                className=" my-4 flex gap-2 bg-[#F87C1B] text-white py-2 px-4 rounded-xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6">
                  <path
                    fillRule="evenodd"
                    d="M9.53 2.47a.75.75 0 0 1 0 1.06L4.81 8.25H15a6.75 6.75 0 0 1 0 13.5h-3a.75.75 0 0 1 0-1.5h3a5.25 5.25 0 1 0 0-10.5H4.81l4.72 4.72a.75.75 0 1 1-1.06 1.06l-6-6a.75.75 0 0 1 0-1.06l6-6a.75.75 0 0 1 1.06 0Z"
                    clipRule="evenodd"
                  />
                </svg>
                To My Listings
              </button>
            </div>
          )}

          <div className="py-8  px-8 lg:px-16 flex-col lg:flex-row flex justify-between gap-4">
            <div className="lg:w-[35%] my-4 flex justify-center text-center flex-col">
              {editUserInfo ? (
                <>
                  {profileImage.length > 0 ? (
                    <div className="relative w-[100px] mx-auto mb-4 h-[100px]">
                      <Image
                        src={
                          profileImage.length > 0
                            ? URL.createObjectURL(profileImage[0])
                            : "/placeholder.png"
                        }
                        alt="hero"
                        fill
                        objectPosition="center"
                        // objectFit="cover"
                        className="object-cover rounded-full"
                      />
                    </div>
                  ) : (
                    <ProfilePicDropZone setProfileImage={setProfileImage} />
                  )}
                  <div className="px-4 py-4 flex gap-2 flex-col">
                    <input
                      className="bg-transparent px-4 border-b border-[#172544] focus:outline-none"
                      placeholder="Name"
                      {...register("userInfo.name")}
                    />
                    <input
                      className="bg-transparent px-4 border-b border-[#172544] focus:outline-none"
                      placeholder="Profession"
                      {...register("userInfo.profession")}
                    />

                    {/* save button */}
                    <button
                      type="button"
                      onClick={() => {
                        setEditUserInfo(!editUserInfo);
                      }}>
                      Close
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="relative w-[80px] my-4 mx-auto h-[80px]">
                    <Image
                      src={
                        profileImage.length > 0
                          ? URL.createObjectURL(profileImage[0])
                          : (listings[0]?.userInfo.profileImage &&
                              urlFor(
                                listings[0]?.userInfo.profileImage
                              ).url()) ||
                            "/placeholder.png"
                      }
                      alt="hero"
                      fill
                      objectPosition="center"
                      // objectFit="cover"
                      className="object-cover rounded-full"
                    />
                    <div className="absolute bg-[#F87C1B] rounded-full w-[30px] -right-2 align-middle my-auto flex h-[30px]">
                      <button
                        type="button"
                        onClick={() => {
                          setEditUserInfo(!editUserInfo);
                        }}>
                        <Image
                          fill
                          // objectFit="contain"
                          className="m-auto filter-invert object-contain"
                          src="https://img.icons8.com/ios/50/000000/pencil-tip.png"
                          alt=""
                        />
                      </button>
                    </div>
                  </div>

                  <h1 className="font-serif break-all text-4xl ">
                    {getValues("userInfo.name")}
                  </h1>
                  <h1 className="font-sans my-1 break-all font-bold uppercase tracking-[0.1rem]">
                    {getValues("userInfo.profession")}
                  </h1>
                </>
              )}
            </div>
            <div className="lg:w-[65%]">
              <div className="grid py-2 text-xl text-center grid-cols-4 border-b border-[#172544]">
                <h1>First Name</h1>
                <h1>Last Name</h1>
                <h1>Age</h1>
                <h1>Profession</h1>
              </div>
              <div className="grid py-2 text-center grid-cols-4 border-b border-[#172544]">
                <h1 className="flex-wrap break-all">
                  {getValues("userInfo.name")
                    ? getValues("userInfo.name").split(" ")[0]
                    : "First Name"}
                </h1>
                <h1 className="flex-wrap break-all">
                  {getValues("userInfo.name")
                    ? getValues("userInfo.name").split(" ")[1]
                    : "Last Name"}
                </h1>
                {/* <h1 className="flex-wrap break-all">
                  {userName ? userName.split('@')[0] : 'User Name'}
                </h1> */}
                <h1 className="flex-wrap break-all">
                  {getValues("userInfo.age") > 0
                    ? getValues("userInfo.age")
                    : "Unknown Age"}
                </h1>
                <h1 className="flex-wrap break-all">
                  {getValues("userInfo.profession")
                    ? getValues("userInfo.profession")
                    : "Profession"}
                </h1>
              </div>
              <div className="flex justify-between py-2  border-[#172544]">
                <h1 className="text-xl">About you</h1>

                <button
                  type="button"
                  onClick={() => {
                    setAboutYou(!aboutYou);
                  }}>
                  <div className="relative w-[30px] align-middle my-auto flex h-[30px]">
                    <Image
                      fill
                      // objectFit="contain"
                      className="m-auto object-contain"
                      src="https://img.icons8.com/ios/50/000000/pencil-tip.png"
                      alt=""
                    />
                  </div>
                </button>
              </div>
              {aboutYou ? (
                <div className="flex flex-col">
                  <textarea
                    {...register("userInfo.about_me")}
                    placeholder="Tell us more about you."
                    className="bg-transparent w-full mt-4 p-2 outline-none border-b border-[#c5c5c5]"
                  />
                  <button
                    onClick={() => {
                      setAboutYou(!aboutYou);
                    }}
                    type="button"
                    className="bg-[#FE8217] my-2 mx-auto text-white py-1 px-2 rounded-xl">
                    Save
                  </button>
                </div>
              ) : (
                <p className="my-4">
                  {getValues("userInfo.about_me") ||
                    "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam."}
                </p>
              )}

              <div className="flex flex-col md:flex-row gap-8 py-4 border-y border-[#172544]">
                <h1 className="text-2xl font-serif ">
                  Where would you like to go?
                </h1>

                <div className="gap-4 flex">
                  <input
                    className="w-1/3 h-fit my-auto bg-transparent border-b border-[#172544] focus:outline-none"
                    {...register("userInfo.openToOtherCities.cityVisit1")}
                  />
                  <input
                    className="w-1/3 h-fit my-auto bg-transparent border-b border-[#172544] focus:outline-none"
                    {...register("userInfo.openToOtherCities.cityVisit2")}
                  />
                  <input
                    className="w-1/3 h-fit my-auto bg-transparent border-b border-[#172544] focus:outline-none"
                    {...register("userInfo.openToOtherCities.cityVisit3")}
                  />
                </div>
              </div>

              <div className="flex flex-col justify-between py-4 ">
                <h1 className="text-2xl font-serif ">
                  Open to other destinations?
                </h1>
                <div className="flex my-2">
                  <input
                    className="appearance-none h-fit my-auto bg-transparent checked:bg-[#7F8119] rounded-full border border-[#172544] p-2 mx-2"
                    type="radio"
                    id="yesRadio"
                    value="true"
                    {...register("userInfo.openToOtherDestinations")}
                  />
                  <label htmlFor="yesRadio">Yes</label>

                  <input
                    className="appearance-none ml-4 h-fit my-auto bg-transparent checked:bg-[#7F8119] rounded-full border border-[#172544] p-2 mx-2"
                    type="radio"
                    value="false"
                    id="noRadio"
                    {...register("userInfo.openToOtherDestinations")}
                  />
                  <label htmlFor="noRadio">No</label>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col px-8 md:px-16 m-auto">
            <div className="flex my-4 flex-col md:flex-row border-y border-[#172544] py-4 justify-between">
              <h1 className="text-xl">
                {watch("homeInfo.city") ? getValues("homeInfo.city") : ""}
              </h1>
              <div className="flex gap-2 justify-evenly">
                <div className="relative w-[20px] my-auto h-[20px]">
                  <Image
                    fill
                    // objectFit="contain"
                    className="h-full object-contain"
                    src="/logo-icons.png"
                    alt=""
                  />
                </div>
                <h1 className="text-xl my-auto font-sans">
                  Listing{" "}
                  <span className="font-bold">
                    {state?.user?.id?.slice(-6)}
                  </span>
                </h1>
                <button
                  className="ml-4 bg-[#FE8217] my-auto py-2 px-4 text-white rounded-xl relative"
                  onClick={() => {
                    setState({
                      ...state,
                      imgUploadPopUp: !state.imgUploadPopUp,
                    });
                  }}
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  type="button">
                  {!state.imgUploadPopUp
                    ? "Upload Photos"
                    : "Close Photo Upload"}
                  {showTooltip && state.imgUploadPopUp && (
                    <div className="absolute top-full z-[10] w-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-black text-white text-xs rounded">
                      Press the save button on the bottom to save uploads.
                    </div>
                  )}
                </button>
              </div>
            </div>
            {state.imgUploadPopUp && (
              <div className=" z-10 h-fit w-full bg-white flex m-auto top-0 bottom-0 left-0 right-0">
                <BecomeMemberDropzone
                  imageFiles={imageFiles}
                  downloadURLs={downloadedImages}
                  setImageFiles={setImageFiles}
                />
              </div>
            )}
            <div>
              {imageFiles.length > 0 && !state.imgUploadPopUp && (
                <>
                  <div className="relative w-[95%] mx-auto h-[40vh] md:h-[60vh]">
                    <CarouselPage
                      thumbnails={true}
                      overlay={false}
                      images={imageFiles.map((file) => ({
                        src: URL.createObjectURL(file),
                      }))}
                    />
                  </div>
                </>
              )}
              {downloadedImages?.length > 0 &&
                imageFiles.length == 0 &&
                !state.imgUploadPopUp && (
                  <>
                    <div className="relative w-[95%] mx-auto h-[40vh] md:h-[60vh]">
                      <CarouselPage
                        overlay={false}
                        thumbnails={true}
                        images={
                          downloadedImages.length > 0
                            ? downloadedImages.map((file: any) => ({
                                src: file,
                              }))
                            : [1, 2].map((file) => ({
                                src: "/placeholder.png",
                              }))
                        }
                      />
                    </div>
                  </>
                )}
            </div>

            <div className="flex my-4 border-b border-[#172544] py-4 justify-between">
              <h1 className="text-xl  font-serif">Name of the city</h1>
            </div>

            <div className="w-full relative flex p-2 my-4 rounded-xl border border-[#172544]">
              <input
                className="bg-transparent w-full outline-none"
                type="text"
                placeholder="What's the city?"
                {...register("homeInfo.city")}
                value={searchTerm}
                onChange={handleInputChange}
              />
              <button type="button" onClick={handleSearch}>
                {" "}
                <img
                  className="w-[20px] my-auto h-[20px]"
                  src="/search-icon.svg"
                  alt=""
                />
              </button>

              {filteredCities.length > 0 && citySearchOpen && (
                <ul className="absolute bg-white w-full p-2 top-full left-0 max-h-[200px] overflow-y-scroll">
                  {filteredCities.map((city: any) => (
                    <li
                      key={city._id}
                      onClick={() => handleCitySelect(city)}
                      style={{ cursor: "pointer" }}>
                      {city.city}, {city.country}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {selectedCity != null && filteredCities.length !== 0 && (
              <p className="font-sans text-sm my-6">
                {(selectedCity as { description?: string | undefined })
                  ?.description ?? "No description available"}
              </p>
            )}
            {filteredCities.length === 0 && (
              <p className="font-sans text-sm my-6">No description available</p>
            )}

            <div className="flex my-4  border-y border-[#172544] py-4 justify-between">
              <h1 className="text-xl  font-serif">Tell us about your home</h1>
            </div>

            <textarea
              {...rest}
              name="description"
              ref={(e) => {
                ref(e);
                aboutYourHomeRef.current = e;
              }}
              onChange={(e) => {
                setFormDirty(true);
                setValue("homeInfo.description", e.target.value);
              }}
              value={watch("homeInfo.description")}
              className="w-full h-fit max-h-[300px] my-4 p-2 bg-transparent outline-none border-b border-[#c5c5c5] resize-none"
              placeholder="Villa linda is dolor sit amet, consectetuer adipiscing elit, sed diam
          nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat
          volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation
          ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.
          Duis autem vel eum iriure dolor in hen. Lorem ipsum dolor sit amet,
          consec- tetuer adipiscing elit, sed diam nonummy nibh euismod
          tincidunt ut laoreet dolore magna aliquam erat volutpat."></textarea>

            <div className="px-8 py-4 flex flex-col md:flex-row border rounded-xl my-8 border-[#172544]">
              <div className="flex flex-col text-center justify-center py-2 md:py-0 h-full md:w-1/3 border-b md:border-b-0 md:border-r border-[#172544]">
                <label className="font-bold" htmlFor="property">
                  Type of property*
                </label>

                <select
                  {...register("homeInfo.property")}
                  className="w-fit m-auto bg-transparent outline-none p-2 my-2 rounded-lg border-[#172544] border"
                  id="property">
                  <option value="House">House</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="Farm">Farm</option>
                  <option value="Boat">Boat</option>
                  <option value="RV">RV</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex flex-col text-center justify-center h-full py-2 md:py-0 md:w-1/3 border-b md:border-b-0 md:border-r border-[#172544]">
                <label className="font-bold" htmlFor="howManySleep">
                  Bedrooms
                </label>
                <select
                  className="w-fit m-auto bg-transparent outline-none p-2 my-2 rounded-lg border-[#172544] border"
                  {...register("homeInfo.howManySleep")}
                  id="howManySleep">
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="+8">+8</option>
                </select>
              </div>

              <div className="flex flex-col text-center justify-center h-full border-b  py-2 md:py-0 md:w-1/3 ">
                <label className="font-bold" htmlFor="locatedIn">
                  Property located in
                </label>
                <select
                  className="w-fit m-auto bg-transparent outline-none p-2 my-2 rounded-lg border-[#172544] border"
                  {...register("homeInfo.locatedIn")}
                  id="locatedIn">
                  <option value="a condominium">a condominium</option>
                  <option value="a gated community">a gated community</option>
                  <option value="it rests freely">it rests freely</option>
                  <option value="other">a rural area</option>
                </select>
              </div>
            </div>

            <div className="px-8 py-4 flex flex-col md:flex-row border rounded-xl my-8 border-[#172544]">
              <div className="flex flex-col py-2 md:py-0 text-center justify-center h-full md:w-1/3 border-b md:border-b-0 md:border-r border-[#172544]">
                <label className="font-bold" htmlFor="mainOrSecond">
                  Kind of property
                </label>
                <select
                  className="w-fit m-auto bg-transparent outline-none p-2 my-2 rounded-lg border-[#172544] border"
                  {...register("homeInfo.mainOrSecond")}
                  id="mainOrSecond">
                  <option value="main">Main property </option>
                  <option value="second">Second property</option>
                  {/* <option value="Third">Third property</option> */}
                </select>
              </div>

              <div className="flex flex-col text-center py-2 md:py-0 justify-center h-full border-b md:w-1/3 md:border-b-0 md:border-r border-[#172544]">
                <label className="font-bold" htmlFor="bathrooms">
                  Bathrooms
                </label>
                <select
                  className="w-fit m-auto bg-transparent outline-none p-2 my-2 rounded-lg border-[#172544] border"
                  {...register("homeInfo.bathrooms")}
                  id="bathrooms">
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6+">6+</option>
                </select>
              </div>

              <div className="flex flex-col py-2 md:py-0 text-center justify-center h-full md:w-1/3 ">
                <label className="font-bold" htmlFor="area">
                  Area
                </label>
                <select
                  className="w-fit m-auto bg-transparent outline-none p-2 my-2 rounded-lg border-[#172544] border"
                  {...register("homeInfo.area")}
                  id="area">
                  <option value="60-100">60 - 100 m2</option>
                  <option value="100-150">100 - 150 m2</option>
                  <option value="150-200">150 - 200 m2</option>
                  <option value="200-250">200 - 250 m2</option>
                  <option value="250-300">250 - 300 m2</option>
                  <option value="300-350">300 - 350 m2</option>
                  <option value="350-400">350 - 400 m2</option>
                  <option value="400-450">400 - 450 m2</option>
                  <option value="450-500">450 - 500 m2</option>
                  <option value="500-550">500 - 550 m2</option>
                  <option value="500+">500+ m2</option>
                </select>
              </div>
            </div>
            <div className="flex my-4  border-y border-[#172544] py-4 flex-col">
              <h1 className="text-xl font-serif">Where is it? </h1>
              <p className="font-serif">
                {" "}
                Write down the exact address so google can identify the location
                of your property.
              </p>
            </div>

            <div className={`w-full h-[45vh] my-4 mb-8 rounded-xl`}>
              <GoogleMapComponent
                exactAddress={listings[0]?.homeInfo.address}
                setWhereIsIt={setWhereIsIt}
              />
            </div>

            <div className="flex my-4  border-y border-[#172544] py-4 justify-between">
              <h1 className="text-xl  font-serif">Amenities and advantages</h1>
            </div>

            <div className="flex flex-wrap pb-8">
              <div className="md:w-1/5 w-1/2 gap-2 flex flex-col">
                <div className="flex gap-2">
                  <input
                    className="bg-transparent checked:bg-[#7F8119] appearance-none border border-[#172544] rounded-xl p-[6px] my-auto"
                    type="checkbox"
                    {...register("amenities.bike")}
                    id="bike"
                  />
                  <label className="" htmlFor="bike">
                    Bike
                  </label>
                </div>
                <div className="flex gap-2">
                  <input
                    className="bg-transparent checked:bg-[#7F8119] appearance-none border border-[#172544] rounded-xl p-[6px] my-auto"
                    type="checkbox"
                    {...register("amenities.car")}
                    id="car"
                  />
                  <label className="" htmlFor="car">
                    Car
                  </label>
                </div>

                <div className="flex gap-2">
                  <input
                    className="bg-transparent checked:bg-[#7F8119] appearance-none border border-[#172544] rounded-xl p-[6px] my-auto"
                    type="checkbox"
                    {...register("amenities.tv")}
                    id="tv"
                  />
                  <label className="" htmlFor="tv">
                    TV
                  </label>
                </div>

                <div className="flex gap-2">
                  <input
                    className="bg-transparent checked:bg-[#7F8119] appearance-none border border-[#172544] rounded-xl p-[6px] my-auto"
                    type="checkbox"
                    {...register("amenities.dishwasher")}
                    id="dishwasher"
                  />
                  <label className="" htmlFor="dishwasher">
                    Dishwasher
                  </label>
                </div>

                <div className="flex gap-2">
                  <input
                    className="bg-transparent checked:bg-[#7F8119] appearance-none border border-[#172544] rounded-xl p-[6px] my-auto"
                    type="checkbox"
                    {...register("amenities.pingpong")}
                    id="pingpong"
                  />
                  <label className="" htmlFor="pingpong">
                    Ping pong
                  </label>
                </div>

                <div className="flex gap-2">
                  <input
                    className="bg-transparent checked:bg-[#7F8119] appearance-none border border-[#172544] rounded-xl p-[6px] my-auto"
                    type="checkbox"
                    {...register("amenities.billiards")}
                    id="billiards"
                  />
                  <label className="" htmlFor="billiards">
                    Billiards
                  </label>
                </div>
              </div>

              <div className="md:w-1/5 w-1/2 gap-2 flex flex-col">
                <div className="gap-2 flex">
                  <input
                    className="bg-transparent checked:bg-[#7F8119] appearance-none border border-[#172544] rounded-xl p-[6px] my-auto"
                    type="checkbox"
                    {...register("amenities.washer")}
                    id="washer"
                  />
                  <label className="" htmlFor="washer">
                    Washer
                  </label>
                </div>
                <div className="flex gap-2">
                  <input
                    className="bg-transparent checked:bg-[#7F8119] appearance-none border border-[#172544] rounded-xl p-[6px] my-auto"
                    type="checkbox"
                    {...register("amenities.dryer")}
                    id="dryer"
                  />
                  <label className="" htmlFor="dryer">
                    Dryer
                  </label>
                </div>

                <div className="flex gap-2">
                  <input
                    className="bg-transparent checked:bg-[#7F8119] appearance-none border border-[#172544] rounded-xl p-[6px] my-auto"
                    type="checkbox"
                    {...register("amenities.wifi")}
                    id="wifi"
                  />
                  <label className="" htmlFor="wifi">
                    Wifi
                  </label>
                </div>

                <div className="flex gap-2">
                  <input
                    className="bg-transparent checked:bg-[#7F8119] appearance-none border border-[#172544] rounded-xl p-[6px] my-auto"
                    type="checkbox"
                    {...register("amenities.elevator")}
                    id="elevator"
                  />
                  <label className="" htmlFor="elevator">
                    Elevator
                  </label>
                </div>

                <div className="flex gap-2">
                  <input
                    className="bg-transparent checked:bg-[#7F8119] appearance-none border border-[#172544] rounded-xl p-[6px] my-auto"
                    type="checkbox"
                    {...register("amenities.terrace")}
                    id="terrace"
                  />
                  <label className="" htmlFor="terrace">
                    Terrace
                  </label>
                </div>

                <div className="flex gap-2">
                  <input
                    className="bg-transparent checked:bg-[#7F8119] appearance-none border border-[#172544] rounded-xl p-[6px] my-auto"
                    type="checkbox"
                    {...register("amenities.scooter")}
                    id="scooter"
                  />
                  <label className="" htmlFor="scooter">
                    Scooter
                  </label>
                </div>
              </div>

              <div className="md:w-1/5 w-1/2 gap-2 flex flex-col">
                <div className="flex gap-2">
                  <input
                    className="bg-transparent checked:bg-[#7F8119] appearance-none border border-[#172544] rounded-xl p-[6px] my-auto"
                    type="checkbox"
                    {...register("amenities.bbq")}
                    id="bbq"
                  />
                  <label className="" htmlFor="bbq">
                    BBQ
                  </label>
                </div>
                <div className="flex gap-2">
                  <input
                    className="bg-transparent checked:bg-[#7F8119] appearance-none border border-[#172544] rounded-xl p-[6px] my-auto"
                    type="checkbox"
                    {...register("amenities.computer")}
                    id="computer"
                  />
                  <label className="" htmlFor="computer">
                    Home Computer
                  </label>
                </div>

                <div className="flex gap-2">
                  <input
                    className="bg-transparent checked:bg-[#7F8119] appearance-none border border-[#172544] rounded-xl p-[6px] my-auto"
                    {...register("amenities.wcAccess")}
                    type="checkbox"
                    id="wc"
                  />
                  <label className="" htmlFor="wc">
                    WC Access
                  </label>
                </div>

                <div className="flex gap-2">
                  <input
                    className="bg-transparent checked:bg-[#7F8119] appearance-none border border-[#172544] rounded-xl p-[6px] my-auto"
                    type="checkbox"
                    {...register("amenities.pool")}
                    id="pool"
                  />
                  <label className="" htmlFor="pool">
                    Pool
                  </label>
                </div>

                <div className="flex gap-2">
                  <input
                    className="bg-transparent checked:bg-[#7F8119] appearance-none border border-[#172544] rounded-xl p-[6px] my-auto"
                    type="checkbox"
                    {...register("amenities.playground")}
                    id="playground"
                  />
                  <label className="" htmlFor="playground">
                    Playground
                  </label>
                </div>

                <div className="flex gap-2">
                  <input
                    className="bg-transparent checked:bg-[#7F8119] appearance-none border border-[#172544] rounded-xl p-[6px] my-auto"
                    type="checkbox"
                    {...register("amenities.babyGear")}
                    id="babyGear"
                  />
                  <label className="" htmlFor="babyGear">
                    Baby gear
                  </label>
                </div>
              </div>

              <div className="md:w-1/5 w-1/2 gap-2 flex flex-col">
                <div className="flex gap-2">
                  <input
                    className="bg-transparent checked:bg-[#7F8119] appearance-none border border-[#172544] rounded-xl p-[6px] my-auto"
                    type="checkbox"
                    {...register("amenities.ac")}
                    id="ac"
                  />
                  <label className="" htmlFor="ac">
                    AC
                  </label>
                </div>
                <div className="flex gap-2">
                  <input
                    className="bg-transparent checked:bg-[#7F8119] appearance-none border border-[#172544] rounded-xl p-[6px] my-auto"
                    type="checkbox"
                    {...register("amenities.fireplace")}
                    id="fireplace"
                  />
                  <label className="" htmlFor="fireplace">
                    Fireplace
                  </label>
                </div>

                <div className="flex gap-2">
                  <input
                    className="bg-transparent checked:bg-[#7F8119] appearance-none border border-[#172544] rounded-xl p-[6px] my-auto"
                    type="checkbox"
                    {...register("amenities.parking")}
                    id="parking"
                  />
                  <label className="" htmlFor="parking">
                    Private parking
                  </label>
                </div>

                <div className="flex gap-2">
                  <input
                    className="bg-transparent checked:bg-[#7F8119] appearance-none border border-[#172544] rounded-xl p-[6px] my-auto"
                    type="checkbox"
                    {...register("amenities.hotTub")}
                    id="hotTub"
                  />
                  <label className="" htmlFor="hotTub">
                    Hot tub
                  </label>
                </div>

                <div className="flex gap-2">
                  <input
                    className="bg-transparent checked:bg-[#7F8119] appearance-none border border-[#172544] rounded-xl p-[6px] my-auto"
                    type="checkbox"
                    {...register("amenities.sauna")}
                    id="sauna"
                  />
                  <label className="" htmlFor="sauna">
                    Sauna
                  </label>
                </div>

                <div className="flex gap-2">
                  <input
                    className="bg-transparent checked:bg-[#7F8119] appearance-none border border-[#172544] rounded-xl p-[6px] my-auto"
                    type="checkbox"
                    {...register("amenities.other")}
                    id="other"
                  />
                  <label className="" htmlFor="other">
                    Other...
                  </label>
                </div>
              </div>

              <div className="md:w-1/5 w-1/2 gap-2 flex flex-col">
                <div className="flex gap-2">
                  <input
                    className="bg-transparent checked:bg-[#7F8119] appearance-none border border-[#172544] rounded-xl p-[6px] my-auto"
                    type="checkbox"
                    {...register("amenities.doorman")}
                    id="doorman"
                  />
                  <label className="" htmlFor="doorman">
                    Doorman
                  </label>
                </div>
                <div className="flex gap-2">
                  <input
                    className="bg-transparent checked:bg-[#7F8119] appearance-none border border-[#172544] rounded-xl p-[6px] my-auto"
                    type="checkbox"
                    {...register("amenities.cleaningService")}
                    id="cleaningService"
                  />
                  <label className="" htmlFor="cleaningService">
                    Cleaning service
                  </label>
                </div>

                <div className="flex gap-2">
                  <input
                    className="bg-transparent checked:bg-[#7F8119] appearance-none border border-[#172544] rounded-xl p-[6px] my-auto"
                    type="checkbox"
                    {...register("amenities.videoGames")}
                    id="videoGames"
                  />
                  <label className="" htmlFor="videoGames">
                    Video games
                  </label>
                </div>

                <div className="flex gap-2">
                  <input
                    className="bg-transparent checked:bg-[#7F8119] appearance-none border border-[#172544] rounded-xl p-[6px] my-auto"
                    type="checkbox"
                    {...register("amenities.tennisCourt")}
                    id="tennisCourt"
                  />
                  <label className="" htmlFor="tennisCourt">
                    Tennis court
                  </label>
                </div>

                <div className="flex gap-2">
                  <input
                    className="bg-transparent checked:bg-[#7F8119] appearance-none border border-[#172544] rounded-xl p-[6px] my-auto"
                    type="checkbox"
                    {...register("amenities.gym")}
                    id="gym"
                  />
                  <label className="" htmlFor="gym">
                    Gym
                  </label>
                </div>
              </div>
            </div>

            <div
              className={`${
                formDirty
                  ? "fixed flex text-center justify-center "
                  : "hidden invisible"
              }w-full z-20 justify-center py-2 bottom-0 gap-6 bg-black bg-opacity-30 left-0 right-0`}>
              <button
                type="button"
                onClick={() => {
                  reset();
                  setFormValues(listings[0]);
                  setFormDirty(false);
                }}
                className="uppercase   h-fit rounded-lg w-fit text-white text-base px-4 font-extralight bg-red-500 py-2">
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="uppercase   h-fit rounded-lg w-fit text-white text-base px-4 font-extralight bg-[#F87C1B] py-2">
                {isSubmitting ? (
                  <div
                    role="status"
                    className=" flex m-auto h-fit w-fit my-auto mx-auto px-3 py-2 text-white rounded-xl">
                    <svg
                      aria-hidden="true"
                      className="m-auto w-[20px] h-[20px] text-gray-200 animate-spin dark:text-gray-600 fill-[#7F8119]"
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
                  "Save"
                )}
              </button>
            </div>
          </div>
        </form>
      ) : (
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
      )}

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
    </div>
  );
};

export default Page;
