import { format as dateFormat, differenceInMinutes } from 'date-fns';
import ja from 'date-fns/locale/ja';
import type {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from 'firebase-admin/firestore';
import { extract, fetchMultipleTimes, maximumDays } from './booking';
import { db } from '@/applications/firebase';
import {
  createCollection,
  deleteCollection,
  readCollection,
} from '@/libs/firebase';
import type {
  Reservation,
  ReservationWithTimestamp,
} from '@/types/reservation';
import { User } from '@/types/user';

const path = 'reservations';

const converter: FirestoreDataConverter<ReservationWithTimestamp> = {
  toFirestore(doc) {
    return {
      date: doc.date,
      camera: doc.camera,
      vacancy: doc.vacancy,
      createdAt: doc.createdAt,
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot) {
    const data = snapshot.data();

    return {
      date: data.date.toDate(),
      camera: data.camera,
      vacancy: data.vacancy,
      createdAt: data.createdAt.toDate(),
    };
  },
};

export const createAll = async (reservations: ReservationWithTimestamp[]) =>
  await createCollection(db, path, reservations, converter);

export const readAll = async () =>
  (await readCollection(db, path, converter)).sort((a, b) =>
    a.date < b.date ? -1 : 1
  );

export const deleteAll = async () => await deleteCollection(db, path);

const createCache = async (date: Date) => {
  const bookings = await fetchMultipleTimes(date, maximumDays);
  const reservations: ReservationWithTimestamp[] = extract(bookings).map(
    (reservation) => ({
      ...reservation,
      createdAt: date,
    })
  );
  await deleteAll();
  await createAll(reservations);

  return reservations;
};

const isCacheExpired = (reservations: ReservationWithTimestamp[], date: Date) =>
  reservations.length === 0 ||
  differenceInMinutes(date, reservations[0].createdAt) > 5;

export const readFromCache = async () => {
  const now = new Date();
  let reservations = await readAll();
  if (isCacheExpired(reservations, now)) {
    reservations = await createCache(now);
  }

  return reservations;
};

export const format = (reservations: Reservation[], limitation = 2000) => {
  const text = reservations
    .map(({ date, camera, vacancy }) => {
      const datetime = dateFormat(date, 'yyyy/MM/dd(E) HH:mm', { locale: ja });
      const cameraText = camera ? '有' : '無';

      return `${datetime} ${vacancy} ${cameraText}`;
    })
    .join('\n');

  if (text.length === 0) {
    return '該当なし';
  } else if (text.length <= limitation) {
    return text;
  } else {
    const slicedText = text.slice(0, limitation);

    return slicedText.slice(0, slicedText.lastIndexOf('\n') + 1) + 'など';
  }
};

export const filter = (reservations: Reservation[], user: User) =>
  reservations.filter(
    ({ date, camera, vacancy }) =>
      user.reservationTimes.includes(
        dateFormat(date, 'HH:mm') as (typeof user.reservationTimes)[number]
      ) &&
      user.reservationCameras.includes(camera ? '有' : '無') &&
      user.reservationVacancy <= vacancy
  );
