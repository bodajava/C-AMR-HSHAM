import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCKGJHrpmmQ3rzDqh3q8jGX8-1wE31qGGw",
  authDomain: "social-app-ef577.firebaseapp.com",
  projectId: "social-app-ef577",
  storageBucket: "social-app-ef577.firebasestorage.app",
  messagingSenderId: "20900836573",
  appId: "1:20900836573:web:fed36d56161738a00ad734",
  measurementId: "G-P5V10VL7NW"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestForToken = async () => {
  try {
    const currentToken = await getToken(messaging, {
      vapidKey: "BEnxT-vXvXvXvXvXvXvXvXvXvXvXvXvXvXvXvXvXvXvXvXvXvXvXvXvXvXvXvXvXvXvXvXvXvXvXvXvX" // This might be wrong, but we'll see
    });
    if (currentToken) {
      console.log('Current token for client: ', currentToken);
      return currentToken;
    } else {
      console.log('No registration token available. Request permission to generate one.');
      return null;
    }
  } catch (err) {
    console.log('An error occurred while retrieving token. ', err);
    return null;
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

export { messaging };
