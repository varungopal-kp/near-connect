import React from "react";

export default function index() {

  return (
    <div class="col-lg-6">
      <div class="central-meta">
        <div class="frnds">
          <ul class="nav nav-tabs">
            <li class="nav-item">
              <a class="active" href="#frends" data-toggle="tab">
                My Friends
              </a>{" "}
              <span>55</span>
            </li>
            
          </ul>

          <div class="tab-content">
            <div class="tab-pane active fade show " id="frends">
              <ul class="nearby-contct">
                <li>
                  <div class="nearly-pepls">
                    <figure>
                      <a href="time-line.html" title="">
                        <img src="images/resources/friend-avatar9.jpg" alt="" />
                      </a>
                    </figure>
                    <div class="pepl-info">
                      <h4>
                        <a href="time-line.html" title="">
                          jhon kates
                        </a>
                      </h4>
                      <span>ftv model</span>
                      <a
                        href="#"
                        title=""
                        class="add-butn more-action"
                        data-ripple=""
                      >
                        unfriend
                      </a>
                      <a href="#" title="" class="add-butn" data-ripple="">
                        add friend
                      </a>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="nearly-pepls">
                    <figure>
                      <a href="time-line.html" title="">
                        <img src="images/resources/nearly1.jpg" alt="" />
                      </a>
                    </figure>
                    <div class="pepl-info">
                      <h4>
                        <a href="time-line.html" title="">
                          sophia Gate
                        </a>
                      </h4>
                      <span>tv actresses</span>
                      <a
                        href="#"
                        title=""
                        class="add-butn more-action"
                        data-ripple=""
                      >
                        unfriend
                      </a>
                      <a href="#" title="" class="add-butn" data-ripple="">
                        add friend
                      </a>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="nearly-pepls">
                    <figure>
                      <a href="time-line.html" title="">
                        <img src="images/resources/nearly2.jpg" alt="" />
                      </a>
                    </figure>
                    <div class="pepl-info">
                      <h4>
                        <a href="time-line.html" title="">
                          sara grey
                        </a>
                      </h4>
                      <span>work at IBM</span>
                      <a
                        href="#"
                        title=""
                        class="add-butn more-action"
                        data-ripple=""
                      >
                        unfriend
                      </a>
                      <a href="#" title="" class="add-butn" data-ripple="">
                        add friend
                      </a>
                    </div>
                  </div>
                </li>
              </ul>
              <div class="lodmore">
                <button class="btn-view btn-load-more"></button>
              </div>
            </div>
           
          </div>
        </div>
      </div>
    </div>
  );
}
