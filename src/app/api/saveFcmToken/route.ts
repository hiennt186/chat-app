import { NextResponse } from 'next/server';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

if (!getApps().length) {
  initializeApp({
    credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string)),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });
}

const db = getFirestore();

export async function POST(request: Request) {
  const { uid, fcmToken } = await request.json();

  if (!uid || !fcmToken) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    await db.collection('users').doc(uid).set({ fcmToken }, { merge: true });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving FCM token:', error);
    return NextResponse.json({ error: 'Failed to save FCM token' }, { status: 500 });
  }
}

