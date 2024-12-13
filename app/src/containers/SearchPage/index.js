import React, { useEffect } from "react";
import { searchProfile } from "../../redux/actions/commonActions";
import InfiniteScrollList from "../../components/InfiniteScroll";
import ProfilePic from "../../components/ProfilePic";

export default function Index() {
  const search = new URLSearchParams(window.location.search);
  let searchValue = search.get("q");
  if (!searchValue) {
    window.location.href = "/";
  }

  const infiniteRender = (item) => {
    return (
      <li>
        <div class="nearly-pepls">
          <figure>
            <a href="time-line.html" title="">
              <ProfilePic url={item.pic} defaultSize/>
            </a>
          </figure>
          <div class="pepl-info">
            <h4>
              <a href="time-line.html" title="">
                {item.name}
              </a>
            </h4>
            <span>{item.email}</span>
            <em>
              <i class="fa fa-map-marker"></i>
              {item.location?.city}
            </em>{" "}
            
            {(() => {
              let label = "";
              let isDisabled =false
              let colorClass = "add-butn btn";
              if (item.userRelation === "friend") {
                label = "Friends";
                colorClass = "add-butn btn aquamarine";
                isDisabled= true
              } else if (item.userRelation === "requestUser") {
                label = "Requested";
                colorClass = "add-butn btn gray";
                isDisabled= true
              } else if (item.userRelation === "no relation") {
                label = "Follow";
              } else if (item.userRelation === "follower") {
                label = "Remove";
                colorClass = "add-butn btn red";
              }
              return (
                <button class={colorClass} disabled={isDisabled}>
                  {label}
                </button>
              );
            })()}
          </div>
        </div>
      </li>
    );
  };

  return (
    <div class="col-lg-6">
      <div class="central-meta">
        <ul class="nearby-contct">
          <InfiniteScrollList
            infiniteRender={infiniteRender}
            limit={10}
            fetchItems={searchProfile}
            search={searchValue}
          />
        </ul>
      </div>
    </div>
  );
}
