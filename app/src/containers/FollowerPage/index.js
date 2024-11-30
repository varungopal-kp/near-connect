import React, { useState } from "react";
import Followers from "./followers";
import FollowerRequest from "./followerRequest";
import { Tab, Nav } from "react-bootstrap";

export default function Index() {
  const [key, setKey] = useState("followers");

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
                <span style={{ float: "right" }}>55</span>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="followersRequest" style={{ float: "left" }}>
                  Follow Requests
                </Nav.Link>
                <span style={{ float: "right" }}>60</span>
              </Nav.Item>
            </Nav>

            <Tab.Content>
              <Tab.Pane eventKey="followers">
                {key === "followers" && <Followers />}
              </Tab.Pane>
              <Tab.Pane eventKey="followersRequest">
                {key === "followersRequest" && <FollowerRequest />}
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </div>
    </div>
  );
}
