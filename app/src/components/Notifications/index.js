import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { onMessageListener, requestForToken } from "../../firebase";
import { UPDATE_DASHBOARD_COUNT } from "../../redux/constants/common";
import { updateFcmToken } from "../../redux/actions/commonActions";

const Index = () => {
  const dispatch = useDispatch();
  const [notification, setNotification] = useState({ title: "", body: "" });
  const fcmToken = localStorage.getItem("fcmToken");

  const common = useSelector((state) => state.common);
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    // Check if Service Worker is supported
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data && event.data.type === "BACKGROUND_NOTIFICATION") {
          const totalNotifications = common.totalNotifications + 1;
          dispatch({
            type: UPDATE_DASHBOARD_COUNT,
            payload: { totalNotifications },
          });
          console.log("React background notification:", event.data.payload);
        }
      });
    }
    // used common for closure issue
  }, [dispatch, common.totalNotifications]);

  useEffect(() => {
    requestNotificationPermission();

    const fetchToken = async () => {
      const newToken = await requestForToken();
      if (newToken !== fcmToken) {
        localStorage.setItem("fcmToken", newToken);
        dispatch(updateFcmToken({ fcmToken: newToken })).catch((error) =>
          console.log(error)
        );
      }
    };
    if (auth.token) {
      fetchToken();
    }
  }, [auth.token]);

  const requestNotificationPermission = () => {
    if (Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          if (Notification.permission === "granted") {
          }
        } else if (permission === "denied") {
          console.log("Notification permission denied.");
        }
      });
    }
  };

  onMessageListener((payload) => {
    if (payload.data.type === "CHAT") {
    } else {
      const totalNotifications = common.totalNotifications + 1;
      dispatch({
        type: UPDATE_DASHBOARD_COUNT,
        payload: { totalNotifications },
      });
    }

    console.log("Notification received: ", payload);
  });

  return null;
};

export default Index;
