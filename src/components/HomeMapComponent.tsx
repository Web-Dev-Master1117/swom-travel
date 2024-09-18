"use client";
import React, { useState } from "react";
import GoogleMapComponent from "./GoogleMapComponent";
import Link from "next/link";
import { useAtom } from "jotai";
import { globalStateAtom } from "@/context/atoms";

type Props = {};

const HomeMapComponent = (props: Props) => {
  const [whereIsIt, setWhereIsIt] = useState({
    query: "",
    lat: 0,
    lng: 0,
  });
  const [state, setState] = useAtom(globalStateAtom);
  console.log("state", state);
  console.log("whereIsIt", whereIsIt);
  return (
    <div>
      <div className=" w-full flex flex-col justify-center md:flex-row gap-4">
        <div className="w-full">
          <GoogleMapComponent hideMap={true} setWhereIsIt={setWhereIsIt} />
        </div>

        <button
          type="button"
          disabled={whereIsIt.lat === 0 && whereIsIt.lng === 0}
          className={`${
            whereIsIt.lat === 0 && whereIsIt.lng === 0
              ? "cursor-not-allowed"
              : ""
          } bg-[#E88527] rounded-3xl mx-auto md:mx-0 text-white h-fit w-fit py-2 px-8 my-auto`}>
          <Link
            href={
              state.loggedInUser && whereIsIt.lat !== 0 && whereIsIt.lng !== 0
                ? `/listings?query=${encodeURI(whereIsIt.query)}&lat=${
                    whereIsIt.lat
                  }&lng=${whereIsIt.lng}`
                : `/become-member`
            }
            className={`${
              whereIsIt.lat === 0 && whereIsIt.lng === 0
                ? "pointer-events-none"
                : ""
            }`}>
            Search
          </Link>
        </button>
      </div>
    </div>
  );
};

export default HomeMapComponent;
