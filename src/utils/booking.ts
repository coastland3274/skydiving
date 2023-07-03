import axios from 'axios';
import { addDays, formatISO, subSeconds } from 'date-fns';
import { parse } from 'date-fns';
import { Booking } from '@/types/booking';
import type { Reservation } from '@/types/reservation';

export const maximumDays = 150;

const fetchOneTime = async (startDate: Date, endDate: Date) => {
  const url =
    'https://coubic.com/api/v2/merchants/tokyoskydivingclub/booking_events';
  const params = {
    renderer: 'widgetCalendar',
    start: formatISO(startDate),
    end: formatISO(endDate),
  };
  const res = await axios.get<Booking[]>(url, { params });

  return res.data;
};

export const fetchMultipleTimes = async (startDate: Date, days: number) => {
  const maxDays = 50;
  const quotient = Math.floor(days / maxDays);
  const mainPromise = Array.from({ length: quotient }, (_, i) => {
    const _startDate = getDateAfterDays(startDate, maxDays * i, false);
    const _endDate = getDateAfterDays(startDate, maxDays * (i + 1), true);

    return fetchOneTime(_startDate, _endDate);
  });
  const subPromise = (() => {
    const remainder = days % maxDays;
    const _startDate = getDateAfterDays(startDate, maxDays * quotient, false);
    const _endDate = getDateAfterDays(startDate, days, true);

    return remainder === 0 ? undefined : fetchOneTime(_startDate, _endDate);
  })();

  return (
    await Promise.all(subPromise ? mainPromise.concat(subPromise) : mainPromise)
  ).flat();
};

const getDateAfterDays = (date: Date, days: number, sub: boolean) =>
  subSeconds(addDays(date, days), sub ? 1 : 0);

export const extract = (booking: Booking[]): Reservation[] =>
  booking
    .filter(({ vacancy }) => vacancy > 0)
    .map(({ title, vacancy, start }) => ({
      date: parse(start, 'yyyy-MM-dd HH:mm', new Date()),
      camera: title === 'カメラマン付',
      vacancy,
    }));
