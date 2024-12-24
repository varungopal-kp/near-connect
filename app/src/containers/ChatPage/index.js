import React, { useEffect, useState } from "react";

import List from "./list";
import Form from "./form";
import { useDispatch, useSelector } from "react-redux";
import socket from "../../helpers/socket";
import { SELECT_CHAT_USER } from "../../redux/constants/common";

export default function Index(props) {
  const dispatch = useDispatch();
  const [selectedFriend, setSelectedFriend] = useState(null);

  const profile = useSelector((state) => state.common.profile);

  const chatUser = useSelector((state) => state.common.chatUser);

  useEffect(() => {
    if (profile) {
      socket.emit("userOnline", profile._id);
    }
  }, [profile]);

  useEffect(() => {
    if (chatUser) {
      setSelectedFriend(chatUser);
    }
    return () => {
      dispatch({ type: SELECT_CHAT_USER, payload: null });
    };
  }, [chatUser]);

  return (
    <div class="col-lg-6">
      <div class="central-meta">
        <div class="messages">
          <h5 class="f-title">
            <i class="ti-bell"></i>All Messages{" "}
          </h5>
          <div class="message-box">
            <List />
            {selectedFriend && (
              <Form
                selectedFriend={selectedFriend}
                socket={socket}
                profile={profile}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
