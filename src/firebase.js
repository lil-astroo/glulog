import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyAujd07zC_B0RF8EGizvkzJTJR8DtNay3M",
    authDomain: "glulog.firebaseapp.com",
    projectId: "glulog",
    storageBucket: "glulog.firebasestorage.app",
    messagingSenderId: "501006119543",
    appId: "1:501006119543:web:29f1120900f73399b3cc72",
    measurementId: "G-Y98WK5QV5W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
const analytics = getAnalytics(app);

export const requestPermission = async () => {
    const swUrl = `${process.env.PUBLIC_URL}/firebase-messaging-sw.js`;
    console.log("درخواست مجوز نوتیف...");

    const permission = await Notification.requestPermission();
    if (permission !== "granted") return console.warn("🚫 اجازه نوتیف داده نشد");

    // 🔹 رجیستر Service Worker قبل از گرفتن توکن
    const registration = await navigator.serviceWorker.register(swUrl);
    console.log("✅ SW رجیستر شد:", registration);

    const token = await getToken(messaging, {
        vapidKey: "BO4Pl7AaKq7EFIPvvSPaJpxvbMaRUBwmNnWqG0IJzU-XIB_l9WknMvqzJd0ZVsM-2OLybzM1fc0zheBvpAt8o4U",
        serviceWorkerRegistration: registration,
    });
    console.log("توکن FCM:", token);
};

// دریافت پیام‌ها وقتی صفحه بازه
onMessage(messaging, (payload) => {
    console.log("📩 پیام foreground دریافتی:", payload);
    if (payload.notification) {
        const { title, body } = payload.notification;
        alert(`نوتیفیکیشن: ${title}\n${body}`);
    }
});