import type { FC } from 'react';
import { Box, Input, Text } from '@chakra-ui/react';
import { Controller } from 'react-hook-form';
import type { FormControl } from './Form';

type Props = {
  control: FormControl;
};

const ReservationVacancyField: FC<Props> = ({ control }) => {
  return (
    <Controller
      name="reservationVacancy"
      control={control}
      render={({ field }) => (
        <Box mt="4">
          <Text fontSize="lg">最低枠数</Text>
          <Input w="16" mt="2" textAlign="center" type="number" {...field} />
        </Box>
      )}
    />
  );
};

export default ReservationVacancyField;
