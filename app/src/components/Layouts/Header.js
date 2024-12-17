import React, { useEffect, useRef, useState } from "react";
import { logout } from "../../redux/actions/authActions";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  getDashboardCount,
  updateProfileImage,
} from "../../redux/actions/commonActions";
import { toast } from "react-toastify";
import ProfilePic from "../../components/ProfilePic";

export default function Header(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [search, setSearch] = useState("");
  const userSettingsRef = useRef(null); // Reference to the user settings dropdown
  const navUserRef = useRef(null); // Reference to the user image div

  const fileProfileInputRef = React.useRef(null);
  const fileBackgroundInputRef = React.useRef(null);

  const common = useSelector((state) => state.common);

  // Function to toggle the dropdown
  const toggleDropdown = () => {
    setIsActive((prev) => !prev);
  };

  // Function to close the dropdown if clicked outside
  const handleClickOutside = (event) => {
    if (
      userSettingsRef.current &&
      !userSettingsRef.current.contains(event.target) &&
      navUserRef.current &&
      !navUserRef.current.contains(event.target)
    ) {
      setIsActive(false); // Close the dropdown if clicked outside
    }
  };

  useEffect(() => {
    dispatch(getDashboardCount()).catch((error) => console.log(error));
  }, []);

  // This effect adds an event listener to handle clicks outside
  useEffect(() => {
    // Only add the event listener when the dropdown is active
    if (isActive) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Clean up the event listener on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isActive]);

  const handleProfileFileChange = (event, type = false) => {
    try {
      const files = event.target.files;

      if (files.length === 0) {
        return "";
      }
      if (files[0].size > 5 * 1024 * 1024) {
        return toast.error("File size should be less than 5 MB");
      }
      if (!files[0].type.startsWith("image")) {
        return toast.error("Only images are allowed");
      }

      const formData = new FormData();
      formData.append("photo", files[0]);
      formData.append("type", type);

      return dispatch(updateProfileImage(formData))
        .catch((err) => {
          return toast.error(err || "Something went wrong");
        })
        .then((res) => {
          if (res.data) {
            return toast.success("Successfull");
          }
        });
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <>
      {" "}
      <div className="responsive-header">
        <div className="mh-head first Sticky">
          <span className="mh-btns-left">
            <a className="" href="#menu">
              <i className="fa fa-align-justify"></i>
            </a>
          </span>
          <span className="mh-text">
            <Link to="/">
              {/* <img src="images/logo2.png" alt="" /> */}
              NearConnect
            </Link>
          </span>
          <span className="mh-btns-right">
            <a className="fa fa-sliders" href="#shoppingbag"></a>
          </span>
        </div>
        <div className="mh-head second">
          <form className="mh-form">
            <input placeholder="search" />
            <a href="#/" className="fa fa-search"></a>
          </form>
        </div>
      </div>
      <div className="topbar stick">
        <div className="logo">
          <Link to="/">
            {/* <img src="images/logo.png" alt="" /> */}
            NearConnect
          </Link>
        </div>

        <div className="top-area">
          <div className="top-search">
            <form method="post" className="">
              <input
                type="text"
                placeholder="Search "
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                data-ripple=""
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/search?q=${search}`);
                }}
              >
                <i className="ti-search"></i>
              </button>
            </form>
          </div>
          <ul class="setting-area">
            <li>
              <Link to="/notifications" title="Notifications">
                <i class="ti-bell"></i>
                <span>{common.totalNotifications}</span>
              </Link>
            </li>
            <li>
              <a href="#" title="Messages" data-ripple="">
                <i class="ti-comment"></i>
                <span>0</span>
              </a>
            </li>
          </ul>
          <div className="user-img" onClick={toggleDropdown} ref={navUserRef}>
            <img src="/images/resources/admin.jpg" alt="" />
            <span className="status f-online"></span>
            <div
              className={`user-setting ${isActive ? "active" : ""}`}
              ref={userSettingsRef} // Reference for the dropdown
            >
              <a
                href=""
                onClick={(e) => {
                  e.preventDefault();
                  handleLogout();
                }}
              >
                <i className="ti-power-off"></i> log out
              </a>
            </div>
          </div>
        </div>
      </div>
      {(props.layout === 1 || props.layout === 4) && (
        <section>
          <div class="feature-photo">
            <figure>
              {props.profileData && props.profileData?.backgroundPic ? (
                <img
                  src={`${process.env.REACT_APP_BASE_URL}/${props.profileData?.backgroundPic}`}
                  alt=""
                  style={{ maxHeight: "400px" }}
                />
              ) : (
                <img
                  src="/images/resources/white.jpg"
                  alt=""
                  style={{ maxHeight: "400px" }}
                />
              )}
            </figure>
            <div class="add-btn" style={{ right: "200px" }}>
              <span></span>
              <p className="follw-text">
                {props.profileData?.friendsCount} friends
              </p>
            </div>
            <div class="add-btn">
              <span></span>
              <p className="follw-text">
                {props.profileData?.followersCount} followers
              </p>
            </div>
            {props.layout === 1 && (
              <form class="edit-phto pointer">
                <i class="fa fa-camera-retro"></i>
                <label class="fileContainer">
                  Edit Cover Photo
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileBackgroundInputRef}
                    style={{ display: "none" }}
                    onChange={(e) => handleProfileFileChange(e, "background")}
                  />
                </label>
              </form>
            )}

            <div class="container-fluid">
              <div class="row merged">
                <div class="col-lg-2 col-sm-3">
                  <div class="user-avatar">
                    <figure>
                      <ProfilePic url={props.profileData?.pic} />
                      {props.layout === 1 && (
                        <form class="edit-phto pointer">
                          <i class="fa fa-camera-retro"></i>
                          <label class="fileContainer">
                            Edit Display Photo
                            <input
                              type="file"
                              accept="image/*"
                              ref={fileProfileInputRef}
                              style={{ display: "none" }}
                              onChange={(e) =>
                                handleProfileFileChange(e, "profile")
                              }
                            />
                          </label>
                        </form>
                      )}
                    </figure>
                  </div>
                </div>
                <div class="col-lg-10 col-sm-9">
                  <div class="timeline-info">
                    <ul>
                      <li class="admin-name">
                        <h5>{props.profileData?.name}</h5>
                        <span>{props.profileData?.username}</span>
                      </li>
                      <li>
                        <Link
                          to={`${
                            props.layout === 1
                              ? "/photos"
                              : `/account/${props.profileData?.username}/photos`
                          }`}
                        >
                          Photos
                        </Link>
                        <Link
                          to={`${
                            props.layout === 1
                              ? "/videos"
                              : `/account/${props.profileData?.username}/videos`
                          }`}
                        >
                          Videos
                        </Link>
                        <Link
                          to={`${
                            props.layout === 1
                              ? "/friends"
                              : `/account/${props.profileData?.username}/friends`
                          }`}
                        >
                          Friends
                        </Link>
                        <Link
                          to={`${
                            props.layout === 1
                              ? "/followers"
                              : `/account/${props.profileData?.username}/followers`
                          }`}
                        >
                          Followers
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
