import React from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { removeFriend } from "../../redux/actions/followActions";
import swal from "sweetalert";

export default function RightSidebar(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  return (
    <div className="col-lg-3">
      <aside className="sidebar static">
        {props.layout === 1 && (
          <div className="widget friend-list stick-widget">
            <h4 className="widget-title">Friends</h4>
            <div id="searchDir"></div>
            <ul id="people-list" className="friendz-list">
              <li>
                <figure>
                  <img src="images/resources/friend-avatar.jpg" alt="" />
                  <span className="status f-online"></span>
                </figure>
                <div className="friendz-meta">
                  <a href="time-line.html">bucky barnes</a>
                  <i>
                    <a
                      href="https://wpkixx.com/cdn-cgi/l/email-protection"
                      className="__cf_email__"
                      data-cfemail="4136282f352433322e2d25243301262c20282d6f222e2c"
                    >
                      [email&#160;protected]
                    </a>
                  </i>
                </div>
              </li>
              <li>
                <figure>
                  <img src="images/resources/friend-avatar2.jpg" alt="" />
                  <span className="status f-away"></span>
                </figure>
                <div className="friendz-meta">
                  <a href="time-line.html">Sarah Loren</a>
                  <i>
                    <a
                      href="https://wpkixx.com/cdn-cgi/l/email-protection"
                      className="__cf_email__"
                      data-cfemail="3a585b48545f497a5d575b535614595557"
                    >
                      [email&#160;protected]
                    </a>
                  </i>
                </div>
              </li>
              <li>
                <figure>
                  <img src="images/resources/friend-avatar3.jpg" alt="" />
                  <span className="status f-off"></span>
                </figure>
                <div className="friendz-meta">
                  <a href="time-line.html">jason borne</a>
                  <i>
                    <a
                      href="https://wpkixx.com/cdn-cgi/l/email-protection"
                      className="__cf_email__"
                      data-cfemail="127873617d7c7052757f737b7e3c717d7f"
                    >
                      [email&#160;protected]
                    </a>
                  </i>
                </div>
              </li>
              <li>
                <figure>
                  <img src="images/resources/friend-avatar4.jpg" alt="" />
                  <span className="status f-off"></span>
                </figure>
                <div className="friendz-meta">
                  <a href="time-line.html">Cameron diaz</a>
                  <i>
                    <a
                      href="https://wpkixx.com/cdn-cgi/l/email-protection"
                      className="__cf_email__"
                      data-cfemail="620803110d0c0022050f030b0e4c010d0f"
                    >
                      [email&#160;protected]
                    </a>
                  </i>
                </div>
              </li>
              <li>
                <figure>
                  <img src="images/resources/friend-avatar5.jpg" alt="" />
                  <span className="status f-online"></span>
                </figure>
                <div className="friendz-meta">
                  <a href="time-line.html">daniel warber</a>
                  <i>
                    <a
                      href="https://wpkixx.com/cdn-cgi/l/email-protection"
                      className="__cf_email__"
                      data-cfemail="0963687a66676b496e64686065276a6664"
                    >
                      [email&#160;protected]
                    </a>
                  </i>
                </div>
              </li>
              <li>
                <figure>
                  <img src="images/resources/friend-avatar6.jpg" alt="" />
                  <span className="status f-away"></span>
                </figure>
                <div className="friendz-meta">
                  <a href="time-line.html">andrew</a>
                  <i>
                    <a
                      href="https://wpkixx.com/cdn-cgi/l/email-protection"
                      className="__cf_email__"
                      data-cfemail="5b313a283435391b3c363a323775383436"
                    >
                      [email&#160;protected]
                    </a>
                  </i>
                </div>
              </li>
              <li>
                <figure>
                  <img src="images/resources/friend-avatar7.jpg" alt="" />
                  <span className="status f-off"></span>
                </figure>
                <div className="friendz-meta">
                  <a href="time-line.html">amy watson</a>
                  <i>
                    <a
                      href="https://wpkixx.com/cdn-cgi/l/email-protection"
                      className="__cf_email__"
                      data-cfemail="472d263428292507202a262e2b6924282a"
                    >
                      [email&#160;protected]
                    </a>
                  </i>
                </div>
              </li>
            </ul>
            <div className="chat-box">
              <div className="chat-head">
                <span className="status f-online"></span>
                <h6>Bucky Barnes</h6>
                <div className="more">
                  <span>
                    <i className="ti-more-alt"></i>
                  </span>
                  <span className="close-mesage">
                    <i className="ti-close"></i>
                  </span>
                </div>
              </div>
              <div className="chat-list">
                <ul>
                  <li className="me">
                    <div className="chat-thumb">
                      <img src="images/resources/chatlist1.jpg" alt="" />
                    </div>
                    <div className="notification-event">
                      <span className="chat-message-item">
                        Hi James! Please remember to buy the food for tomorrow!
                        I’m gonna be handling the gifts and Jake’s gonna get the
                        drinks
                      </span>
                      <span className="notification-date">
                        <time
                          datetime="2004-07-24T18:18"
                          className="entry-date updated"
                        >
                          Yesterday at 8:10pm
                        </time>
                      </span>
                    </div>
                  </li>
                  <li className="you">
                    <div className="chat-thumb">
                      <img src="images/resources/chatlist2.jpg" alt="" />
                    </div>
                    <div className="notification-event">
                      <span className="chat-message-item">
                        Hi James! Please remember to buy the food for tomorrow!
                        I’m gonna be handling the gifts and Jake’s gonna get the
                        drinks
                      </span>
                      <span className="notification-date">
                        <time
                          datetime="2004-07-24T18:18"
                          className="entry-date updated"
                        >
                          Yesterday at 8:10pm
                        </time>
                      </span>
                    </div>
                  </li>
                  <li className="me">
                    <div className="chat-thumb">
                      <img src="images/resources/chatlist1.jpg" alt="" />
                    </div>
                    <div className="notification-event">
                      <span className="chat-message-item">
                        Hi James! Please remember to buy the food for tomorrow!
                        I’m gonna be handling the gifts and Jake’s gonna get the
                        drinks
                      </span>
                      <span className="notification-date">
                        <time
                          datetime="2004-07-24T18:18"
                          className="entry-date updated"
                        >
                          Yesterday at 8:10pm
                        </time>
                      </span>
                    </div>
                  </li>
                </ul>
                <form className="text-box">
                  <textarea placeholder="Post enter to post..."></textarea>
                  <div className="add-smiles">
                    <span
                      title="add icon"
                      className="em em-expressionless"
                    ></span>
                  </div>
                  <div className="smiles-bunch">
                    <i className="em em---1"></i>
                    <i className="em em-smiley"></i>
                    <i className="em em-anguished"></i>
                    <i className="em em-laughing"></i>
                    <i className="em em-angry"></i>
                    <i className="em em-astonished"></i>
                    <i className="em em-blush"></i>
                    <i className="em em-disappointed"></i>
                    <i className="em em-worried"></i>
                    <i className="em em-kissing_heart"></i>
                    <i className="em em-rage"></i>
                    <i className="em em-stuck_out_tongue"></i>
                  </div>
                  <button type="submit"></button>
                </form>
              </div>
            </div>
          </div>
        )}
        {props.layout === 1 && (
          <div className="widget stick-widget">
            <h4 className="widget-title">Who's follownig</h4>
            <ul className="followers">
              <li>
                <figure>
                  <img src="images/resources/friend-avatar2.jpg" alt="" />
                </figure>
                <div className="friend-meta">
                  <h4>
                    <a href="time-line.html" title="">
                      Kelly Bill
                    </a>
                  </h4>
                  <a href="#" title="" className="underline">
                    Add Friend
                  </a>
                </div>
              </li>
              <li>
                <figure>
                  <img src="images/resources/friend-avatar4.jpg" alt="" />
                </figure>
                <div className="friend-meta">
                  <h4>
                    <a href="time-line.html" title="">
                      Issabel
                    </a>
                  </h4>
                  <a href="#" title="" className="underline">
                    Add Friend
                  </a>
                </div>
              </li>
              <li>
                <figure>
                  <img src="images/resources/friend-avatar6.jpg" alt="" />
                </figure>
                <div className="friend-meta">
                  <h4>
                    <a href="time-line.html" title="">
                      Andrew
                    </a>
                  </h4>
                  <a href="#" title="" className="underline">
                    Add Friend
                  </a>
                </div>
              </li>
              <li>
                <figure>
                  <img src="images/resources/friend-avatar8.jpg" alt="" />
                </figure>
                <div className="friend-meta">
                  <h4>
                    <a href="time-line.html" title="">
                      Sophia
                    </a>
                  </h4>
                  <a href="#" title="" className="underline">
                    Add Friend
                  </a>
                </div>
              </li>
              <li>
                <figure>
                  <img src="images/resources/friend-avatar3.jpg" alt="" />
                </figure>
                <div className="friend-meta">
                  <h4>
                    <a href="time-line.html" title="">
                      Allen
                    </a>
                  </h4>
                  <a href="#" title="" className="underline">
                    Add Friend
                  </a>
                </div>
              </li>
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
