import type { FC } from 'react';
import CustomHead from '@/components/CustomHead';
import Form from '@/components/Form';

const Home: FC = () => {
  return (
    <>
      <CustomHead noindex={true} />
      <Form />
    </>
  );
};

export default Home;
