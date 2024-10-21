import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
    apiKey: "AIzaSyClh-YsWIuqte4CaNZMN2XqK4EEZRceZvA",
    authDomain: "chat-app-e256f.firebaseapp.com",
    projectId: "chat-app-e256f",
    storageBucket: "chat-app-e256f.appspot.com",
    messagingSenderId: "412692211799",
    appId: "1:412692211799:web:b2719d2ece32cd23081b12",
    measurementId: "G-MK9P77SJ37"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const messaging = typeof window !== 'undefined' ? getMessaging(app) : null;

export { auth, db, messaging };
