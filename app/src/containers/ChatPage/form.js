import React, { useEffect, useState } from "react";
import ProfilePic from "../../components/ProfilePic";
import InfiniteScrollList from "../../components/InfiniteScroll";
import { fetchMessageItems } from "../../redux/actions/chatActions";
import { useDispatch, useSelector } from "react-redux";
import {
  CREATE_ITEM,
  UPDATE_DASHBOAD_ONLINE_STATUS,
  UPDATE_DASHBOARD_COUNT,
  UPDATE_ITEMS,
} from "../../redux/constants/common";
import { updateChatSeen } from "../../redux/actions/commonActions";

export default function Form(props) {
  const dispatch = useDispatch();
  const listKey = "messages";
  const [typing, setTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const [text, setText] = useState("");
  const [online, setOnline] = useState(false);

  const profile = props.profile;

  const selectedFriendData = props.selectedFriend.friend;

  useEffect(() => {
    if (selectedFriendData) {
      console.log(props.selectedFriend);
      if (props.selectedFriend.unseenChat) {
        dispatch(updateChatSeen(selectedFriendData._id))
          .then((res) => {
            if (res.data) {
              const friend = { ...props.selectedFriend };
              dispatch({
                type: UPDATE_DASHBOARD_COUNT,
                payload: { totalChats: props.totalChats - 1 || 0 },
              });
              friend.unseenChat = false;
              dispatch({
                type: UPDATE_ITEMS,
                payload: friend,
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  }, [selectedFriendData]);

  useEffect(() => {
    if (selectedFriendData?.online?.socketIds?.length) {
      setOnline(true);
    }
  }, [selectedFriendData]);

  useEffect(() => {
    if (profile && selectedFriendData) {
      // Join the room for chat between the two users
      const room = [profile._id, selectedFriendData._id].sort().join("-");
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
        if (data.userId === selectedFriendData._id) {
          const isOnline = data.status === "online" ? true : false;
          setOnline(isOnline);
          dispatch({
            type: UPDATE_DASHBOAD_ONLINE_STATUS,
            payload: {
              online: isOnline,
              userId: selectedFriendData._id,
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
  }, [props.socket, profile, selectedFriendData, typingUser]);

  const sendMessage = () => {
    const data = {
      sender: profile._id,
      receiver: selectedFriendData._id,
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
        receiver: selectedFriendData._id,
      });
    }

    // Emit stopTyping event after a short delay when user stops typing
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      setTyping(false);
      props.socket.emit("stopTyping", {
        sender: profile._id,
        receiver: selectedFriendData._id,
      });
    }, 1000); // Delay of 1 second before stopping the typing event
  };

  let typingTimeout;

  return (
    <div className="peoples-mesg-box">
      <div className="conversation-head">
        <figure>
          <ProfilePic url={selectedFriendData?.pic} defaultSize />
        </figure>
        <span>
          {selectedFriendData?.name} <i>{online ? "online" : "offline"}</i>
        </span>
      </div>
      <ul className="chatting-area">
        <InfiniteScrollList
          infiniteRender={infiniteRender}
          limit={10}
          fetchItems={fetchMessageItems}
          lastmessage={false}
          user={selectedFriendData._id}
          listKey={listKey}
        />
      </ul>
      <div className="message-text-container">
        {typingUser && <p>{selectedFriendData?.name} is typing...</p>}
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
