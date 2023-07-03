import type { AppProps } from 'next/app';
import Provider from '@/providers';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider>
      <Component {...pageProps} />
    </Provider>
  );
}
