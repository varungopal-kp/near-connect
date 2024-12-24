import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { onMessageListener, requestForToken } from "../../firebase";
import {
  UPDATE_DASHBOARD_COUNT,
  UPDATE_ITEMS,
} from "../../redux/constants/common";
import { updateFcmToken } from "../../redux/actions/commonActions";

const Index = () => {
  const dispatch = useDispatch();
  const fcmToken = localStorage.getItem("fcmToken");

  const common = useSelector((state) => state.common);
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    // Check if Service Worker is supported
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data && event.data.type === "BACKGROUND_NOTIFICATION") {
          if (event.data.payload?.data?.type === "CHAT") {
            handleChatNotification(event.data.payload);
          } else {
            handleCommonNotification(event.data.payload);
          }

          console.log("React background notification:", event.data.payload);
        }
      });
    }
    // used common for closure issue
  }, [dispatch, common.totalNotifications, common.list?.length]);

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

  const handleChatNotification = (payload) => {
    const totalChats = common.totalChats + 1;
    dispatch({
      type: UPDATE_DASHBOARD_COUNT,
      payload: { totalChats },
    });
    const friend = common.list?.find(
      (item) => item.friend?._id === payload.data.sender
    );
    if (friend) {
      if (!friend.unseenChat) {
        friend.unseenChat = true;
        dispatch({
          type: UPDATE_ITEMS,
          payload: friend,
        });
      }
    }
  };

  const handleCommonNotification = (payload) => {
    const totalNotifications = common.totalNotifications + 1;
    dispatch({
      type: UPDATE_DASHBOARD_COUNT,
      payload: { totalNotifications },
    });
  };

  onMessageListener((payload) => {
    try {
      if (payload.data.type === "CHAT") {
        handleChatNotification(payload);
      } else {
        handleCommonNotification(payload);
      }
      console.log("Notification received: ", payload);
    } catch (error) {
      console.error(error);
    }
  });


  // no render
  return null;
};

export default Index;
