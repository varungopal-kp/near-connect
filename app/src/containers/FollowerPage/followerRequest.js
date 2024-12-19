import React from "react";
import InfiniteScrollList from "../../components/InfiniteScroll";
import { getPendingFollowers } from "../../redux/actions/followActions";
import { useDispatch } from "react-redux";
import ProfilePic from "../../components/ProfilePic";
import { toast } from "react-toastify";
import {
  confirmFollowRequest,
  deleteFollowRequest,
} from "../../redux/actions/followActions";
import { DELETE_ITEM, UPDATE_PROFILE } from "../../redux/constants/common";
import swal from "sweetalert";

export default function FollowerRequest(props) {
  const dispatch = useDispatch();

  const handleDeleteRequest = (id) => {
    return dispatch(deleteFollowRequest(id))
      .then((res) => {
        if (res.data) {
          const newFollowRequestCount = props.followRequestCount - 1;
          dispatch({
            type: UPDATE_PROFILE,
            payload: {
              requestsCount: newFollowRequestCount,
            },
          });
          dispatch({ type: DELETE_ITEM, payload: id });
          props.setFollowRequestCount(newFollowRequestCount);
          return toast.success("Removed");
        }
      })
      .catch((err) => {
        return toast.error(err || "Something went wrong");
      });
  };

  const handleConfirm = (id) => {
    return dispatch(confirmFollowRequest(id))
      .then((res) => {
        if (res.data) {
          dispatch({ type: DELETE_ITEM, payload: id });
          const newFollowersCount = props.followersCount + 1;
          const newFollowRequestCount = props.followRequestCount - 1;
          dispatch({
            type: UPDATE_PROFILE,
            payload: {
              followersCount: newFollowersCount,
              requestsCount: newFollowRequestCount,
            },
          });
          props.setFollowRequestCount(newFollowRequestCount);
          props.setFollowersCount(newFollowersCount);
          return toast.success("Confirmed");
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
              <ProfilePic url={item.requestUser?.pic} defaultSize />
            </a>
          </figure>
          <div class="pepl-info">
            <h4>
              <a href="time-line.html" title="">
                {item.requestUser?.name}
              </a>
            </h4>
            <span>{item.requestUser?.username}</span>
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
                    handleDeleteRequest(item._id);
                  }
                });
              }}
            >
              delete Request
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
                    handleConfirm(item._id);
                  }
                });
              }}
            >
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
          user={props.accountId}
        />
      </ul>
      {/* <button class="btn-view btn-load-more"></button> */}
    </div>
  );
}
