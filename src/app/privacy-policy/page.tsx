import React from 'react';

type Props = {};

const Page = (props: Props) => {
  return (
    <main>
      <iframe
        title="TermsFeed Content"
        width="100%"
        height="1000px"
        src="https://www.termsfeed.com/live/7ec87636-1ee5-4bb2-8fd1-4df66afa5b2d"
        allowFullScreen></iframe>
    </main>
  );
};

export default Page;
