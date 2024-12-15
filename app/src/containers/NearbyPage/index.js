import React from "react";
import { getNearByUsers } from "../../redux/actions/commonActions";
import InfiniteScrollList from "../../components/InfiniteScroll";
import { Link } from "react-router-dom";
import ProfilePic from "../../components/ProfilePic";

export default function Index(props) {
 

  const infiniteRender = (item) => {
    return (
      <li>
        <div class="nearly-pepls">
          <figure>
            <a href="time-line.html" title="">
             <ProfilePic url={item.pic} defaultSize />
            </a>
          </figure>
          <div class="pepl-info">
            <h4>
              <a href="time-line.html" title="">
                {item.name}
              </a>
            </h4>
            <span>{item.username}</span>
            <em>
              <i class="fa fa-map-marker"></i>{item.place}
            </em>
            <Link to={`/account/${item.username}`} class="add-butn" >
             View
            </Link>
          </div>
        </div>
      </li>
    );
  };

  return (
    <div class="col-lg-6">
      <div class="central-meta">
        {/* <div class="nearby-pepl">
            <div class="nearby-map">
                <div id="map-canvas"></div>
            </div>
        </div> */}
        <ul class="nearby-contct">
          <InfiniteScrollList
            infiniteRender={infiniteRender}
            limit={10}
            fetchItems={getNearByUsers}
            
          />
        </ul>
      </div>
    </div>
  );
}
