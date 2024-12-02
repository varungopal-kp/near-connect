import React, { useEffect, useState } from "react";
import Followers from "./followers";
import FollowerRequest from "./followerRequest";
import { Tab, Nav } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { getFollowCount } from "../../redux/actions/followActions";

export default function Index() {
  const [key, setKey] = useState("followers");

  const [followersCount, setFollowersCount] = useState(0);
  const [followRequestCount, setFollowRequestCount] = useState(0);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getFollowCount()).then((res) => {
      if (res.data) {
        const followersCount = res.data.data?.followersCount || 0;
        const followRequestCount = res.data.data?.followRequestCount || 0;
        setFollowersCount(followersCount);
        setFollowRequestCount(followRequestCount);
      }
    });
  }, []);

  return (
    <div class="col-lg-6">
      <div class="central-meta">
        <div class="frnds">
          <Tab.Container id="tabs" activeKey={key} onSelect={(k) => setKey(k)}>
            <Nav variant="tabs">
              <Nav.Item>
                <Nav.Link eventKey="followers" style={{ float: "left" }}>
                  My Followers
                </Nav.Link>
                <span style={{ float: "right" }}>{followersCount}</span>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="followersRequest" style={{ float: "left" }}>
                  Follow Requests
                </Nav.Link>
                <span style={{ float: "right" }}>{followRequestCount}</span>
              </Nav.Item>
            </Nav>

            <Tab.Content>
              <Tab.Pane eventKey="followers">
                {key === "followers" && (
                  <Followers setFollowersCount={setFollowersCount} />
                )}
              </Tab.Pane>
              <Tab.Pane eventKey="followersRequest">
                {key === "followersRequest" && (
                  <FollowerRequest
                  setFollowRequestCount={setFollowRequestCount}
                  />
                )}
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </div>
    </div>
  );
}
