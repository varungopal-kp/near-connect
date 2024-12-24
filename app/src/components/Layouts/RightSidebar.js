import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { removeFriend } from "../../redux/actions/followActions";
import swal from "sweetalert";
import {
  getDashboardFollowers,
  getDashboardFriends,
} from "../../redux/actions/commonActions";
import ProfilePic from "../ProfilePic";
import { SELECT_CHAT_USER } from "../../redux/constants/common";

export default function RightSidebar(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [followers, setFollowers] = React.useState([]);
  const [followerViewMore, setFollowerViewMore] = React.useState(false);

  const friends = useSelector((state) => state.common.friends);

  useEffect(() => {
    dispatch(getDashboardFriends());
    dispatch(getDashboardFollowers())
      .then((res) => {
        if (res.data) {
          setFollowers(res.data.followers);
          if (res.data.followersCount > 5) {
            setFollowerViewMore(true);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleRemoveFriend = (id) => {
    return dispatch(removeFriend(id))
      .then((res) => {
        if (res.data) {
          toast.success("Removed");
          return navigate("/");
        }
      })
      .catch((err) => {
        return toast.error(err || "Something went wrong");
      });
  };

  const renderOnline = (data) => {
    let status = "f-off";
    if (data.online?.socketIds?.length) {
      status = "f-online";
    }
    return <span className={`status ${status}`}></span>;
  };

  return (
    <div className="col-lg-3">
      <aside className="sidebar static">
        {props.layout === 1 && friends.length > 0 && (
          <div className="widget friend-list stick-widget">
            <h4 className="widget-title">Friends</h4>

            <ul id="people-list" className="friendz-list">
              {friends.map((friend) => (
                <li
                  className="pointer"
                  onClick={() => {
                    dispatch({
                      type: SELECT_CHAT_USER,
                      payload: friend.friend,
                    });
                    navigate("/chats");
                  }}
                >
                  <figure>
                    <ProfilePic
                      url={friend.friend?.pic}
                      style={{ width: "40px", height: "40px" }}
                    />
                    {renderOnline(friend.friend)}
                  </figure>
                  <div className="friendz-meta">
                    <span>{friend.friend?.name}</span>
                    <i className="link-color">{friend.friend?.username}</i>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        {props.layout === 1 && (
          <div className="widget stick-widget">
            <h4 className="widget-title">Who's follownig</h4>
            <ul className="followers">
              {followers.map((follower) => (
                <>
                  <li>
                    <figure>
                      <ProfilePic
                        url={follower.follower?.pic}
                        style={{ width: "40px", height: "40px" }}
                      />
                    </figure>
                    <div className="friend-meta">
                      <h4>{follower.follower?.name}</h4>
                      <Link
                        to={`/account/${follower.follower?.username}`}
                        className="underline"
                      >
                        Add Friend
                      </Link>
                    </div>
                  </li>
                  {followerViewMore && (
                    <li>
                      <div className="friend-meta">
                        <h4>
                          <Link to="/followers">View More</Link>
                        </h4>
                      </div>
                    </li>
                  )}
                </>
              ))}
            </ul>
          </div>
        )}
        {props.layout === 4 && (
          <div class="widget">
            <h4 class="widget-title">Details</h4>
            <div class="your-page">
              <div class="page-meta">
                <span>
                  <i class="fa fa-users"></i>Friends{" "}
                  <em>{props.profileData.friendsCount}</em>
                </span>
                <span>
                  <i class="fa fa-user-plus"></i>Followers{" "}
                  <em>{props.profileData.followersCount}</em>
                </span>
              </div>
              <div class="page-likes">
                <ul class="nav nav-tabs likes-btn">
                  <li class="nav-item">
                    <a
                      data-toggle="tab"
                      className=" pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        swal({
                          title: "Are you sure?",
                          icon: "warning",
                          buttons: true,
                          dangerMode: true,
                        }).then((confirm) => {
                          if (confirm) {
                            handleRemoveFriend(props.profileData._id);
                          }
                        });
                      }}
                    >
                      Remove friend
                    </a>
                  </li>
                </ul>
              </div>
              <div class="page-meta">
                <span>
                  DOB: <span>22/02/1995</span>
                </span>
                <span>
                  Place: <span>Kochi, Kerala</span>
                </span>
              </div>
            </div>
          </div>
        )}
        {props.layout === 3 && (
          <div class="widget">
            <h4 class="widget-title">Recent Photos</h4>
            {props.profileData?.images?.length === 0 && (
              <div style={{ textAlign: "center" }}>No Photos</div>
            )}
            <ul class="recent-photos">
              {props.profileData?.images?.map((image) => (
                <li>
                  <a
                    class="strip"
                    href="images/resources/recent-11.jpg"
                    title=""
                    data-strip-group="mygroup"
                    data-strip-group-options="loop: false"
                  >
                    <img src={image.url} alt="" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>
    </div>
  );
}
