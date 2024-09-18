"use client";
import ProfilePicDropZone from "@/components/ProfilePicDropZone";
import { supabaseClient } from "@/utils/supabaseClient";
import Image from "next/image";
import React, { ChangeEvent, use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { sanityClient } from "@/utils/sanityClient";
import ImageUrlBuilder from "@sanity/image-url";
import { useAtom } from "jotai";
import { globalStateAtom } from "@/context/atoms";

type Props = {};

const Page = (props: Props) => {
  const [state, setState] = useAtom(globalStateAtom);
  const [profileImage, setProfileImage] = useState<File[]>([]);
  const [isPasswordChanged, setIsPasswordChanged] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [imageUpload, setImageUpload] = useState(false);
  const supabase = supabaseClient();
  const [isLoading, setIsLoading] = useState(false);
  const [listingData, setListingData] = useState<any>();

  const builder = ImageUrlBuilder(sanityClient);

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
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      emailAddress: "",
      // userName: '',
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handlePasswordChange = (password: any) => {
    setNewPassword(password);
    setIsPasswordChanged(true);
  };

  const handleConfirmPasswordChange = (password: any) => {
    setConfirmPassword(password);
  };

  const comparePasswords = () => {
    if (newPassword === confirmPassword) {
      console.log("passwords match");
      return true;
    } else {
      toast.error("Passwords do not match");
      return false;
    }
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);

    const passwordResults = comparePasswords();
    if (passwordResults && newPassword !== "") {
      setIsPasswordChanged(false);
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) {
        toast.error(error.message);
        setIsLoading(false);
        return;
      } else {
        toast.success("Password updated");
      }
    }

    try {
      const query = `*[_type == "listing" && userInfo.email == $email][0]`;
      const params = { email: state.loggedInUser.email };
      const document = await sanityClient.fetch(query, params);
      const documentId = document._id;
      console.log("documentId", documentId);

      if (profileImage.length > 0) {
        const profileImageAsset = await sanityClient.assets.upload(
          "image",
          profileImage[0]
        );
        console.log("profileImageAsset", profileImageAsset);
        data.profileImage = {
          _type: "image",
          _key: profileImageAsset._id,
          asset: {
            _type: "reference",
            _ref: profileImageAsset._id,
          },
        };
      } else {
        data.profileImage = listingData.userInfo.profileImage;
      }

      console.log("data.profileImage", data.profileImage);

      // Prepare the updated listing data with image references
      const updatedListingData = {
        ...document,
        userInfo: {
          ...document.userInfo,
          profileImage: data.profileImage,
          name: `${data.firstName} ${data.lastName}`,
        },
      };

      const { data: supabaseData, error } = await supabase
        .from("appUsers")
        .update({
          name: `${data.firstName} ${data.lastName}`,
          profileImage: data.profileImage,
        })
        .eq("email", state.loggedInUser.email);

      if (error) {
        console.error("Error updating user:", error);
        toast.error("Failed to update user.");
      }

      console.log("updatedListingData", updatedListingData);

      // Update the listing in Sanity
      await sanityClient
        .patch(documentId) // Replace with your listing ID
        .set(updatedListingData)
        .commit();

      // Handle success
      toast.success("Listing updated successfully!");
      setIsLoading(false);
    } catch (error) {
      console.error("Error uploading images or updating listing:", error);
      toast.error("Failed to update listing.");
      setIsLoading(false);
    }
  };

  const fetchListingData = async () => {
    // const params = { email: state.loggedInUser.email };
    // const listingData = await sanityClient.fetch(query, params);

    // search supabase for the user
    const { data, error } = await supabase
      .from("appUsers")
      .select("id, email, name, profileImage")
      .eq("email", state.loggedInUser.email);

    if (error) {
      console.error("Error fetching listing data:", error);
      return;
    }

    const listingData = data[0];
    if (listingData.profileImage) {
      listingData.profileImage = JSON.parse(listingData.profileImage);
    }

    console.log("listingData", listingData);
    setListingData(listingData);
  };

  useEffect(() => {
    if (listingData) {
      setValue("firstName", listingData.name.split(" ")[0]);
      setValue("lastName", listingData.name.split(" ")[1]);
      setValue("emailAddress", listingData.email);
      // setProfileImage(listingData.profileImage || []);
    }
  }, [listingData]);

  useEffect(() => {
    if (state.loggedInUser) {
      fetchListingData();
    }
  }, [state.loggedInUser]);

  useEffect(() => {
    if (profileImage.length > 0) {
      setImageUpload(false);
    }
  }, [profileImage]);

  return (
    <main className="bg-[#F7F1EE] min-h-[80vh] relative flex flex-col">
      <h1 className="py-4 px-12 bg-[#172544] text-white font-sans tracking-[0.3rem] uppercase">
        My Profile
      </h1>
      <div className="w-full relative max-w-[1000px] my-auto py-12 lg:px-16 px-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex md:flex-row flex-col px-4 relative  z-20 justify-evenly">
          <div className="flex justify-center  flex-col md:w-1/3">
            {imageUpload ? (
              <ProfilePicDropZone
                setProfileImage={setProfileImage}
                setImageUpload={setImageUpload}
              />
            ) : (
              <div className="relative w-[100px] mx-auto mb-4 h-[100px]">
                <Image
                  src={
                    profileImage.length > 0
                      ? URL.createObjectURL(profileImage[0])
                      : (listingData?.profileImage &&
                          urlFor(listingData.profileImage).url()) ||
                        "/placeholder.png"
                  }
                  alt="hero"
                  fill
                  objectPosition="center"
                  // objectFit="cover"
                  className="object-cover rounded-full"
                />
              </div>
            )}

            <h1 className="font-bold mx-auto my-4 tracking-widest text-center uppercase">
              {state?.loggedInUser?.name}
            </h1>
            <button
              type="button"
              onClick={() => {
                setImageUpload(!imageUpload);
              }}
              className="bg-[#172544] py-2 px-4 mx-auto w-fit text-white rounded-3xl">
              {imageUpload ? "Close" : "Update Profile Picture"}
            </button>
          </div>

          <div className="h-auto w-[2px] border-x-[1px] border-[#172544]" />
          <div className="md:w-1/2 flex flex-col  pl-6 gap-12 my-4">
            <h1 className="text-[#D68834] text-2xl font-bold text-center md:text-left tracking-[0.2rem] uppercase ">
              Profile Settings
            </h1>
            <div className="flex flex-col md:flex-row gap-6">
              <div>
                <label
                  className="tracking-widest font-bold uppercase text-sm"
                  htmlFor="">
                  First Name
                </label>
                <input
                  {...register("firstName")}
                  className="w-full focus-visible:outline-none bg-transparent border-b-[1px] border-[#172544]"
                  type="text"
                />
              </div>
              <div>
                <label
                  className="tracking-widest font-bold uppercase text-sm"
                  htmlFor="">
                  Last Name
                </label>
                <input
                  {...register("lastName")}
                  className="w-full focus-visible:outline-none bg-transparent border-b-[1px] border-[#172544]"
                  type="text"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label
                className="tracking-widest font-bold uppercase text-sm"
                htmlFor="">
                Email
              </label>
              <input
                disabled={true}
                {...register("emailAddress")}
                className=" border-b-[1px] focus-visible:outline-none bg-[#bebebe6e] border-[#172544]"
                type="email"
              />
            </div>

            <div className="flex gap-6 md:flex-row flex-col">
              <div className="md:w-1/2 ">
                <div className="">
                  <label
                    className="tracking-widest font-bold uppercase text-sm"
                    htmlFor="">
                    Reset Password
                  </label>
                  <input
                    // no auto fill
                    autoComplete="new-password"
                    onChange={(e) => {
                      handlePasswordChange(e.target.value);
                    }}
                    value={newPassword}
                    className="w-full focus-visible:outline-none bg-transparent border-b-[1px] border-[#172544]"
                    type="password"
                  />
                </div>
              </div>
              {isPasswordChanged && (
                <div className="md:w-1/2">
                  <label
                    className="tracking-widest font-bold uppercase text-sm"
                    htmlFor="">
                    Confirm Password
                  </label>
                  <input
                    autoComplete="w-password"
                    onChange={(e) => {
                      handleConfirmPasswordChange(e.target.value);
                    }}
                    value={confirmPassword}
                    className="w-full focus-visible:outline-none bg-transparent border-b-[1px] border-[#172544]"
                    type="password"
                  />
                </div>
              )}
            </div>

            {isLoading ? (
              <div
                role="status"
                className="bg-[#D68834] hover:bg-[#e88427ca] h-fit w-fit my-auto px-3 py-2 text-white rounded-xl">
                <svg
                  aria-hidden="true"
                  className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-[#e88427ca]"
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
              <button
                type="submit"
                className="w-fit mx-auto font-sans md:mx-0 bg-[#D68834] rounded-3xl px-8 py-2 text-white">
                Update Details
              </button>
            )}
          </div>
        </form>
      </div>
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
      <div className=" md:block hidden  h-[45vh]  w-1/4 z-10 right-0 bottom-0 absolute">
        <Image
          src="/profile/profile-bg.png"
          alt="hero"
          fill
          objectFit="contain"
        />
      </div>
    </main>
  );
};

export default Page;
