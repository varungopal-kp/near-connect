import React from "react";
import moment from "moment";

export default function LeftSidebar(props) {

  return (
    <div className="col-lg-3">
      <aside className="sidebar static">
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
        <div className="widget">
          <h4 className="widget-title">Menu</h4>
          <ul className="naves">
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
        <div className="widget">
          <h4 className="widget-title">Recent Activity</h4>
          <ul className="activitiez">
            {props.profileData &&
              props.profileData?.data?.recentActivity?.map((item, i) => {
                return (
                  <li key={i}>
                    <div className="activity-meta">
                      <i>{moment(item.createdAt).fromNow() || ""}</i>
                      <span>
                        {item.activity === "Posted" ? (
                          <a href="#" title="">
                            New Post is shared
                          </a>
                        ) : (
                          <a href="#" title="">
                            {item.activity} on Post posted{" "}
                          </a>
                        )}
                      </span>
                      {item.activity !== "Posted" && (
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
      </aside>
    </div>
  );
}
