import React, { useEffect } from "react";
import InfiniteScrollList from "../../components/InfiniteScroll";
import { getFollowersPending } from "../../redux/actions/followerActions";
import { useDispatch } from "react-redux";
import { CLEAR_LIST } from "../../redux/constants/common";

export default function FollowerRequest() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: CLEAR_LIST });
  }, []);

  const infiniteRender = (item) => {
    return (
      <li>
        <div class="nearly-pepls">
          <figure>
            <a href="time-line.html" title="">
              <img src="images/resources/nearly5.jpg" alt="" />
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
              delete Request
            </a>
            <a href="#" title="" class="add-butn" data-ripple="">
              Confirm
            </a>
          </div>
        </div>
      </li>
    );
  };

  return (
    <div class="tab-pane " id="frends-req">
      <ul class="nearby-contct">
        <InfiniteScrollList
          infiniteRender={infiniteRender}
          limit={10}
          fetchItems={getFollowersPending}
        />
      </ul>
      {/* <button class="btn-view btn-load-more"></button> */}
    </div>
  );
}
