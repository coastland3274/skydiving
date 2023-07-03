import type {
  DocumentData,
  Firestore,
  FirestoreDataConverter,
  WithFieldValue,
} from 'firebase-admin/firestore';
import { chunk } from '@/utils/common';

const BATCH_SIZE = 500;

export const createCollection = async (
  db: Firestore,
  path: string,
  data: WithFieldValue<DocumentData>[],
  converter: FirestoreDataConverter<DocumentData>,
  batchSize = BATCH_SIZE
) => {
  const colRef = db.collection(path).withConverter(converter);
  for (const chunkedData of chunk(data, batchSize)) {
    const batch = db.batch();
    chunkedData.forEach((d) => {
      const id = colRef.doc().id;
      const docRef = db.doc(`${path}/${id}`);
      batch.set(docRef, d);
    });
    await batch.commit();
  }
};

export const readCollection = async <T>(
  db: Firestore,
  path: string,
  converter: FirestoreDataConverter<T>
) => {
  const colRef = db.collection(path).withConverter(converter);
  const snapShot = await colRef.get();

  return snapShot.docs.map((doc) => doc.data());
};

export const deleteCollection = async (
  db: Firestore,
  path: string,
  batchSize = BATCH_SIZE
) => {
  const colRef = db.collection(path);
  const snapShot = await colRef.get();
  for (const chunkedDocs of chunk(snapShot.docs, batchSize)) {
    const batch = db.batch();
    chunkedDocs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
  }
};

export const readDocument = async <T>(
  db: Firestore,
  path: string,
  converter: FirestoreDataConverter<T>
) => {
  const docRef = db.doc(path).withConverter(converter);
  const snapShot = await docRef.get();

  return snapShot.data();
};

export const setDocument = async <T>(
  db: Firestore,
  path: string,
  data: WithFieldValue<T>,
  converter: FirestoreDataConverter<T>
) => {
  const docRef = db.doc(path).withConverter(converter);
  await docRef.set(data);
};

export const documentExists = async (db: Firestore, path: string) => {
  const docRef = db.doc(path);
  const snapShot = await docRef.get();

  return snapShot.exists;
};
