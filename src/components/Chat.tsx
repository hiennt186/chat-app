'use client';

import { useState, useEffect, useRef } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { requestNotificationPermission } from '../utils/notifications';

// Add this type definition
type Message = {
  id: string;
  text: string;
  createdAt: Date;
  uid: string;
  displayName: string;
};

const Chat = () => {
  const [user] = useAuthState(auth);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      requestNotificationPermission().then(token => {
        if (token) {
          // Save FCM token to user document in Firestore
          fetch('/api/saveFcmToken', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ uid: user.uid, fcmToken: token }),
          });
        }
      });
    }
  }, [user]);

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('createdAt'), limit(50));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newMessages = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Message));
      setMessages(newMessages);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      const { scrollHeight, clientHeight } = chatContainerRef.current;
      chatContainerRef.current.scrollTop = scrollHeight - clientHeight;
    }
  };

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const message = {
      text: newMessage,
      createdAt: new Date(),
      uid: user.uid,
      displayName: user.displayName
    };

    try {
      await fetch('/api/newMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.uid === user?.uid ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.uid === user?.uid ? 'bg-blue-500 text-white' : 'bg-gray-700 text-white'}`}>
              <p className="font-semibold">{msg.displayName}</p>
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="p-4 bg-gray-800">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message"
            className="flex-1 p-2 border rounded-lg bg-gray-700 text-white border-gray-600"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300">Send</button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
