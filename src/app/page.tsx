'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import Chat from '../components/Chat';
import SignIn from '../components/SignIn';

export default function Home() {
  const [user] = useAuthState(auth);

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">Chat App</h1>
      </header>
      <main className="flex-1 overflow-hidden">
        {user ? <Chat /> : <SignIn />}
      </main>
    </div>
  );
}
