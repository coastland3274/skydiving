import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

const firebaseConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID || '',
  privateKey: process.env.FIREBASE_PRIVATE_KEY || '',
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
};

const app =
  admin.apps.length === 0
    ? admin.initializeApp({
        credential: admin.credential.cert(firebaseConfig),
      })
    : admin.app();

if (process.env.FIREBASE_USE_EMULATOR === 'true') {
  process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
}

export const db = getFirestore(app);
