import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import List from "./list";
import Form from "./form";
import { useDispatch, useSelector } from "react-redux";
import { getChatHistory } from "../../redux/actions/chatActions";

const socket = io(process.env.REACT_APP_URL);

export default function Index(props) {
  const dispatch = useDispatch();
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    dispatch(getChatHistory()).then((res) => {
      if(res.data) {
        console.log(res.data);
      }
    }).catch((err) => {
      console.log(err);
    });
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
            <List />
            <Form />
          </div>
        </div>
      </div>
    </div>
  );
}
