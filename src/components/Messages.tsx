"use client";
import { globalStateAtom } from "@/context/atoms";
import { supabaseClient } from "@/utils/supabaseClient";
import { useAtom } from "jotai";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { sanityClient } from "../../sanity/lib/client";
import { urlForImage } from "../../sanity/lib/image";

type Props = {};

type Member = {
  id: string;
  name: string;
  email: string;
  profileImage: string;
  listingId: string;
};

type Conversation = {
  created_at: string;
  conversation_id: string;
  members: {
    [key: string]: Member;
  };
};

function getPartnerUserId(
  conversation: Conversation,
  providedUserId: string
): string | null {
  for (const memberId in conversation.members) {
    if (conversation.members[memberId].id !== providedUserId) {
      return conversation.members[memberId].id;
    }
  }
  return null;
}

const Messages = (props: Props) => {
  const queryParams = useSearchParams();
  const contactedUserID = queryParams.get("contactedUser");
  const [partner, setPartner] = useState<string | null>("");
  const [mobileNavMenu, setMobileNavMenu] = useState<boolean>(false);
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState<string>(""); // New state to handle the input message
  const [state, setState] = useAtom(globalStateAtom);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inboxRef = useRef<HTMLDivElement>(null);
  const [sendingMessage, setSendingMessage] = useState<boolean>(false);
  const [isCheckingConversation, setIsCheckingConversation] =
    useState<boolean>(true);
  const supabase = supabaseClient();
  const [selectedConversation, setSelectedConversation] = useState<any>(null);

  let selectedConvo = conversations?.find(
    (convo) => convo.conversation_id === selectedConversation
  );
  let memberIndex = selectedConvo?.members[1].id == state?.user?.id ? 2 : 1;

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchData = async () => {
      if (state.user.id && selectedConversation) {
        console.log("selectedConversation", selectedConversation);
        //fetching here to clear message from read_receipts
        const messagesData = await fetch("/api/messages/fetchMessages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: selectedConversation,
            user: state.user.id,
          }),
        });
      }
    };
    fetchData();
  }, [selectedConversation, messages]);

  useEffect(() => {
    let isMounted = true; // Flag to handle async operation

    const initiateCheck = async () => {
      if (
        state.user !== null &&
        contactedUserID !== null &&
        state.loggedInUser !== null
      ) {
        const convoExist = await checkIfConversationExists();
        // console.log("Convo Exit", convoExist)
        if (convoExist !== false) {
          if (convoExist) {
            // console.log("fetching convo exist");
            fetchAllConversations();
            // console.log("convo exist here", convoExist);
            setSelectedConversation(
              convoExist[0].conversation_id as unknown as number
            );
          }
        } else {
          console.log("creating new conversation");

          createNewConversation();
        }
      }
    };
    initiateCheck();

    return () => {
      isMounted = false; // Cleanup the flag when component unmounts
    };
  }, [state.user, state.loggedInUser]);

  useEffect(() => {
    if (contactedUserID == null) {
      console.log("fetchingAll conversations");
      fetchAllConversations();
    }
  }, [state.user]);

  useEffect(() => {
    // const convoExists = fetchMessagesForSelectedConversation();
    if (!selectedConversation && conversations.length > 0) {
      setSelectedConversation(conversations[0].conversation_id);
      if (selectedConversation) {
        setPartnerId(selectedConversation);
      }
    }
  }, [conversations]);

  useEffect(() => {
    fetchMessagesForSelectedConversation();
    if (selectedConversation) {
      setPartnerId(selectedConversation);
    }
  }, [selectedConversation, sendingMessage]);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
    if (inboxRef.current && conversations.length > 7) {
      inboxRef.current.scrollTop = inboxRef.current.scrollHeight;
    }
  };

  //sets the ID of the person user is communicating with.
  const setPartnerId = async (conversationId: string) => {
    const response = await fetch("/api/messages/getConvo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: conversationId }),
    });

    if (!response.ok) {
      throw new Error(
        `Error fetching conversation data: ${response.statusText}`
      );
    }

    const data = await response.json();
    setPartner(getPartnerUserId(data[0], state.user.id));
    return data;
  };

  const fetchContactedUserInfo = async () => {
    const listings = await fetch("/api/getUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: contactedUserID }),
    });

    const data = await listings.json();
    // console.log("contacted user info", data);

    const profilePic = await sanityClient.fetch(
      `*[_type == "listing" && userInfo.email == $email]`,
      { email: data.email }
    );

    return data;
  };

  const fetchAllConversations = async () => {
    if (state.user !== null) {
      setIsCheckingConversation(true);
      const allConvosData = await fetch("/api/messages/fetchAllConvos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: state.user.id }),
      });

      const allConvosDataJson = await allConvosData.json();
      // i want to pull all the profileImages from the sanity backend that matches the email address for each of the members in the convo
      // then i want to set the profileImage for each member in the convo to the profileImage from the sanity backend
      const profileImages = await sanityClient.fetch(
        `*[_type == "listing" && userInfo.email in $emails]{
          _id,          
          userInfo {
            email,
            profileImage
          }
        }`,
        {
          emails:
            // give me all the emails of the members in the convo
            allConvosDataJson
              .map((convo: any) => [
                convo.members[1].email,
                convo.members[2].email,
              ])
              .flat(),
        }
      );

      // console.log("profileImages", profileImages);

      // now match the profileImages to the members in the convo
      // then set the profileImage for each member in the convo to the profileImage from the sanity backend
      allConvosDataJson.forEach((convo: any) => {
        Object.entries(convo.members).forEach(
          ([key, member]: [string, any]) => {
            // Add type assertion for 'member'
            const profile = profileImages.find(
              (profile: any) => profile.userInfo.email === member.email
            );
            // console.log("profile", profile);
            if (profile && profile.userInfo.profileImage) {
              // Update the convo object directly with the found profile image URL
              member.profileImage = urlForImage(profile.userInfo.profileImage);
              member.listingId = profile._id;
            }
          }
        );
      });

      // console.log('allConvosDataJson2', allConvosDataJson);

      if (allConvosDataJson.length === 0 || !allConvosDataJson) {
        // console.log("allConvosDataJson", allConvosDataJson);
        setConversations([]);
        setIsCheckingConversation(false);
      } else {
        // console.log("allConvosDataJson", allConvosDataJson);
        setConversations(allConvosDataJson);
        if (!contactedUserID) {
          setSelectedConversation(allConvosDataJson[0].conversation_id);
        }
        fetchMessagesForSelectedConversation();
        setIsCheckingConversation(false);
      }
    }
  };

  const fetchMessagesForSelectedConversation = async () => {
    console.log("fetching messages for selected conversation");
    if (selectedConversation !== null) {
      const messagesData = await fetch("/api/messages/fetchMessages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: selectedConversation, user: state.user.id }),
      });
      const messagesDataJson = await messagesData.json();
      // console.log("messagesDataJson", messagesDataJson);

      if (!messagesDataJson[0] || !messagesDataJson[0].messagesObj) {
        console.error("Error fetching messages:", messagesDataJson);
        return false;
      } else {
        setMessages(messagesDataJson[0].messagesObj || []);
        scrollToBottom();
        return true;
      }
    }
  };

  const createNewConversation = async () => {
    if (state.user !== null && state.loggedInUser !== null) {
      setIsCheckingConversation(true);

      const contactedUserInfo = await fetchContactedUserInfo();
      const convoData = await fetch("/api/messages/createConvo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          members: {
            "1": {
              name: state.loggedInUser.name,
              id: state.user.id,
              email: state.loggedInUser.email,
              profileImage: state.loggedInUser.profileImage,
            },
            "2": {
              name: contactedUserInfo.name,
              id: contactedUserInfo.id,
              email: contactedUserInfo?.email,
              profileImage: contactedUserInfo?.profileImage,
            },
          },
        }),
      });

      const convoDataJson = await convoData.json();

      if (
        convoDataJson.length === 0 ||
        !convoDataJson ||
        convoDataJson == "null"
      ) {
        setIsCheckingConversation(false);
        return console.error("Error creating new conversation:", convoDataJson);
      } else {
        // console.log("new convo data", convoDataJson);

        fetchAllConversations();
        setSelectedConversation(
          convoDataJson.data.convoData[0].conversation_id
        );
        setIsCheckingConversation(false);
        scrollToBottom();
      }
    }
  };

  const checkIfConversationExists = async () => {
    if (state.user !== null && contactedUserID !== null) {
      const checkConvoData = await fetch("/api/messages/checkConvoExists", {
        body: JSON.stringify({
          1: { id: state.user.id },
          2: { id: contactedUserID },
        }),
        method: "POST",
      });

      const checkConvoExistData = await checkConvoData.json();

      // console.log("checkConvoExistData", checkConvoExistData);

      if (
        checkConvoExistData.length === 0 ||
        !checkConvoExistData ||
        checkConvoExistData == "null"
      ) {
        return false;
      } else {
        console.log("setting selected conversation");
        return checkConvoExistData;
      }
    }
  };

  useEffect(() => {
    console.log("subscribing to messages");

    const subscription = supabase
      .channel(`${selectedConversation}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${selectedConversation}`,
        },
        (payload) => {
          setMessages((payload.new as { [key: string]: any }).messagesObj);
        }
      )
      .subscribe((status) => {
        console.log({ status });
      });

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [selectedConversation]);

  const sendMessage = async () => {
    // console.log("sending message", selectedConversation, newMessage);
    await setPartnerId(selectedConversation);
    if (selectedConversation !== null && newMessage.trim() !== "") {
      setSendingMessage(true);
      // Perform the upsert with the updated messages
      const sendMessageData = await fetch("/api/messages/sendMessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversation_id: selectedConversation,
          selectedConversation: selectedConversation,
          sender_id: state.user.id,
          content: newMessage,
          contacted_user: partner,
        }),
      });

      if (!sendMessageData.ok) {
        throw new Error(`HTTP error! status: ${sendMessageData.status}`);
      }
      const sendMessageDataJson = await sendMessageData.json();

      if (!sendMessageDataJson) {
        console.error("Error sending message:", sendMessageDataJson);
      } else {
        setNewMessage(""); // Clear the input field after sending the message
        setSendingMessage(false);
      }
    }
  };

  if (isCheckingConversation) {
    return (
      <div
        role="status"
        className=" flex m-auto h-full align-middle w-fit my-auto mx-auto px-3 py-2 text-white rounded-xl">
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
  }

  return conversations.length > 0 ? (
    <>
      <div className="relative flex w-full">
        <button
          type="button"
          onClick={() => setMobileNavMenu(!mobileNavMenu)}
          className="absolute top-0 h-fit w-fit bottom-0 m-auto left-auto right-5 md:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-[#172544] hover:text-[#E88527]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                mobileNavMenu
                  ? "M6 18L18 6M6 6l12 12"
                  : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>
        <h1 className="tracking-[0.3rem] font-bold w-full uppercase text-3xl bg-[#E5DEDB] py-6 px-6">
          Messages
        </h1>
      </div>
      <div className="flex h-[85%]">
        <div
          ref={inboxRef}
          className={`h-full overflow-y-auto py-2 transition-all duration-200 ease-in-out w-full ${
            mobileNavMenu ? "max-w-[35%]  border-r-2" : "max-w-0"
          } md:max-w-[30%] md:border-r-2 h-auto  border-[#172544] flex- flex-col`}>
          <div className="tracking-[0.3rem] w-full text-center mx-auto flex py-4 border-b-2 border-inherit uppercase md:text-xl gap-2 md:gap-4 pl-[8%]">
            <h1 className="m-auto w-fit font-sans font-bold">Inbox</h1>
          </div>
          <ul className="h-full">
            {conversations.map((convo) => (
              <li
                key={convo.conversation_id} // Assuming conversation_id is the unique identifier
                className={`cursor-pointer text-center flex-col xl:flex-row ${
                  mobileNavMenu ? "break-words " : "break-keep "
                }  my-auto flex pl-[8%] gap-2 md:break-all  align-middle tracking-[0.3rem] py-4 border-b-2 border-[#172544] uppercase md:text-xl ${
                  selectedConversation === convo.conversation_id
                    ? "bg-gray-300"
                    : ""
                }
                  `}
                onClick={() => setSelectedConversation(convo.conversation_id)}>
                <div className="relative w-[28px] mx-auto xl:mx-0  justify-center align-middle flex my-auto h-[28px]">
                  <Image
                    src={
                      convo.members[
                        convo.members[1].id == state.user?.id ? 2 : 1
                      ].profileImage
                        ? convo.members[
                            convo.members[1].id == state.user?.id ? 2 : 1
                          ].profileImage
                        : "/profile/profile-pic-placeholder.png"
                    } // Assuming convoPic is a property of the second member
                    alt="hero"
                    className="rounded-full flex mx-auto"
                    fill
                    objectFit="cover"
                  />
                </div>
                <h1 className="my-auto text-center xl:text-left tracking-widest font-semibold">
                  {
                    convo.members[convo.members[1].id == state.user?.id ? 2 : 1]
                      .name
                  }
                </h1>
                {state.unreadConversations.some(
                  (unread: { conversation_id: any }) =>
                    unread.conversation_id === convo.conversation_id
                ) ? (
                  <span className="flex-end h-5 w-5 items-center justify-center rounded-full bg-red-500"></span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>

        <div
          className={`
              ${mobileNavMenu ? "max-w-[65%] md:w-2/3" : "max-w-full md:w-full"}
              w-full transition-all ease-in-out duration-200`}>
          <div className="">
            {selectedConversation !== null && (
              <>
                <div
                  className={`flex md:flex-row ${
                    mobileNavMenu && "flex-col"
                  }  justify-center tracking-[0.3rem] px-[4%] py-4 border-b-2 border-[#172544] uppercase md:text-xl`}>
                  <div className="flex gap-4 flex-wrap flex-1 justify-center">
                    <div
                      className={`relative w-[28px] my-auto   flex h-[28px]`}>
                      <Image
                        src={
                          conversations?.find(
                            (convo) =>
                              convo.conversation_id === selectedConversation
                          )?.members[
                            selectedConvo?.members[memberIndex].id ==
                            state.user.id
                              ? 1
                              : 2
                          ]?.profileImage
                            ? conversations?.find(
                                (convo) =>
                                  convo.conversation_id === selectedConversation
                              )?.members[
                                selectedConvo?.members[memberIndex].id ==
                                state.user.id
                                  ? 1
                                  : 2
                              ]?.profileImage // Assuming convoPic is a property of the second member
                            : "/profile/profile-pic-placeholder.png"
                        }
                        alt="hero"
                        fill
                        objectFit="cover"
                        className="rounded-full my-auto"
                      />
                    </div>
                    <h1 className="my-auto font-bold w-fit text-center md:text-left font-serif break-words">
                      {selectedConvo?.members[memberIndex]?.name}
                    </h1>
                  </div>
                  <Link
                    type="button"
                    className={`bg-[#E88527] hover:bg-[#e88427ca] ${
                      mobileNavMenu && "mx-auto"
                    } text-base tracking-normal capitalize h-fit w-fit my-auto px-2 py-1 text-white rounded-xl `}
                    href={
                      selectedConvo?.members[memberIndex].email !=
                      state.loggedInUser?.email
                        ? "/listings/" +
                          selectedConvo?.members[memberIndex].listingId
                        : ""
                    }>
                    View Listing
                  </Link>
                </div>

                <div
                  ref={messagesContainerRef}
                  className=" overflow-y-auto h-[50vh] py-6 px-2 md:px-10">
                  <div className="">
                    <ul className="flex flex-col gap-6 ">
                      {messages &&
                        messages?.map((message, index) => (
                          <li
                            key={index}
                            className={` flex opacity-0 transition-all justify-end duration-75 ease-in-out  gap-4 ${
                              message.sender_id == state.user?.id
                                ? "ml-auto  opacity-100" // Align to the right if it's my message
                                : "mr-auto  opacity-100"
                            }`}>
                            <Link
                              href={
                                message.sender_id == state.user?.id
                                  ? ""
                                  : "/listings/" +
                                    selectedConvo.members[memberIndex].id
                              }>
                              <div className="relative w-[30px] h-[30px] my-auto flex">
                                {/* <Image
                                  src={
                                    !selectedConvo.members[memberIndex]
                                      .profileImage
                                      ? '/profile/profile-pic-placeholder.png'
                                      : message.sender_id == state.user.id
                                      ? state.user.profileImage
                                      : selectedConvo?.members[memberIndex]
                                          .profileImage
                                  }
                                  alt="hero"
                                  fill
                                  objectFit="cover"
                                  className="rounded-full my-auto"
                                /> */}
                              </div>
                            </Link>
                            <p
                              className={`my-auto py-2 font-sans md:text-lg px-10 rounded-3xl ${
                                message?.sender_id === state.user?.id
                                  ? "bg-[#dbd7d6]"
                                  : "bg-[#E5DEDB]"
                              }`}>
                              {message?.content}
                            </p>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className=" w-full h-[10%] px-2 flex justify-between md:px-10">
            <input
              onChange={(e) => setNewMessage(e.target.value)}
              className="w-[80%] font-['Noto'] h-full pl-2 placeholder:tracking-[0.3rem] focus-visible:outline-none bg-transparent border-t-2 border-[#E5DEDB]"
              placeholder="Type your message here"
              type="text"
              value={newMessage}
            />

            {sendingMessage ? (
              <div
                role="status"
                className="bg-[#E88527] hover:bg-[#e88427ca] h-fit w-fit my-auto px-3 py-2 text-white rounded-xl">
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
                type="button"
                onClick={() => sendMessage()}
                className="bg-[#E88527] font-['Noto'] hover:bg-[#e88427ca] h-fit w-fit my-auto px-3 py-2 text-white rounded-xl ">
                Send
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  ) : (
    <div className="flex flex-col h-full justify-center items-center">
      <h1 className="text-2xl font-bold">No messages yet</h1>
      <p className="text-lg">
        You can start a conversation by clicking on a listing
      </p>
    </div>
  );
};

export default Messages;
