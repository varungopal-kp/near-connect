import React, { useState } from "react";
import ProfilePic from "../../components/ProfilePic";
import InfiniteScrollList from "../../components/InfiniteScroll";

import { fetchMessageItems } from "../../redux/actions/chatActions";

export default function Form(props) {
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);

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

  return (
    <div className="peoples-mesg-box">
      <div className="conversation-head">
        <figure>
          <ProfilePic url={props.selectedFriend?.pic} defaultSize />
        </figure>
        <span>
          {props.selectedFriend?.name} <i>online</i>
        </span>
      </div>
      <ul className="chatting-area">
        <InfiniteScrollList
          infiniteRender={infiniteRender}
          limit={10}
          fetchItems={fetchMessageItems}
          lastmessage={false}
          user={props.selectedFriend._id}
          listKey="messages"
        />
      </ul>
      <div className="message-text-container">
        <form method="post">
          <textarea></textarea>
          <button title="send">
            <i className="fa fa-paper-plane"></i>
          </button>
        </form>
      </div>
    </div>
  );
}
