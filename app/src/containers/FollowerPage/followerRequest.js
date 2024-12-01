import React from "react";
import InfiniteScrollList from "../../components/InfiniteScroll";
import { getPendingFollowers } from "../../redux/actions/followActions";
import { useDispatch } from "react-redux";
import ProfilePic from "../../components/ProfilePic";

export default function FollowerRequest() {
  const dispatch = useDispatch();

  const infiniteRender = (item) => {
    return (
      <li>
        <div class="nearly-pepls">
          <figure>
            <a href="time-line.html" title="">
              <ProfilePic url={item.requestUser?.pic} />
            </a>
          </figure>
          <div class="pepl-info">
            <h4>
              <a href="time-line.html" title="">
                {item.requestUser?.name}
              </a>
            </h4>
            <span>{item.requestUser?.email}</span>
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
          fetchItems={getPendingFollowers}
        />
      </ul>
      {/* <button class="btn-view btn-load-more"></button> */}
    </div>
  );
}
