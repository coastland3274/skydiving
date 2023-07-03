import type { FC } from 'react';
import { Box, Checkbox, CheckboxGroup, HStack, Text } from '@chakra-ui/react';
import { Controller } from 'react-hook-form';
import type { FormControl } from './Form';
import { reservationCameras } from '@/consts/user';

type Props = {
  control: FormControl;
};

const ReservationCamerasField: FC<Props> = ({ control }) => {
  return (
    <Controller
      name="reservationCameras"
      control={control}
      render={({ field: { onChange, ref: _ref, ...rest } }) => (
        <Box mt="4">
          <Text fontSize="lg">カメラマン</Text>
          <CheckboxGroup
            onChange={onChange as (event: string[]) => void}
            {...rest}
          >
            <HStack justify="center" mt="2" spacing="24px">
              {reservationCameras.map((camera) => (
                <Checkbox key={camera} value={camera}>
                  {camera}
                </Checkbox>
              ))}
            </HStack>
          </CheckboxGroup>
        </Box>
      )}
    />
  );
};

export default ReservationCamerasField;
