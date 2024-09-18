import React from 'react';

type Props = {};

const Page = (props: Props) => {
  return (
    <div
      style={{
        backgroundImage: `url('http://localhost:3000/sign-up-bg.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '4rem 2rem',
        color: '#fff !important',
        maxWidth: '600px',
        margin: '0 auto',
        backgroundBlendMode: 'multiply',
        backgroundColor: '#435966f3',
        fontFamily: 'sans-serif',
      }}>
      {/* <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <p
          style={{
            fontStyle: 'italic',
            fontSize: '25px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
            color: '#fff',
          }}>
          Dear new
          <svg
            width="30"
            height="1"
            viewBox="0 0 30 1"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <line
              y1="0.5"
              x2="30"
              y2="0.5"
              stroke="#fff"
              stroke-width="1"
              stroke-linecap="round"
            />
          </svg>
        </p>
        <p
          style={{
            fontSize: '45px',
            fontWeight: 'bold',
            lineHeight: '1',
            color: '#fff',
          }}>
          SWOM
        </p>
        <p
          style={{
            fontStyle: 'italic',
            fontSize: '25px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
            color: '#fff',
          }}>
          <svg
            width="30"
            height="1"
            viewBox="0 0 30 1"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <line
              y1="0.5"
              x2="30"
              y2="0.5"
              stroke="#fff"
              stroke-width="1"
              stroke-linecap="round"
            />
          </svg>
          member
        </p>
      </div>
      <p
        style={{
          fontSize: '18px',
          lineHeight: '1.5',
          fontWeight: 'lighter',
          margin: '1rem 0',
          color: '#fff',
          // font family: 'sans-serif',
          fontFamily: 'sans-serif',
        }}>
        Welcome to the SWOM community, where adventure and exploration await
        you! We're thrilled to have you join our home exchange platform, where
        you can unlock a world of unique experiences and connect with
        like-minded travelers from around the globe. Get ready to embark on
        unforgettable journeys, living like a local, and creating cherished
        memories in each other's homes. Our community is built on trust and
        respect, so feel confident in sharing your home and exploring new
        destinations with fellow SWOM members. Thank you for being a part of
        this exciting travel revolution, and we can't wait to see the incredible
        journeys that lie ahead for you.
      </p>
      <p
        style={{
          fontSize: '18px',
          fontWeight: 'lighter',
          color: '#fff',
          // font family: 'sans-serif',
          fontFamily: 'sans-serif',
        }}>
        Explore new destinations and dont hesitate to contact our team who is
        ready to help in any way.
      </p>
      <p
        style={{
          fontSize: '18px',
          fontWeight: 'lighter',
          color: '#fff',
          margin: '1rem 0',
          fontFamily: 'sans-serif',
        }}>
        Follow this link to create a subscription and set your password:
      </p>
      <p
        style={{
          fontSize: '18px',
          fontWeight: 'lighter',
          color: '#fff',
          margin: '0 auto',
          fontFamily: 'sans-serif',
        }}>
        <a
          style={{
            color: '#b1ddff',
            textDecoration: 'underline',
            fontWeight: 'bold',
          }}
          href="{{ .ConfirmationURL }}">
          Set Password
        </a>
      </p>
      <p
        style={{
          fontSize: '20px',
          // fontWeight: 'lighter',
          margin: '1rem 0',
          color: '#fff',
        }}>
        Happy Swomming! <br /> The SWOM Team
      </p>
      <p
        style={{
          fontSize: '15px',
          fontFamily: 'sans-serif',
          textAlign: 'center',
          color: '#fff',
        }}>
        We love to help! <br /> Our team is ready to help in any situation.
      </p>
      <p
        style={{
          fontSize: '15px',
          fontFamily: 'sans-serif',
          textAlign: 'center',
          color: '#fff',
          margin: '1rem auto',
          display: 'flex',
          gap: '3px',
        }}>
        Contact us{' '}
        <a
          style={{
            color: '#c6ecff',
            textDecoration: 'underline',
          }}
          href="mailto:info@swom.travel">
          info@swom.travel
        </a>
      </p> */}
    </div>
  );
};

export default Page;
