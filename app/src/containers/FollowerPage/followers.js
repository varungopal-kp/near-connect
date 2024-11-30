import React, { useEffect } from "react";
import InfiniteScrollList from "../../components/InfiniteScroll";
import { getFollowers } from "../../redux/actions/followerActions";


export default function Followers() {


  const infiniteRender = (item) => {
    return (
      <li>
        <div class="nearly-pepls">
          <figure>
            <a href="time-line.html" title="">
              <img src="images/resources/friend-avatar9.jpg" alt="" />
            </a>
          </figure>
          <div class="pepl-info">
            <h4>
              <a href="time-line.html" title="">
                {item.follower?.name}
              </a>
            </h4>
            <span>{item.follower?.email}</span>
            <a href="#" title="" class="add-butn more-action" data-ripple="">
              unfriend
            </a>
            <a href="#" title="" class="add-butn" data-ripple="">
              add friend
            </a>
          </div>
        </div>
      </li>
    );
  };

  return (
    <div class="tab-pane active fade show " id="frends">
      <ul class="nearby-contct">
        <InfiniteScrollList
          infiniteRender={infiniteRender}
          limit={10}
          fetchItems={getFollowers}
        />
      </ul>
      {/* <div class="lodmore">
        <button class="btn-view btn-load-more"></button>
      </div> */}
    </div>
  );
}
