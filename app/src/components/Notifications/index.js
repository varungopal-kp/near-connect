import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { onMessageListener, requestForToken } from "../../firebase";
import { UPDATE_DASHBOARD_COUNT } from "../../redux/constants/common";

const Index = () => {
  const dispatch = useDispatch();
  const [notification, setNotification] = useState({ title: "", body: "" });

  const common = useSelector((state) => state.common);

  useEffect(() => {
    requestNotificationPermission();

    const fetchToken = async () => {
      await requestForToken();
    };

    fetchToken();
  }, []);

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
    const totalNotifications = common.totalNotifications + 1;
   
    dispatch({
      type: UPDATE_DASHBOARD_COUNT,
      payload: { totalNotifications },
    });
    console.log("Notification received: ", payload);
  });

  return null;
};

export default Index;
