import type { FC } from 'react';
import { Box, Checkbox, CheckboxGroup, Flex, Text } from '@chakra-ui/react';
import { Controller } from 'react-hook-form';
import type { FormControl } from './Form';
import { reservationTimes } from '@/consts/user';

type Props = {
  control: FormControl;
};

const ReservationTimesField: FC<Props> = ({ control }) => {
  return (
    <Controller
      name="reservationTimes"
      control={control}
      render={({ field: { onChange, ref: _ref, ...rest } }) => (
        <Box mt="4">
          <Text fontSize="lg">時刻</Text>
          <CheckboxGroup
            onChange={onChange as (event: string[]) => void}
            {...rest}
          >
            <Flex justify="center" wrap="wrap" rowGap="2" columnGap="6" mt="2">
              {reservationTimes.map((time) => (
                <Checkbox key={time} value={time}>
                  {time}
                </Checkbox>
              ))}
            </Flex>
          </CheckboxGroup>
        </Box>
      )}
    />
  );
};

export default ReservationTimesField;
