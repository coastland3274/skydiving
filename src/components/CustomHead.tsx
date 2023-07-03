import type { FC, ReactNode } from 'react';
import Head from 'next/head';

type props = {
  children?: ReactNode;
  title?: string;
  noindex?: boolean;
};

const CustomHead: FC<props> = ({ children, title, noindex }) => {
  const siteName = 'Skydiving Form';

  return (
    <Head>
      <title>{title !== undefined ? `${title} | ${siteName}` : siteName}</title>
      {noindex && <meta name="robots" content="noindex" />}
      {children}
    </Head>
  );
};

export default CustomHead;
