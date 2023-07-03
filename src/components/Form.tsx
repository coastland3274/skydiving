import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { Box, Button, Container, Heading, Spinner } from '@chakra-ui/react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import type { Control } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import NotificationField from './NotificationField';
import ReservationCamerasField from './ReservationCamerasField';
import ReservationDaysField from './ReservationDaysField';
import ReservationTimesField from './ReservationTimesField';
import ReservationVacancyField from './ReservationVacancyField';
import { User, UserWithToken } from '@/types/user';
import { useLiff } from '@/providers/LiffProvider';

export type FormControl = Control<User>;

const url = new URL('/api/user', process.env.NEXT_PUBLIC_URL || '').toString();

const fetchUser = async (token: string) => {
  const user = await axios.get<User>(url, { params: { token } });

  return user.data;
};

const postUser = async (token: string, data: User) =>
  axios.post<UserWithToken>(url, {
    ...data,
    token,
  });

const Form: FC = () => {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('');
  const { handleSubmit, control, reset } = useForm<User>();
  const { liff } = useLiff();

  const onSubmit: SubmitHandler<User> = async (data) => {
    data.reservationVacancy = Number(data.reservationVacancy);
    toast.promise(postUser(token, data), {
      loading: 'Loading',
      success: 'Success',
      error: 'Error',
    });
  };

  useEffect(() => {
    if (!liff) return;
    const token = liff.getAccessToken() as string;
    setToken(token);
  }, [liff, token, setToken]);

  useEffect(() => {
    if (!token) return;
    fetchUser(token).then((data) => {
      reset(data);
      setLoading(false);
    });
  }, [token, setLoading, reset]);

  return (
    <Container maxW="96" my="6" textAlign="center">
      {loading ? (
        <Spinner />
      ) : (
        <>
          <Heading as="h1" fontSize="2xl">
            フォーム
          </Heading>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box mt="6">
              <Heading as="h2" fontSize="xl">
                予約
              </Heading>
              <ReservationDaysField control={control} />
              <ReservationTimesField control={control} />
              <ReservationCamerasField control={control} />
              <ReservationVacancyField control={control} />
            </Box>
            <Box mt="6">
              <Heading as="h2" fontSize="xl">
                通知
              </Heading>
              <NotificationField control={control} />
            </Box>
            <Button mt="8" type="submit">
              更新
            </Button>
          </form>
          <Toaster />
        </>
      )}
    </Container>
  );
};

export default Form;
