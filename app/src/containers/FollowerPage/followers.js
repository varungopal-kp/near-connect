import React from "react";
import InfiniteScrollList from "../../components/InfiniteScroll";
import {
  addFriend,
  getFollowers,
  removeFollower,
} from "../../redux/actions/followActions";
import ProfilePic from "../../components/ProfilePic";
import { useDispatch } from "react-redux";
import { DELETE_ITEM, UPDATE_PROFILE } from "../../redux/constants/common";
import { toast } from "react-toastify";
import swal from "sweetalert";

export default function Followers(props) {
  const dispatch = useDispatch();

  const handleFollowerRemove = (id) => {
    return dispatch(removeFollower(id))
      .then((res) => {
        if (res.data) {
          const newFollowersCount = props.followersCount - 1;
          dispatch({
            type: UPDATE_PROFILE,
            payload: { followersCount: newFollowersCount },
          });
          dispatch({ type: DELETE_ITEM, payload: id });
          props.setFollowersCount(newFollowersCount);
          return toast.success("Removed");
        }
      })
      .catch((err) => {
        return toast.error(err || "Something went wrong");
      });
  };

  const handleAddFriend = (id, friend) => {
    return dispatch(addFriend(friend))
      .then((res) => {
        if (res.data) {
          const newFollowersCount = props.followersCount - 1;
          const newFriendsCount = props.friendsCount + 1;
          dispatch({
            type: UPDATE_PROFILE,
            payload: {
              followersCount: newFollowersCount,
              friendsCount: newFriendsCount,
            },
          });
          dispatch({ type: DELETE_ITEM, payload: id });
          props.setFollowersCount(newFollowersCount);
          return toast.success("Friends");
        }
      })
      .catch((err) => {
        return toast.error(err || "Something went wrong");
      });
  };

  const infiniteRender = (item) => {
    return (
      <li>
        <div class="nearly-pepls">
          <figure>
            <a href="time-line.html" title="">
              <ProfilePic url={item.follower?.pic} defaultSize />
            </a>
          </figure>
          <div class="pepl-info">
            <h4>
              <a href="time-line.html" title="">
                {item.follower?.name}
              </a>
            </h4>
            <span>{item.follower?.username}</span>
            {props.layout !== 4 && (
              <>
                <a
                  href="#"
                  title=""
                  class="add-butn more-action"
                  data-ripple=""
                  onClick={(e) => {
                    e.preventDefault();
                    swal({
                      title: "Are you sure?",
                      icon: "warning",
                      buttons: true,
                      dangerMode: true,
                    }).then((confirm) => {
                      if (confirm) {
                        handleFollowerRemove(item._id);
                      }
                    });
                  }}
                >
                  remove
                </a>
                <a
                  href="#"
                  title=""
                  class="add-butn"
                  data-ripple=""
                  onClick={(e) => {
                    e.preventDefault();
                    swal({
                      title: "Are you sure?",
                      icon: "warning",
                      buttons: true,
                      dangerMode: true,
                    }).then((confirm) => {
                      if (confirm) {
                        handleAddFriend(item._id, item.follower._id);
                      }
                    });
                  }}
                >
                  add friend
                </a>
              </>
            )}
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
          user={props.accountId}
        />
      </ul>
      {/* <div class="lodmore">
        <button class="btn-view btn-load-more"></button>
      </div> */}
    </div>
  );
}
