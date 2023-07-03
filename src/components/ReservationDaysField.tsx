import type { FC } from 'react';
import { Box, Checkbox, CheckboxGroup, Flex, Text } from '@chakra-ui/react';
import { Controller } from 'react-hook-form';
import type { FormControl } from './Form';
import { reservationDays } from '@/consts/user';

type Props = {
  control: FormControl;
};

const ReservationDaysField: FC<Props> = ({ control }) => {
  return (
    <Controller
      name="reservationDays"
      control={control}
      render={({ field: { onChange, ref: _ref, ...rest } }) => (
        <Box mt="4">
          <Text fontSize="lg">曜日</Text>
          <CheckboxGroup
            onChange={onChange as (event: string[]) => void}
            {...rest}
          >
            <Flex justify="center" wrap="wrap" rowGap="4" columnGap="6" mt="2">
              {reservationDays.map((day) => (
                <Checkbox key={day} value={day}>
                  {day}
                </Checkbox>
              ))}
            </Flex>
          </CheckboxGroup>
        </Box>
      )}
    />
  );
};

export default ReservationDaysField;
