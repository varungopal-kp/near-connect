import React from "react";

export default function Footer() {
  return (
    <>
      <footer>
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-4">
              <div className="widget">
                <div className="foot-logo">
                  <div className="logo">
                    <a href="index-2.html" title="">
                      NearConnect
                    </a>
                  </div>
                  <p>
                    The path to meaningful connections with people and
                    communities around you. Discover and connect with friends,
                    events, and opportunities in your vicinity.
                  </p>
                </div>
                <ul className="location">
                  <li>
                    <i className="ti-map-alt"></i>
                    <p>33 new montgomery st.750 san francisco, CA USA 94105.</p>
                  </li>
                  <li>
                    <i className="ti-mobile"></i>
                    <p>+1-56-346 345</p>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-4 col-md-4">
              <div className="widget">
                <div className="widget-title">
                  <h4>follow</h4>
                </div>
                <ul className="list-style">
                  <li>
                    <i className="fa fa-facebook-square"></i>{" "}
                    <a href="https://web.facebook.com/shopcircut/" title="">
                      facebook
                    </a>
                  </li>
                  <li>
                    <i className="fa fa-twitter-square"></i>
                    <a href="https://twitter.com/login?lang=en" title="">
                      twitter
                    </a>
                  </li>
                  <li>
                    <i className="fa fa-instagram"></i>
                    <a href="https://www.instagram.com/?hl=en" title="">
                      instagram
                    </a>
                  </li>
                  <li>
                    <i className="fa fa-google-plus-square"></i>{" "}
                    <a href="https://plus.google.com/discover" title="">
                      Google+
                    </a>
                  </li>
                  <li>
                    <i className="fa fa-pinterest-square"></i>{" "}
                    <a href="https://www.pinterest.com/" title="">
                      Pintrest
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-4 col-md-4">
              <div className="widget">
                <div className="widget-title">
                  <h4>Navigate</h4>
                </div>
                <ul className="list-style">
                  <li>
                    <a href="about.html" title="">
                      about us
                    </a>
                  </li>
                  <li>
                    <a href="contact.html" title="">
                      contact us
                    </a>
                  </li>
                  <li>
                    <a href="terms.html" title="">
                      terms & Conditions
                    </a>
                  </li>
                  <li>
                    <a href="#" title="">
                      RSS syndication
                    </a>
                  </li>
                  <li>
                    <a href="sitemap.html" title="">
                      Sitemap
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <div className="bottombar">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <span className="copyright">
                <a target="_blank" href="https://www.templateshub.net">
                  @copyright 2021 NearConnect
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
