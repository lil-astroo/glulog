/* eslint-disable no-undef */

importScripts("https://www.gstatic.com/firebasejs/10.14.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.14.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAujd07zC_B0RF8EGizvkzJTJR8DtNay3M",
  authDomain: "glulog.firebaseapp.com",
  projectId: "glulog",
  storageBucket: "glulog.firebasestorage.app",
  messagingSenderId: "501006119543",
  appId: "1:501006119543:web:29f1120900f73399b3cc72",
});

const messaging = firebase.messaging();

// هندل پیام‌های بک‌گراند
messaging.onBackgroundMessage((payload) => {
  console.log('[SW] پیام پس‌زمینه:', payload);
  const notificationTitle = payload.notification?.title || 'عنوان';
  const notificationOptions = {
    body: payload.notification?.body || 'متن پیام',
    icon: '/favicon.ico'
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});

