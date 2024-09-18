'use client';
import { globalStateAtom } from '@/context/atoms';
import { useAtom } from 'jotai';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type Props = {};

const Page = (props: Props) => {
  const [state, setState] = useAtom(globalStateAtom);
  const [subbedInfo, setSubbedInfo] = useState<any>(null);
  const [cancelled, setCancelled] = useState<boolean>(false);
  const router = useRouter();

  const getSubscriptionInfo = async () => {
    const subInfo = await fetch('/api/subscription/getSubscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: state.user.email }),
    });
    const subInfoData = await subInfo.json();
    if (subInfoData) {
      const membershipType =
        subInfoData.current_period_end - subInfoData.current_period_start;
      subInfoData.membershipType =
        // if mebershipType is more than 1 year, then it's a 2 year membership else 1
        membershipType > 31536000 && membershipType <= 31622400
          ? 'One year membership'
          : membershipType > 31622400
          ? 'Twp year membership'
          : 'One year membership';

      const nextPayment = new Date(subInfoData.current_period_end * 1000);
      subInfoData.nextPayment = nextPayment.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      setSubbedInfo(subInfoData);
    }
  };

  const handleCancelMembership = async () => {
    const cancelMembership = await fetch(
      '/api/subscription/cancelSubscription',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscriptionId: subbedInfo.id }),
      }
    );
    const cancelMembershipData = await cancelMembership.json();
    if (cancelMembershipData) {
      setCancelled(true);
      console.log('cancelMembershipData', cancelMembershipData);
      toast.success(
        `Cancelled Membership ends ${new Date(
          cancelMembershipData.cancel_at * 1000
        ).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}`
      );
    } else {
      console.log('cancelMembershipData', cancelMembershipData);
      toast.error('Something went wrong, contact us for more information');
    }
  };

  const handleUpdateMembership = async () => {
    const updateMembership = await fetch('/api/subscription/updateMembership', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: state.user.email }),
    });
    const updateMembershipData = await updateMembership.json();
    if (updateMembershipData) {
      console.log('updateMembershipData', updateMembershipData);
      router.push(updateMembershipData);
    } else {
      console.log('updateMembershipData', updateMembershipData);
      toast.error('Something went wrong, contact us for more information');
    }
  };

  useEffect(() => {
    if (subbedInfo) {
      console.log('subbedInfo', subbedInfo);
    }
  }, [subbedInfo]);

  useEffect(() => {
    if (state.user) {
      getSubscriptionInfo();
    }
  }, [state.user, cancelled]);

  return (
    <main className="flex relative min-h-screen flex-col h-[120vh] sm:h-[100vh] md:h-fit overflow-hidden bg-[#17212D]">
      <div className="relative h-screen w-full">
        <Image
          src="/membership/membership.png"
          alt="hero"
          fill
          objectPosition="bottom"
          objectFit="cover"
        />
      </div>

      <div className="h-[15vh] flex bg-[#17212D] w-full">
        <div className=" w-fit m-auto ">
          <div className="relative w-12 h-12 mx-auto">
            <Image
              src="/membership/swom-blue.png"
              alt="logo"
              fill
              objectFit="cover"
            />
          </div>
          <h2 className="text-2xl font-sans text-center my-4 tracking-[0.3rem] uppercase text-white">
            Traveling to a whole new level
          </h2>
        </div>
      </div>

      <div className="md:w-2/3 max-w-[1000px] w-11/12 z-20 m-auto top-6 md:top-0 md:bottom-0 md:pl-8 p-2 md:px-0  py-4 left-0 right-0 rounded-2xl h-fit scroll-shadows overflow-y-scroll max-h-[70vh] absolute bg-[#F4ECE8]">
        <div className="w-full text-center md:text-left h-fit pb-2 mb-4 border-b-2 border-gray-400">
          <div className="relative w-[250px] h-[80px]">
            <Image src="/swom-logo.jpg" alt="logo" fill objectFit="contain" />
          </div>
          <h1 className="text-2xl font-sans font-bold uppercase tracking-[0.3rem] py-2">
            Memberships
          </h1>
        </div>

        <div>
          <h1 className="text-lg text-center md:text-left text-[#4F6876] uppercase tracking-[0.3rem] mb-8">
            Your Membership
          </h1>
          <div className="flex flex-col md:flex-row gap-4 md:gap-12">
            <div className="p-4 border-[1px] rounded-3xl border-[#6D7283]">
              <h1 className="text-sm uppercase mb-2 tracking-[0.3rem]">
                MEMBERSHIP TYPE
              </h1>
              <p className="text-base ">
                {subbedInfo && subbedInfo?.membershipType}
              </p>
            </div>
            <div className="p-4 border-[1px] rounded-3xl border-[#6D7283]">
              <h1 className="text-sm text-[#E88527] uppercase mb-2 tracking-[0.3rem]">
                {subbedInfo?.cancel_at ? 'Subscription ends' : 'Next Payment'}
              </h1>
              <p className="text-base">
                {subbedInfo?.cancel_at
                  ? new Date(subbedInfo.cancel_at * 1000).toLocaleDateString(
                      'en-US',
                      {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }
                    )
                  : subbedInfo && subbedInfo?.nextPayment}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h1 className="text-lg text-center md:text-left mt-8 text-[#4F6876] uppercase tracking-[0.3rem] mb-4">
            Includes
          </h1>
          <ul className="list-disc pl-4 ">
            <li className="font-light">
              Access to all swom travel listings immediately.
            </li>
            <li className="font-light">
              Being able to contact other members via internal chat at all
              times.
            </li>
            <li className="font-light">
              By clicking on the pay button you agree to automatically change
              the annual or bi-annual subscription.
            </li>
          </ul>
        </div>

        <div className="flex gap-2 flex-wrap justify-center md:justify-start md:gap-8 my-6">
          <button
            type="button"
            disabled={subbedInfo?.cancel_at}
            onClick={() => handleCancelMembership()}
            className={`md:p-4 p-3  rounded-xl text-xs uppercase tracking-[0.3rem] ${
              subbedInfo?.cancel_at
                ? 'bg-[#bb7a3e]'
                : 'bg-[#E88527] hover:bg-[#ff9f45]'
            }  font-bold text-white`}>
            {subbedInfo?.cancel_at
              ? 'Membership Cancelled'
              : 'Cancel Membership'}
          </button>
          <button
            type="button"
            onClick={() => {
              handleUpdateMembership();
            }}
            className="md:p-4 p-3 hover:bg-[#c7bfbe] rounded-xl text-xs uppercase tracking-[0.3rem] bg-[#DDD5D2] font-bold">
            Pay Now
          </button>
        </div>

        <div className="md:w-11/12 ml-auto bg-[#DDD5D2] px-6 p-4 rounded-3xl md:rounded-l-3xl mt-4">
          <h1 className="uppercase font-thin tracking-[0.3rem]">Contact Us!</h1>
          <p className="text-sm flex flex-wrap gap-[3px] font-sans">
            For questions contact us via Whatsapp or email us at{' '}
            <span>
              <Link
                className="text-blue-500"
                href="mailto:info@swom.travel"
                target="_blank"
                rel="noopener noreferrer">
                info@swom.travel
              </Link>
            </span>
          </p>
        </div>
      </div>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnHover={false}
      />
    </main>
  );
};

export default Page;
