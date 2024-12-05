import { initializeApp } from "firebase/app";
import { getMessaging, onMessage, getToken } from "firebase/messaging";

// Replace this firebaseConfig object with the congurations for the project you created on your firebase console.
const firebaseConfig = {
  apiKey: "AIzaSyDMw-RaF5_3IZ_0Gr4nIYYawNKQxLBn83U",
  authDomain: "near-connect-880ad.firebaseapp.com",
  projectId: "near-connect-880ad",
  storageBucket: "near-connect-880ad.firebasestorage.app",
  messagingSenderId: "5485939043",
  appId: "1:5485939043:web:138facf07bc8f4cdc02b56",
  measurementId: "G-1RMGBC5FWD",
};

initializeApp(firebaseConfig);

const messaging = getMessaging();

export const requestForToken = () => {
  return getToken(messaging, {
    vapidKey: process.env.REACT_APP_FIREBASE_PUBLIC_VAPID_KEY,
  })
    .then((currentToken) => {
      if (currentToken) {
        console.log("fcmtoken: ", currentToken);
        // Perform any other neccessary action with the token
        return currentToken;
      } else {
        // Show permission request UI
        console.log(
          "No registration token available. Request permission to generate one."
        );
      }
    })
    .catch((err) => {
      console.log("An error occurred while retrieving token. ", err);
    });
};

export const onMessageListener = (callback) => {
  onMessage(messaging, (payload) => {
    if (callback) callback(payload); // Trigger the provided callback
  });
};

//   onMessage(messaging, (payload) => {
//     console.log("New message received:", payload); // Trigger every time a new message is received
//   });
