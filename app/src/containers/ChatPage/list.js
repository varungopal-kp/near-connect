import React from "react";
import ProfilePic from "../../components/ProfilePic";
import InfiniteScrollList from "../../components/InfiniteScroll";

import { fetchItems } from "../../redux/actions/chatActions";
import { SELECT_CHAT_USER } from "../../redux/constants/common";
import { useDispatch } from "react-redux";

export default function List(props) {
  const dispatch = useDispatch();
  const infiniteRender = (item) => {
    return (
      <li
        onClick={() => {
          dispatch({
            type: SELECT_CHAT_USER,
            payload: item.friend,
          });
        }}
      >
        <figure>
          <ProfilePic url={item.friend?.pic} defaultSize />
        </figure>
        <div class="people-name">
          <div>{item.friend?.name}</div>
          <span className="link-color" style={{ fontSize: "x-small" }}>
            {item.friend?.username}
          </span>{" "}
          <i>new</i>
        </div>
      </li>
    );
  };

  return (
    <ul class="peoples">
      <InfiniteScrollList
        infiniteRender={infiniteRender}
        limit={20}
        fetchItems={fetchItems}
        lastmessage={false}
      />
    </ul>
  );
}
