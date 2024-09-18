'use client';
import React, { useEffect, useState } from 'react';
import CookieConsent from 'react-cookie-consent';

type Props = {};

const CookieConsentComponent = (props: Props) => {
  // window width that detects width of screen
  const [width, setWidth] = useState<number>(0);

  // detect width of screen
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWidth(window.innerWidth);
    }
  }, []);
  return (
    <CookieConsent
      location="none"
      buttonText="Accept"
      cookieName="myAwesomeCookieName2"
      style={{
        background: '#7F8119',
        color: '#fff !important',
        fontSize: '20px',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '10px',
        boxShadow: '5px 10px 10px 2px rgba(0, 0, 0, 0.304)',
        flex: 0,
        padding: '20px',
        width: width > 768 ? '60%' : '100%',
        bottom: '0px',
        left: '0',
        right: '0',
        margin: 'auto',
        height: 'fit-content',
        zIndex: 10000000,
        justifyContent: 'center',
      }}
      contentStyle={{
        flex: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 'auto',
      }}
      buttonClasses="bg-white text-black px-4 py-2 rounded-md m-auto"
      buttonWrapperClasses="flex justify-center w-full mt-4"
      buttonStyle={{
        color: '#4e503b',
        fontSize: '20px',
        alignContent: 'center',
        display: 'flex',
        margin: 'auto',
      }}
      expires={150}>
      <div className="m-auto w-full text-white text-center h-fit flex-none">
        We value your privacy <br />
        <span
          style={{
            fontSize: '16px',
            textAlign: 'left',
            color: 'white',
          }}>
          We use cookies to enhance your experience on our website. By
          continuing to use our website, you consent to the use of cookies.
        </span>
      </div>
    </CookieConsent>
  );
};

export default CookieConsentComponent;
