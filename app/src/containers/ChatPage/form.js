import React, { useEffect, useState } from "react";
import ProfilePic from "../../components/ProfilePic";
import InfiniteScrollList from "../../components/InfiniteScroll";
import { fetchMessageItems } from "../../redux/actions/chatActions";
import { useDispatch, useSelector } from "react-redux";
import {
  CREATE_ITEM,
  UPDATE_DASHBOAD_ONLINE_STATUS,
} from "../../redux/constants/common";

export default function Form(props) {
  const dispatch = useDispatch();
  const listKey = "messages";
  const [typing, setTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const [text, setText] = useState("");
  const [online, setOnline] = useState(false);

  const profile = props.profile;

  useEffect(() => {
    if (props.selectedFriend?.online?.socketIds?.length) {
      setOnline(true);
    }
  }, [props.selectedFriend]);

  useEffect(() => {
    if (profile && props.selectedFriend) {
      // Join the room for chat between the two users
      const room = [profile._id, props.selectedFriend._id].sort().join("-");
      props.socket.emit("joinRoom", room);

      // Define a handler for all socket events
      const handleReceiveMessage = (data) => {
        const by = profile._id === data.sender ? "me" : "you";
        const newData = { ...data, by };
        dispatch({
          type: CREATE_ITEM,
          payload: newData,
          reverse: true,
          listKey,
        });
      };

      const handleTyping = (data) => {
        if (data.sender !== profile._id) {
          setTypingUser(data.sender); // Set the typing user
        }
      };

      const handleStopTyping = (data) => {
        if (data.sender === typingUser) {
          setTypingUser(false); // Remove typing user when they stop typing
        }
      };

      const setOnlineStatus = (data) => {
        if (data.userId === props.selectedFriend._id) {
          const isOnline = data.status === "online" ? true : false;
          setOnline(isOnline);
          dispatch({
            type: UPDATE_DASHBOAD_ONLINE_STATUS,
            payload: {
              online: isOnline,
              userId: props.selectedFriend._id,
              socketId: data.socketId,
            },
          });
        }
      };

      props.socket.on("onlineStatus", setOnlineStatus);

      // Listen for socket events
      props.socket.on("receiveMessage", handleReceiveMessage);
      props.socket.on("typing", handleTyping);
      props.socket.on("stopTyping", handleStopTyping);

      // Cleanup the listeners on unmount
      return () => {
        // props.socket.off("receiveMessage", handleReceiveMessage);
        props.socket.off("receiveMessage");
        props.socket.off("typing");
        props.socket.off("stopTyping");
        props.socket.off("onlineStatus");
      };
    }
  }, [props.socket, profile, props.selectedFriend, typingUser]);

  const sendMessage = () => {
    const data = {
      sender: profile._id,
      receiver: props.selectedFriend._id,
      message: text,
    };
    props.socket.emit("sendMessage", data);
    setText("");
  };

  const infiniteRender = (item) => {
    return (
      <>
        <li className={`${item.by}`}>
          <figure>
            {/* <img src="images/resources/userlist-2.jpg" alt="" /> */}
          </figure>
          <p>{item.message}</p>
        </li>
      </>
    );
  };

  const handleTyping = (e) => {
    setText(e.target.value);

    // Emit typing event when user starts typing
    if (!typing) {
      setTyping(true);
      props.socket.emit("typing", {
        sender: profile._id,
        receiver: props.selectedFriend._id,
      });
    }

    // Emit stopTyping event after a short delay when user stops typing
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      setTyping(false);
      props.socket.emit("stopTyping", {
        sender: profile._id,
        receiver: props.selectedFriend._id,
      });
    }, 1000); // Delay of 1 second before stopping the typing event
  };

  let typingTimeout;

  return (
    <div className="peoples-mesg-box">
      <div className="conversation-head">
        <figure>
          <ProfilePic url={props.selectedFriend?.pic} defaultSize />
        </figure>
        <span>
          {props.selectedFriend?.name} <i>{online ? "online" : "offline"}</i>
        </span>
      </div>
      <ul className="chatting-area">
        <InfiniteScrollList
          infiniteRender={infiniteRender}
          limit={10}
          fetchItems={fetchMessageItems}
          lastmessage={false}
          user={props.selectedFriend._id}
          listKey={listKey}
        />
      </ul>
      <div className="message-text-container">
        {typingUser && <p>{props.selectedFriend?.name} is typing...</p>}
        <form method="post">
          <textarea
            name="message"
            placeholder="Type a message"
            onChange={(e) => handleTyping(e)}
            value={text}
          ></textarea>
          <button
            title="send"
            type="button"
            onClick={() => {
              sendMessage();
            }}
          >
            <i className="fa fa-paper-plane"></i>
          </button>
        </form>
      </div>
    </div>
  );
}
