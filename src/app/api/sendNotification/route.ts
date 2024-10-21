import { NextResponse } from 'next/server';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';

if (!getApps().length) {
  initializeApp({
    credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string)),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });
}

export async function POST(request: Request) {
  const { token, title, body } = await request.json();

  if (!token || !title || !body) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const message = {
      notification: {
        title,
        body,
      },
      token,
    };

    const response = await getMessaging().send(message);
    return NextResponse.json({ success: true, response });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
  }
}

