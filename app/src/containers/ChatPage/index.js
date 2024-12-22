import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import List from "./list";
import Form from "./form";
import { useDispatch, useSelector } from "react-redux";

const socket = io(process.env.REACT_APP_URL);

export default function Index(props) {
  const dispatch = useDispatch();

  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);

  useEffect(() => {
   
  }, []);

  return (
    <div class="col-lg-6">
      <div class="central-meta">
        <div class="messages">
          <h5 class="f-title">
            <i class="ti-bell"></i>All Messages{" "}
            <span class="more-options">
              <i class="fa fa-ellipsis-h"></i>
            </span>
          </h5>
          <div class="message-box">
            <List friends={friends} setSelectedFriend={setSelectedFriend} />
            {selectedFriend && <Form selectedFriend={selectedFriend} />}
          </div>
        </div>
      </div>
    </div>
  );
}
