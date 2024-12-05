import React, { useEffect, useRef, useState } from "react";
import { logout } from "../../redux/actions/authActions";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getDashboardCount } from "../../redux/actions/commonActions";

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const userSettingsRef = useRef(null); // Reference to the user settings dropdown
  const userImageRef = useRef(null); // Reference to the user image div

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
      userImageRef.current &&
      !userImageRef.current.contains(event.target)
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
              <input type="text" placeholder="Search Friend" />
              <button data-ripple="">
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
          <div className="user-img" onClick={toggleDropdown} ref={userImageRef}>
            <img src="images/resources/admin.jpg" alt="" />
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
      <section>
        <div class="feature-photo">
          <figure>
            <img src="images/resources/timeline-1.jpg" alt="" />
          </figure>
          <div class="add-btn">
            <span>1205 followers</span>
            <a href="#" title="" data-ripple="">
              Add Friend
            </a>
          </div>
          <form class="edit-phto">
            <i class="fa fa-camera-retro"></i>
            <label class="fileContainer">
              Edit Cover Photo
              <input type="file" />
            </label>
          </form>
          <div class="container-fluid">
            <div class="row merged">
              <div class="col-lg-2 col-sm-3">
                <div class="user-avatar">
                  <figure>
                    <img src="images/resources/user-avatar.jpg" alt="" />
                    <form class="edit-phto">
                      <i class="fa fa-camera-retro"></i>
                      <label class="fileContainer">
                        Edit Display Photo
                        <input type="file" />
                      </label>
                    </form>
                  </figure>
                </div>
              </div>
              <div class="col-lg-10 col-sm-9">
                <div class="timeline-info">
                  <ul>
                    <li class="admin-name">
                      <h5>Janice Griffith</h5>
                      <span>@janice</span>
                    </li>
                    <li>
                      <a
                        class=""
                        href="timeline-photos.html"
                        title=""
                        data-ripple=""
                      >
                        Photos
                      </a>
                      <a
                        class=""
                        href="timeline-videos.html"
                        title=""
                        data-ripple=""
                      >
                        Videos
                      </a>
                      <a
                        class=""
                        href="timeline-friends.html"
                        title=""
                        data-ripple=""
                      >
                        Friends
                      </a>
                      <a
                        class=""
                        href="timeline-friends.html"
                        title=""
                        data-ripple=""
                      >
                        Followers
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
