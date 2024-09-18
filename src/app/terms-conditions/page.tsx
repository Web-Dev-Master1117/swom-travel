import React from 'react';
import './terms.scss';

type Props = {};

const Page = (props: Props) => {
  return (
    <main className="">
      <iframe
        title="TermsFeed Content"
        width="100%"
        height="1000px"
        src="https://www.termsfeed.com/live/23a87cd8-1830-4989-939c-943963bc9cb9"
        allowFullScreen></iframe>
    </main>
  );
};

export default Page;
