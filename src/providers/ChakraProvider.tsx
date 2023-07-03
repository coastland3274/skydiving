import type { FC, ReactNode } from 'react';
import { ChakraProvider as Provider } from '@chakra-ui/react';

type Props = {
  children: ReactNode;
};

const ChakraProvider: FC<Props> = ({ children }) => {
  return <Provider>{children}</Provider>;
};

export default ChakraProvider;
