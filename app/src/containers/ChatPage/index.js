import React, { useState } from "react";
import { io } from "socket.io-client";
import List from "./list";
import Form from "./form";

const socket = io(process.env.REACT_APP_URL);

export default function Index(props) {
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);

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
            <List />
            <Form />
          </div>
        </div>
      </div>
    </div>
  );
}
