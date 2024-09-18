"use client";
import Hotjar from "@hotjar/browser";
import { useEffect } from "react";

const siteId = Number(process.env.NEXT_PUBLIC_HOTJAR_ID);
const hotjarVersion = 6;

const HotjarInit = () => {
  useEffect(() => {
    Hotjar.init(siteId, hotjarVersion);
  }, []);
  return null;
};

export default HotjarInit;
