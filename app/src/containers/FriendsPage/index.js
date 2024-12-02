import React, { useEffect } from "react";
import InfiniteScrollList from "../../components/InfiniteScroll";
import { getFollowCount, getFriends } from "../../redux/actions/followActions";
import ProfilePic from "../../components/ProfilePic";
import { DELETE_ITEM } from "../../redux/constants/common";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { removeFriend } from "../../redux/actions/followActions";
import swal from "sweetalert";

export default function Index() {
  const dispatch = useDispatch();
  const [friendsCount , setFriendsCount] = React.useState(0);

  useEffect(() => {
    dispatch(getFollowCount()).then((res) => {
      if (res.data) {
        const friendsCount = res.data.data?.friendsCount || 0;
        setFriendsCount(friendsCount);
      }
    });
  }, []);

  const handleRemoveFriend = (id) => {
    return dispatch(removeFriend(id))
      .then((res) => {
        if (res.data) {
          dispatch({ type: DELETE_ITEM, payload: id });
          setFriendsCount((preValue) => preValue - 1);
          return toast.success("Removed");
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
            <a href="" title="">
              <ProfilePic url={item.friend?.pic} />
            </a>
          </figure>
          <div class="pepl-info">
            <h4>
              <a href="" title="">
                {item.friend?.name}
              </a>
            </h4>
            <span>{item.friend?.email}</span>
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
                }).then((willDelete) => {
                  if (willDelete) {
                    handleRemoveFriend(item._id);
                  }
                });
              }}
            >
              unfriend
            </a>
          </div>
        </div>
      </li>
    );
  };

  return (
    <div class="col-lg-6">
      <div class="central-meta">
        <div class="frnds">
          <ul class="nav nav-tabs">
            <li class="nav-item">
              <a class="active" href="#frends" data-toggle="tab">
                My Friends
              </a>{" "}
              <span>{friendsCount}</span>
            </li>
          </ul>

          <div class="tab-content">
            <div class="tab-pane active fade show " id="frends">
              <ul class="nearby-contct">
                <InfiniteScrollList
                  infiniteRender={infiniteRender}
                  limit={10}
                  fetchItems={getFriends}
                />
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
