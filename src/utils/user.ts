import type {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from 'firebase-admin/firestore';
import { db } from '@/applications/firebase';
import * as userConstants from '@/consts/user';
import {
  documentExists,
  readCollection,
  readDocument,
  setDocument,
} from '@/libs/firebase';
import type { User, UserWithId } from '@/types/user';

const path = 'users';

const defaultUser: User = {
  reservationDays: userConstants.reservationDays.slice(5, 7),
  reservationTimes: userConstants.reservationTimes.slice(),
  reservationCameras: userConstants.reservationCameras.slice(),
  reservationVacancy: userConstants.reservationVacancy,
  notification: userConstants.notifications[0],
};

const converter: FirestoreDataConverter<UserWithId> = {
  toFirestore(doc) {
    return {
      reservationDays: doc.reservationDays,
      reservationTimes: doc.reservationTimes,
      reservationCameras: doc.reservationCameras,
      reservationVacancy: doc.reservationVacancy,
      notification: doc.notification,
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot) {
    const data = snapshot.data();

    return {
      id: snapshot.id,
      reservationDays: data.reservationDays,
      reservationTimes: data.reservationTimes,
      reservationCameras: data.reservationCameras,
      reservationVacancy: data.reservationVacancy,
      notification: data.notification,
    };
  },
};

export const createOrUpdate = async (
  userId: string,
  user: User = defaultUser
) => setDocument(db, `${path}/${userId}`, user, converter);

export const readAfterCreate = async (userId: string) => {
  const exists = await documentExists(db, `${path}/${userId}`);
  if (!exists) await createOrUpdate(userId);

  const userWithId = (await readDocument(
    db,
    `${path}/${userId}`,
    converter
  )) as UserWithId;

  return (({ id: _id, ...user }) => user)(userWithId) as User;
};

export const exists = async (userId: string) =>
  await documentExists(db, `${path}/${userId}`);

export const readAll = async () => await readCollection(db, path, converter);
