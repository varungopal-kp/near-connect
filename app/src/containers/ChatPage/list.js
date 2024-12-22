import React from "react";
import ProfilePic from "../../components/ProfilePic";
import InfiniteScrollList from "../../components/InfiniteScroll";

import { fetchItems } from "../../redux/actions/chatActions";

export default function List(props) {
  const infiniteRender = (item) => {
    return (
      <li
        onClick={() => {
          props.setSelectedFriend(item.friend);
        }}
      >
        <figure>
          <ProfilePic url={item.friend?.pic} defaultSize />
          <span class="status f-online"></span>
        </figure>
        <div class="people-name">
          <span>{item.friend?.name}</span>
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
