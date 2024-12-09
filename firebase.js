// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAMQ9pRR20Pkc2HhQEcnhkdhCuh-Wc3GFU",
  authDomain: "chat-bot-d9168.firebaseapp.com",
  projectId: "chat-bot-d9168",
  storageBucket: "chat-bot-d9168.appspot.com",
  messagingSenderId: "163693537448",
  appId: "1:163693537448:web:e934b7517e670f10343a9d",
  measurementId: "G-4W8WBJJ62K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);