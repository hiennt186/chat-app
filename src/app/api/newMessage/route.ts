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
  const { message } = await request.json();

  if (!message || !message.uid) {
    return NextResponse.json({ error: 'Missing message data or user ID' }, { status: 400 });
  }

  try {
    // Add message to Firestore
    await db.collection('messages').add(message);

    // Get all users except the sender
    const usersSnapshot = await db.collection('users').get();

    // Send notification to each user except the sender
    const notificationPromises = usersSnapshot.docs
      .filter(doc => doc.id !== message.uid) // Filter out the sender
      .map(async (userDoc) => {
        const userData = userDoc.data();
        if (userData.fcmToken) {
          await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/sendNotification`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              token: userData.fcmToken,
              title: 'New Message',
              body: `${message.displayName}: ${message.text}`
            }),
          });
        }
      });

    await Promise.all(notificationPromises);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing new message:', error);
    return NextResponse.json({ error: 'Failed to process new message' }, { status: 500 });
  }
}
