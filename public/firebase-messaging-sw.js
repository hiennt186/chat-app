importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyClh-YsWIuqte4CaNZMN2XqK4EEZRceZvA",
  authDomain: "chat-app-e256f.firebaseapp.com",
  projectId: "chat-app-e256f",
  storageBucket: "chat-app-e256f.appspot.com",
  messagingSenderId: "412692211799",
  appId: "1:412692211799:web:b2719d2ece32cd23081b12",
  measurementId: "G-MK9P77SJ37"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/path/to/icon.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

