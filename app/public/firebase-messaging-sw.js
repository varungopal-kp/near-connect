// This a service worker file for receiving push notifitications.
// See `Access registration token section` @ https://firebase.google.com/docs/cloud-messaging/js/client#retrieve-the-current-registration-token

// Scripts for firebase and firebase messaging

//eslint-disable-next-line
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
//eslint-disable-next-line
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyDMw-RaF5_3IZ_0Gr4nIYYawNKQxLBn83U",
  authDomain: "near-connect-880ad.firebaseapp.com",
  projectId: "near-connect-880ad",
  storageBucket: "near-connect-880ad.firebasestorage.app",
  messagingSenderId: "5485939043",
  appId: "1:5485939043:web:138facf07bc8f4cdc02b56",
  measurementId: "G-1RMGBC5FWD",
};

//eslint-disable-next-line
firebase.initializeApp(firebaseConfig);

//eslint-disable-next-line
const messaging = firebase.messaging(); // Retrieve firebase messaging

// Handle incoming messages while the app is not in focus (i.e in the background, hidden behind other tabs, or completely closed).
messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  //eslint-disable-next-line
  self.registration.showNotification(notificationTitle, notificationOptions);

  //eslint-disable-next-line
  self.clients.matchAll({ includeUncontrolled: true }).then((clients) => {
    clients.forEach((client) => {
      client.postMessage({
        type: "BACKGROUND_NOTIFICATION",
        payload: payload,
      });
    });
  });
});
