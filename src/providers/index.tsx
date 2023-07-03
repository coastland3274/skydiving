import type { FC, ReactNode } from 'react';
import ChakraProvider from './ChakraProvider';
import LiffProvider from './LiffProvider';

type Props = {
  children: ReactNode;
};

const Provider: FC<Props> = ({ children }) => {
  return (
    <LiffProvider>
      <ChakraProvider>{children}</ChakraProvider>
    </LiffProvider>
  );
};

export default Provider;
