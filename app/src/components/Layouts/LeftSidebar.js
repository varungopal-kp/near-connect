import React from "react";
import moment from "moment";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { addFollowRequest, addFriend } from "../../redux/actions/followActions";
import swal from "sweetalert";
import ProfilePic from "../ProfilePic";
import { blockUser, unblockUser } from "../../redux/actions/commonActions";

export default function LeftSidebar(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAddFollower = () => {
    try {
      dispatch(addFollowRequest(props.profileData?._id))
        .then((data) => {
          if (data.data) {
            toast.success("Requested");
            return navigate("/followers");
          }
        })
        .catch((err) => {
          toast.error(err || "Something went wrong");
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleBlock = (type) => {
    if (type === "block") {
      dispatch(blockUser({ blockUserId: props.profileData?._id }))
        .then((data) => {
          if (data.data) {
            toast.success("Blocked");
            return navigate("/");
          }
        })
        .catch((err) => {
          toast.error(err || "Something went wrong");
        });
    } else {
      dispatch(unblockUser({ blockUserId: props.profileData?._id }))
        .then((data) => {
          if (data.data) {
            toast.success("Unblocked");
            return navigate("/");
          }
        })
        .catch((err) => {
          toast.error(err || "Something went wrong");
        });
    }
  };

  const handleAddFriend = () => {
    try {
      dispatch(addFriend(props.profileData?._id))
        .then((data) => {
          if (data.data) {
            toast.success("Friends");
            return navigate("/friends");
          }
        })
        .catch((err) => {
          toast.error(err || "Something went wrong");
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="col-lg-3">
      <aside className="sidebar static">
        {(props.layout === 1 || props.layout === 4) && (
          <div className="widget stick-widget">
            <h4 className="widget-title">Profile </h4>
            <ul className="short-profile">
              <li>
                <span>about</span>
                <p>{props.profileData?.about}</p>
              </li>
            </ul>
          </div>
        )}
        {(props.layout === 1 || props.layout === 2) && (
          <div className="widget">
            <h4 className="widget-title">Menu</h4>
            <ul className="naves">
              <li>
                <i className="ti-folder"></i>
                <Link to="/posts">Posts</Link>
              </li>

              <li>
                <i className="ti-image"></i>
                <Link to="/photos">Photos</Link>
              </li>
              <li>
                <i className="ti-video-camera"></i>
                <Link to="/videos">videos</Link>
              </li>
              <li>
                <i className="ti-comments-smiley"></i>
                <Link to="/chats">Chats</Link>
              </li>
              <li>
                <i className="ti-bell"></i>
                <Link to="/notifications">Notifications</Link>
              </li>
              <li>
                <i className="ti-share"></i>
                <Link to="/nearby">People Nearby</Link>
              </li>

              <li>
                <i className="ti-power-off"></i>
                <Link to="/logout">Logout</Link>
              </li>
            </ul>
          </div>
        )}
        {props.layout === 3 && (
          <div className="widget">
            <h4 className="widget-title">Profile</h4>
            <div className="your-page">
              <figure>
                <ProfilePic url={props.profileData?.pic} />
              </figure>
              <div className="page-meta">
                <a className="underline">{props.profileData?.name}</a>
                <span>
                  <i className="fa fa-users"></i>Friends{" "}
                  <em>{props.profileData.friendsCount || 0}</em>
                </span>
                <span>
                  <i className="fa fa-user-plus"></i>Followers{" "}
                  <em>{props.profileData.followersCount || 0}</em>
                </span>
              </div>
              <div className="page-likes">
                <ul className="nav nav-tabs likes-btn">
                  {!props.profileData?.blockedByYou && (
                    <li className="nav-item">
                      {props.profileData?.userRelation === "requested" ? (
                        <div>Requested</div>
                      ) : props.profileData?.userRelation === "following" ? (
                        <div>Following</div>
                      ) : props.profileData?.userRelation === "follower" ? (
                        <a
                          data-toggle="tab"
                          className="active pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            swal({
                              title: "Are you sure?",
                              icon: "warning",
                              buttons: true,
                              dangerMode: true,
                            }).then((confirm) => {
                              if (confirm) {
                                handleAddFriend();
                              }
                            });
                          }}
                        >
                          Add Friend
                        </a>
                      ) : (
                        <a
                          data-toggle="tab"
                          className="active pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            swal({
                              title: "Are you sure?",
                              icon: "warning",
                              buttons: true,
                              dangerMode: true,
                            }).then((confirm) => {
                              if (confirm) {
                                handleAddFollower();
                              }
                            });
                          }}
                        >
                          Follow
                        </a>
                      )}
                    </li>
                  )}
                  <li className="nav-item">
                    {props.profileData?.blockedByYou ? (
                      <a
                        data-toggle="tab"
                        className="pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          swal({
                            title: "Are you sure?",
                            icon: "warning",
                            buttons: true,
                            dangerMode: true,
                          }).then((confirm) => {
                            if (confirm) {
                              handleBlock("unblock");
                            }
                          });
                        }}
                      >
                        unblock
                      </a>
                    ) : (
                      <a
                        data-toggle="tab"
                        className="pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          swal({
                            title: "Are you sure?",
                            icon: "warning",
                            buttons: true,
                            dangerMode: true,
                          }).then((confirm) => {
                            if (confirm) {
                              handleBlock("block");
                            }
                          });
                        }}
                      >
                        Block
                      </a>
                    )}
                  </li>
                </ul>
                <div className="tab-content">
                  <div className="tab-pane active fade show">
                    <a title="weekly-likes">{props.profileData?.username}</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {props.layout === 1 && (
          <div className="widget">
            <h4 className="widget-title">Recent Activity</h4>
            <ul className="activitiez">
              {props.profileData &&
                props.profileData?.recentActivity?.map((item, i) => {
                  return (
                    <li key={i}>
                      <div className="activity-meta">
                        <i>{moment(item.createdAt).fromNow() || ""}</i>
                        <span>{item.message}</span>
                        {item.activity !== "Posted" &&
                          item.activity !== "New Friend" && (
                            <h6>
                              by <a href="">{item.associatedUser?.email}</a>
                            </h6>
                          )}
                      </div>
                    </li>
                  );
                })}
            </ul>
          </div>
        )}
      </aside>
    </div>
  );
}
