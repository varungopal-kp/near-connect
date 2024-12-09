import React from "react";
import moment from "moment";

export default function LeftSidebar(props) {
  return (
    <div className="col-lg-3">
      <aside className="sidebar static">
        {(props.layout === 1 || props.layout === 4) && (
          <div class="widget stick-widget">
            <h4 class="widget-title">Profile </h4>
            <ul class="short-profile">
              <li>
                <span>about</span>
                <p>
                  Hi, i am jhon kates, i am 32 years old and worked as a web
                  developer in microsoft company.{" "}
                </p>
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
                <a href="timeline-photos.html" title="">
                  Posts
                </a>
              </li>

              <li>
                <i className="ti-image"></i>
                <a href="timeline-photos.html" title="">
                  Photos
                </a>
              </li>
              <li>
                <i className="ti-video-camera"></i>
                <a href="timeline-videos.html" title="">
                  videos
                </a>
              </li>
              <li>
                <i className="ti-comments-smiley"></i>
                <a href="messages.html" title="">
                  Messages
                </a>
              </li>
              <li>
                <i className="ti-bell"></i>
                <a href="notifications.html" title="">
                  Notifications
                </a>
              </li>
              <li>
                <i className="ti-share"></i>
                <a href="people-nearby.html" title="">
                  People Nearby
                </a>
              </li>

              <li>
                <i className="ti-power-off"></i>
                <a href="landing.html" title="">
                  Logout
                </a>
              </li>
            </ul>
          </div>
        )}
        {props.layout === 3 && (
          <div class="widget">
            <h4 class="widget-title">Profile</h4>
            <div class="your-page">
              <figure>
                <a title="" href="#">
                  <img alt="" src="images/resources/friend-avatar9.jpg" />
                </a>
              </figure>
              <div class="page-meta">
                <a class="underline" title="" href="#">
                  {props.profileData?.name}
                </a>
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
                    <a data-toggle="tab" class="active">
                      Follow
                    </a>
                  </li>
                  <li class="nav-item">
                    <a data-toggle="tab" href="#link2" class="">
                      Block
                    </a>
                  </li>
                </ul>
                <div class="tab-content">
                  <div id="link1" class="tab-pane active fade show">
                    <a title="weekly-likes" href="#">
                      {props.profileData?.username}
                    </a>
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
                props.profileData?.data?.recentActivity?.map((item, i) => {
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
