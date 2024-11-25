import React from "react";

export default function LeftSidebar() {
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
          <h4 className="widget-title">Shortcuts</h4>
          <ul className="naves">
            <li>
              <i className="ti-user"></i>
              <a href="timeline-friends.html" title="">
                friends
              </a>
            </li>
            <li>
              <i className="ti-image"></i>
              <a href="timeline-photos.html" title="">
                images
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
            <li>
              <div className="activity-meta">
                <i>10 hours Ago</i>
                <span>
                  <a href="#" title="">
                    Commented on Video posted{" "}
                  </a>
                </span>
                <h6>
                  by <a href="newsfeed.html">black demon.</a>
                </h6>
              </div>
            </li>
            <li>
              <div className="activity-meta">
                <i>30 Days Ago</i>
                <span>
                  <a href="newsfeed.html" title="">
                    Posted your status. “Hello guys, how are you?”
                  </a>
                </span>
              </div>
            </li>
            <li>
              <div className="activity-meta">
                <i>2 Years Ago</i>
                <span>
                  <a href="#" title="">
                    Share a video on her timeline.
                  </a>
                </span>
                <h6>
                  "<a href="newsfeed.html">you are so funny mr.been.</a>"
                </h6>
              </div>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
