import * as userConstants from '@/consts/user';
import { isStringArray } from '@/utils/common';

export type User = {
  reservationDays: (typeof userConstants.reservationDays)[number][];
  reservationTimes: (typeof userConstants.reservationTimes)[number][];
  reservationCameras: (typeof userConstants.reservationCameras)[number][];
  reservationVacancy: number;
  notification: (typeof userConstants.notifications)[number];
};

export type UserWithId = User & {
  id: string;
};

export type UserWithToken = User & {
  token: string;
};

export const isUserWithToken = (arg: unknown): arg is UserWithToken => {
  const u = arg as UserWithToken;

  return (
    isStringArray(u?.reservationDays) &&
    isStringArray(u?.reservationTimes) &&
    isStringArray(u?.reservationCameras) &&
    typeof u?.reservationVacancy === 'number' &&
    typeof u?.notification === 'string' &&
    typeof u?.token === 'string'
  );
};
