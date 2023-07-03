import type { FC } from 'react';
import { Box, HStack, Radio, RadioGroup, Text } from '@chakra-ui/react';
import { Controller } from 'react-hook-form';
import type { FormControl } from './Form';
import { notificationTime } from '@/consts/time';
import { notifications } from '@/consts/user';

type Props = {
  control: FormControl;
};

const NotificationField: FC<Props> = ({ control }) => {
  return (
    <Controller
      name="notification"
      control={control}
      render={({ field: { onChange, ref: _ref, ...rest } }) => (
        <Box mt="4">
          <Text fontSize="lg">毎日 {notificationTime} に通知する</Text>
          <RadioGroup
            onChange={onChange as (nextValue: string) => void}
            {...rest}
          >
            <HStack justify="center" mt="2" spacing="24px">
              {notifications.map((notification) => (
                <Radio key={notification} value={notification}>
                  {notification}
                </Radio>
              ))}
            </HStack>
          </RadioGroup>
        </Box>
      )}
    />
  );
};

export default NotificationField;
