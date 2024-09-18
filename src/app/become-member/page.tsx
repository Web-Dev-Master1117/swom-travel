"use client";
import { supabaseClient } from "@/utils/supabaseClient";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import generatePassword from "@/utils/generatePassword";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReCAPTCHA from "react-google-recaptcha";
import { sanityClient } from "@/utils/sanityClient";
import dynamic from "next/dynamic";
import GoogleMapComponent from "@/components/GoogleMapComponent";

type Props = {};

type FormValues = {
  name: string;
};

const BecomeMemberDropzone = dynamic(
  () => import("@/components/BecomeMemberDropzone"),
  {
    loading: () => <p>Loading...</p>,
  }
);

const Page = (props: Props) => {
  const [signUpActive, setSignUpActive] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const supabase = supabaseClient();
  const temporaryPassword = generatePassword();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [captchaToken, setCaptchaToken] = useState(false);
  const [whereIsIt, setWhereIsIt] = useState<{
    lat: number;
    lng: number;
    query: string;
  }>({
    query: "",
    lat: 0,
    lng: 0,
  });
  console.log("whereIsIt:", whereIsIt);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      userInfo: {
        name: "",
        dob: "",
        email: "",
        phone: "",
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
        property: "",
        description: "",
        locatedIn: "",
        bathrooms: "",
        area: "",
        mainOrSecond: "",
        address: "",
        city: "",
        howManySleep: "",
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

  const onSubmit = async (data: any) => {
    if (imageFiles.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }
    if (!captchaToken) {
      toast.error("Please complete the captcha");
      return;
    }

    try {
      // Upload Images
      const uploadPromises = imageFiles.map((file) => {
        return sanityClient.assets.upload("image", file);
      });
      const imageAssets = await Promise.all(uploadPromises);
      const imageReferences = imageAssets.map((asset) => ({
        _type: "image",
        _key: asset._id,
        asset: {
          _type: "reference",
          _ref: asset._id,
        },
      }));

      // Prepare New Listing Data
      const newListingData = {
        _type: "needsApproval",
        ...data,
        userInfo: {
          ...data.userInfo,
          openToOtherDestinations:
            data.userInfo.openToOtherDestinations === "true",
        },
        homeInfo: {
          ...data.homeInfo,
          address: whereIsIt,
          city: whereIsIt.query,
          howManySleep: parseInt(data.homeInfo.howManySleep),
          bathrooms: parseInt(data.homeInfo.bathrooms),
          listingImages: imageReferences,
        },
        // ... any other fields you need to include
      };

      // Create the New Listing Document
      const createdListing = await sanityClient.create(newListingData);
      console.log("New listing created:", createdListing);

      // Handle success
      toast.success("New listing created successfully!");
      setSignUpActive(false);
      setSubmitted(true);
      // ... update local state and UI as needed
    } catch (error) {
      console.error("Error creating new listing:", error);
      toast.error("Failed to create new listing.");
    }
  };

  const onError = (errors: any, e: any) => {
    const printErrorMessages = (errorObject: any) => {
      Object.entries(errorObject).forEach(([key, value]: [string, any]) => {
        if (typeof value === "object" && value !== null && !value.message) {
          printErrorMessages(value);
        } else {
          console.log(value.message);
          toast.error(value.message);
        }
      });
    };

    if (errors) {
      printErrorMessages(errors);
    }
  };

  const formatPhoneNumber = (phoneNumber: string) => {
    const cleaned = phoneNumber.replace(/\D/g, "");
    let formattedNumber = "";

    // Determine the length of the country code (1 or 2 digits)
    const countryCodeLength = cleaned.length === 11 ? 1 : 2;

    for (let i = 0; i < cleaned.length; i++) {
      if (i === 0) formattedNumber += "+";
      // Adjust the positions for " (" and ") " based on country code length
      if (i === countryCodeLength) formattedNumber += " (";
      if (i === countryCodeLength + 3) formattedNumber += ") ";
      if (i === countryCodeLength + 6) formattedNumber += "-";

      formattedNumber += cleaned[i];
    }

    return formattedNumber.substring(0, countryCodeLength === 1 ? 16 : 17);
  };

  const handlePhoneInputChange = (e: React.FocusEvent<HTMLInputElement>) => {
    // const formattedNumber = formatPhoneNumber(e.target.value);
    setValue("userInfo.phone", e.target.value);
  };

  return (
    <main className="md:min-h-screen relative flex flex-col">
      <div className="flex w-full relative  bg-[#F3EBE7] md:h-[75vh]">
        <div className="absolute hidden md:block w-[40%] h-full">
          <Image
            objectFit="cover"
            fill
            src="/membership/become-member-bg.png"
            className="rounded-r-[20%]"
            alt=""
          />
        </div>
        <div className="md:w-[60%] text-center justify-center flex flex-col p-8 align-middle h-fit ml-auto my-auto">
          <div className="md:w-2/3 m-auto">
            <div className="w-full m-auto h-[1px] border-[1px] border-black" />
            <h1 className="text-5xl my-6 tracking-[0.2rem]">
              How to become <br /> <span className="italic">a member</span>
            </h1>
            <div className="w-full m-auto h-[1px] border-[1px] border-black" />

            <p className=" m-auto my-8 text-lg">
              Fill out the questionnaire. That is all. This will help us to get
              to know you better. In it, you will be asked questions about your
              property that are easy to answer. It will take you 6 minutes to
              complete. Once we will review your application we will get back to
              you.
            </p>
            <button
              onClick={() => {
                setSignUpActive(true);
              }}
              className="bg-[#E78426] hover:bg-[#e78326d8] text-[#fff] font-bold px-4 py-2 rounded-3xl">
              Apply now
            </button>
          </div>
        </div>
      </div>
      <p className="my-14   m-auto px-8 md:ml-[10vw] justify-center  md:w-[40%]">
        SWOM&apos;s selection process is rigorous and highly selective. All
        applicants must pass a screening process that verifies their
        trustworthiness, reveals their familiarity with family and friends, and
        assesses how well they fit into the design values of the community.{" "}
        <Link className="text-blue-500 w-fit" href={"/terms-conditions"}>
          Read our terms and conditions.
        </Link>
      </p>
      <div className=" hidden md:block h-[45vh]  w-1/4 z-10 right-0 bottom-0 absolute">
        <Image
          src="/profile/profile-bg.png"
          alt="hero"
          fill
          objectFit="contain"
        />
      </div>
      {signUpActive && (
        <div className="">
          <form
            onSubmit={handleSubmit(onSubmit, onError)}
            className=" max-w-[1000px] gap-4 bg-[#F3EBE7] px-4 py-4 flex flex-col  m-auto">
            <div className="flex md:flex-row flex-col gap-4 md:gap-12 w-full md:w-2/3 mx-auto">
              <div className="m-auto flex-col w-full flex">
                <label htmlFor="name">Name</label>
                <input
                  {...register("userInfo.name", {
                    required: "Please enter your name",
                  })}
                  className="w-full bg-transparent border-b border-[#172544] focus:outline-none"
                  type="text"
                  id="name"
                />
              </div>
              <div className="m-auto flex-col w-full flex">
                <label htmlFor="email">Email</label>
                <input
                  {...register("userInfo.email", {
                    required: "Please enter your email",
                  })}
                  className="w-full bg-transparent border-b border-[#172544] focus:outline-none"
                  type="email"
                  id="email"
                />
              </div>
            </div>

            <div className="flex md:flex-row flex-col gap-4 md:gap-12 w-full md:w-2/3 mx-auto">
              <div className="m-auto flex-col md:w-2/3 w-full flex">
                <label htmlFor="phone">Phone</label>
                <input
                  {...register("userInfo.phone", {
                    required: "Please enter your phone number",
                  })}
                  onChange={handlePhoneInputChange}
                  className="w-full bg-transparent border-b border-[#172544] focus:outline-none"
                  type="tel"
                  placeholder="+1 (555) 555-5555"
                  id="phone"
                />
                {errors.userInfo?.phone && (
                  <p>{errors.userInfo.phone.message}</p>
                )}
              </div>
              <div className="m-auto flex-col w-full md:w-2/3 flex">
                <label htmlFor="dob">What is your date of birth?</label>
                <input
                  {...register("userInfo.dob", {
                    required: "Please enter your date of birth",
                  })}
                  className="w-full bg-transparent border-b border-[#172544] focus:outline-none"
                  type="date"
                  id="dob"
                />
              </div>
            </div>

            <div className="m-auto flex-col w-full md:w-2/3 flex">
              <label htmlFor="profession">What do you do for a living?</label>
              <input
                {...register("userInfo.profession", {
                  required: "Please enter your profession",
                })}
                className="w-full bg-transparent border-b border-[#172544] focus:outline-none"
                type="input"
                id="profession"
              />
            </div>

            <div className="m-auto flex-col w-full md:w-2/3 flex">
              <label htmlFor="children">
                Do you travel with small children?
              </label>
              <div className="flex gap-2">
                <input
                  {...register("userInfo.children")}
                  className="bg-transparent checked:bg-[#7F8119] appearance-none border border-[#172544] rounded-xl p-[6px] my-auto"
                  type="radio"
                  value="always"
                  id="always"
                />
                <label htmlFor="always">Always</label>
                <input
                  {...register("userInfo.children")}
                  className="bg-transparent checked:bg-[#7F8119] appearance-none border border-[#172544] rounded-xl p-[6px] my-auto"
                  type="radio"
                  value="sometimes"
                  id="sometimes"
                />
                <label htmlFor="sometimes">Sometimes</label>
                <input
                  {...register("userInfo.children")}
                  className="bg-transparent checked:bg-[#7F8119] appearance-none border border-[#172544] rounded-xl p-[6px] my-auto"
                  type="radio"
                  value="never"
                  id="never"
                />
                <label htmlFor="never">Never</label>
              </div>
            </div>
            <div className="m-auto flex-col md:w-2/3 flex">
              <label htmlFor="recommended">Referred by?</label>
              <div className="flex gap-8 my-2">
                <div className="flex gap-2">
                  <input
                    className="bg-transparent checked:bg-[#7F8119] appearance-none border border-[#172544] rounded-xl p-[6px] my-auto"
                    type="checkbox"
                    id="wikimujeres"
                    onChange={(e) => {
                      if (e.target.checked === true) {
                        setValue("userInfo.recommended", "wikimujeres");
                      } else {
                        setValue("userInfo.recommended", "");
                      }
                    }}
                  />
                  <label htmlFor="wikimujeres" className="font-bold">
                    <Image
                      src="https://wikimujeres.com/wp-content/uploads/2020/10/logo-wikimujeres-MORADO.png"
                      alt="wikimujeres"
                      width={100}
                      height={100}
                    />
                  </label>
                </div>

                <div className="flex gap-2">
                  <label>Other:</label>
                  <input
                    disabled={watch("userInfo.recommended") === "wikimujeres"}
                    {...register("userInfo.recommended")}
                    className="md:w-2/3 bg-transparent border-b border-[#172544] focus:outline-none"
                    type="text"
                    id="recommended"
                  />
                </div>
              </div>
            </div>

            <div className="m-auto gap-4 flex-col md:w-2/3 flex ">
              <label htmlFor="children">
                What kind of property do you have for exchange?
              </label>

              <div className="flex flex-wrap gap-3">
                <div className="gap-2 flex">
                  <input
                    className="w-fit bg-transparent checked:bg-[#7F8119] appearance-none border border-[#172544] rounded-xl p-[6px] my-auto"
                    type="radio"
                    value="House"
                    {...register("homeInfo.property")}
                    id="house"
                  />
                  <label htmlFor="house">House</label>
                </div>
                <div className="gap-2 flex">
                  <input
                    className="w-fit bg-transparent checked:bg-[#7F8119] appearance-none border border-[#172544] rounded-xl p-[6px] my-auto"
                    type="radio"
                    value="Apartment"
                    {...register("homeInfo.property")}
                    id="apartment"
                  />
                  <label htmlFor="Apartment">Apartment</label>
                </div>
                <div className="gap-2 flex">
                  <input
                    className="w-fit bg-transparent checked:bg-[#7F8119] appearance-none border border-[#172544] rounded-xl p-[6px] my-auto"
                    type="radio"
                    value="Villa"
                    {...register("homeInfo.property")}
                    id="villa"
                  />

                  <label htmlFor="villa">Villa</label>
                </div>
                <div className="gap-2 flex">
                  <input
                    className="w-fit bg-transparent checked:bg-[#7F8119] appearance-none border border-[#172544] rounded-xl p-[6px] my-auto"
                    type="radio"
                    value="Farm"
                    {...register("homeInfo.property")}
                    id="farm"
                  />
                  <label htmlFor="farm">Farm</label>
                </div>
                <div className="gap-2 flex">
                  <input
                    className="w-fit bg-transparent checked:bg-[#7F8119] appearance-none border border-[#172544] rounded-xl p-[6px] my-auto"
                    type="radio"
                    value="Boat"
                    {...register("homeInfo.property")}
                    id="boat"
                  />
                  <label htmlFor="boat">Boat</label>
                </div>
                <div className="gap-2 flex">
                  <input
                    {...register("homeInfo.property")}
                    className="w-fit bg-transparent checked:bg-[#7F8119] appearance-none border border-[#172544] rounded-xl p-[6px] my-auto"
                    type="radio"
                    value="RV"
                    id="rv"
                  />
                  <label htmlFor="rv">RV</label>
                </div>
                <div className="gap-2 flex">
                  <input
                    className="w-fit bg-transparent checked:bg-[#7F8119] appearance-none border border-[#172544] rounded-xl p-[6px] my-auto"
                    type="radio"
                    value="Other"
                    {...register("homeInfo.property")}
                    id="otherProperty"
                  />
                  <label htmlFor="otherProperty">Other</label>
                </div>
              </div>
              <div className="flex md:flex-row flex-col gap-4 md:gap-12 w-full mx-auto">
                <div className="m-auto flex-col w-full flex">
                  <label htmlFor="address">
                    What is the city and country where the property is located?
                  </label>
                  <GoogleMapComponent
                    hideMap={true}
                    setWhereIsIt={setWhereIsIt}
                  />
                  {/* <textarea
                    rows={1}
                    id="address"
                    {...register('homeInfo.address', {
                      required: 'Please enter the address of the property',
                    })}
                    className="w-full bg-transparent border-b border-[#172544] focus:outline-none"
                  /> */}
                </div>
              </div>

              <div>
                <label htmlFor="">Is your property located in:</label>
                <div className="flex gap-2 flex-wrap">
                  <div className="flex gap-2">
                    <input
                      className="bg-transparent checked:bg-[#7F8119] appearance-none border border-[#172544] rounded-xl p-[6px] my-auto"
                      type="radio"
                      id="condominium"
                      value="a condominium"
                      {...register("homeInfo.locatedIn", {})}
                    />
                    <label htmlFor="condominium">a condominium</label>
                  </div>
                  <div className="flex gap-2">
                    <input
                      className="bg-transparent checked:bg-[#7F8119] appearance-none border border-[#172544] rounded-xl p-[6px] my-auto"
                      type="radio"
                      id="gated"
                      value="a gated community"
                      {...register("homeInfo.locatedIn")}
                    />
                    <label htmlFor="gated">a gated community</label>
                  </div>
                  <div className="flex gap-2">
                    <input
                      className="bg-transparent checked:bg-[#7F8119] appearance-none border border-[#172544] rounded-xl p-[6px] my-auto"
                      type="radio"
                      id="itRestsFreely"
                      value="it rests freely"
                      {...register("homeInfo.locatedIn")}
                    />
                    <label htmlFor="itRestsFreely">it rests freely</label>
                  </div>
                  <div className="flex gap-2">
                    <input
                      className="bg-transparent checked:bg-[#7F8119] appearance-none border border-[#172544] rounded-xl p-[6px] my-auto"
                      type="radio"
                      id="other"
                      value="other"
                      {...register("homeInfo.locatedIn")}
                    />
                    <label htmlFor="other">other</label>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 md:flex-row flex-col">
                <label htmlFor="">How many people does it sleep?</label>
                <select
                  className="bg-transparent focus:outline-none  rounded-xl border w-fit px-2 border-[#172544]"
                  {...register("homeInfo.howManySleep", {
                    required: "Please select how many people it sleeps",
                  })}
                  id="">
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7+">7+</option>
                </select>
              </div>
              <div className="gap-4 flex md:flex-row flex-col">
                <label htmlFor="">How many bathrooms?</label>
                <select
                  className="bg-transparent focus:outline-none  rounded-xl border w-fit px-2 border-[#172544]"
                  {...register("homeInfo.bathrooms", {
                    required: "Please select how many bathrooms",
                  })}
                  id="">
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4+">4+</option>
                </select>
              </div>
              <div className="gap-4 flex md:flex-row flex-col">
                <label htmlFor="">
                  Is this your main property or your second home?
                </label>
                <select
                  className="bg-transparent focus:outline-none  rounded-xl border w-fit px-2 border-[#172544]"
                  {...register("homeInfo.mainOrSecond", {
                    required:
                      "Please select if this is your main or second home",
                  })}
                  id="">
                  <option value="main">Main</option>
                  <option value="second">Second</option>
                </select>
              </div>
              <div className="gap-4 flex md:flex-row flex-col">
                <label htmlFor="">Size in square meters.</label>
                <select
                  className="bg-transparent focus:outline-none  rounded-xl border w-fit px-2 border-[#172544]"
                  {...register("homeInfo.area", {
                    required: "Please select the size of your home",
                  })}
                  id="">
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
                  <option value="550-600">550 - 600 m2</option>
                </select>
              </div>
              <div>
                <label htmlFor="">Upload some photos.</label>
                <BecomeMemberDropzone
                  imageFiles={imageFiles}
                  setImageFiles={setImageFiles}
                />
              </div>
              <div>
                <label htmlFor="">Give your property a title.</label>
                <input
                  {...register("homeInfo.title", {
                    required: "Please give your listing a title.",
                  })}
                  placeholder="Name of the house, street, or anything distinctive."
                  className="w-full placeholder:text-gray-500 mb-4 bg-transparent border-b border-[#172544] focus:outline-none"
                  type="text"
                  id="title"
                />
                <label htmlFor="">Write a description of the property.</label>
                <textarea
                  id="description"
                  {...register("homeInfo.description", {
                    required: "Please enter a description of your property",
                  })}
                  className="w-full bg-transparent border-b border-[#172544] focus:outline-none"
                />
                <label htmlFor="">
                  Three cities or countries you would visit?
                </label>
                <div className="flex gap-8">
                  <input
                    className="w-1/3 bg-transparent border-b border-[#172544] focus:outline-none"
                    {...register("userInfo.openToOtherCities.cityVisit1")}
                  />
                  <input
                    className="w-1/3 bg-transparent border-b border-[#172544] focus:outline-none"
                    {...register("userInfo.openToOtherCities.cityVisit2")}
                  />
                  <input
                    className="w-1/3 bg-transparent border-b border-[#172544] focus:outline-none"
                    {...register("userInfo.openToOtherCities.cityVisit3")}
                  />
                </div>
                <div className="flex gap-4 mt-4">
                  <label htmlFor="">Are you open to other destinations?</label>
                  <div className="flex gap-2">
                    <input
                      className="bg-transparent checked:bg-[#7F8119] appearance-none border border-[#172544] rounded-xl p-[6px] my-auto"
                      type="radio"
                      value="true"
                      {...register("userInfo.openToOtherDestinations", {
                        required:
                          "Please select if you are open to other destinations",
                      })}
                      id="true"
                    />
                    <label htmlFor="true">Yes</label>
                    <input
                      className="bg-transparent checked:bg-[#7F8119] appearance-none border border-[#172544] rounded-xl p-[6px] my-auto"
                      type="radio"
                      value="false"
                      {...register("userInfo.openToOtherDestinations", {
                        required:
                          "Please select if you are open to other destinations",
                      })}
                      id="false"
                    />
                    <label htmlFor="false">No</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="m-auto flex-col md:w-2/3 flex">
              <label htmlFor="">What amenities does your property have?</label>
            </div>
            <div className="flex md:w-2/3 m-auto flex-wrap pb-8">
              <div className="w-1/3 gap-2 flex flex-col">
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

              <div className="w-1/3 gap-2 flex flex-col">
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

              <div className="w-1/3 gap-2 flex flex-col">
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

              <div className="w-1/3 gap-2 flex flex-col">
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

              <div className="w-1/3 gap-2 flex flex-col">
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
            <div className="flex w-fit m-auto">
              <ReCAPTCHA
                sitekey={
                  process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY || ""
                }
                onChange={() => setCaptchaToken(true)}
              />
            </div>

            <button
              type="submit"
              className="bg-[#E78426] w-fit m-auto hover:bg-[#e78326d8] text-[#fff] font-bold px-4 py-2 rounded-3xl">
              Submit
            </button>
          </form>
        </div>
      )}{" "}
      {submitted && (
        // thank you for your submission, someone will be in touch with you shortly
        <div className="flex flex-col my-8 justify-center items-center">
          <h1 className="text-4xl">Thank you for your submission!</h1>
          <p className="text-lg">Someone will be in touch with you shortly.</p>
        </div>
      )}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </main>
  );
};

export default Page;
