import React from "react";
import { searchProfile } from "../../redux/actions/commonActions";
import InfiniteScrollList from "../../components/InfiniteScroll";
import ProfilePic from "../../components/ProfilePic";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();
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
              <ProfilePic url={item.pic} defaultSize />
            </a>
          </figure>
          <div
            class="pepl-info pointer"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/account/${item.username}`);
            }}
          >
            <h4>
              <a
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                {item.name}
              </a>
            </h4>
            <span>{item.username}</span>
            <em style={{ float: "right" }}>
              {(() => {
                let label = "";
                let isDisabled = false;
                let colorClass = "add-butn btn";
                if (item.userRelation === "friends") {
                  label = "Friends";
                  colorClass = "add-butn btn aquamarine";
                  isDisabled = true;
                } else if (item.userRelation === "requested") {
                  label = "Requested";
                  colorClass = "add-butn btn gray";
                  isDisabled = true;
                } else if (item.userRelation === "follower") {
                  label = "Follower";
                  isDisabled = true;
                  colorClass = "add-butn btn gray";
                } else if (item.userRelation === "following") {
                  label = "Following";
                  isDisabled = true;
                  colorClass = "add-butn btn gray";
                } else if (item.userRelation === "no relation") {
                  label = "Follow";
                  isDisabled = true;
                }
                return label;
              })()}
            </em>{" "}
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
