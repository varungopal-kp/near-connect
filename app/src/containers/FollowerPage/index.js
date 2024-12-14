import React, { useEffect, useState } from "react";
import Followers from "./followers";
import FollowerRequest from "./followerRequest";
import { Tab, Nav } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getFollowCount } from "../../redux/actions/followActions";

export default function Index(props) {
  const [key, setKey] = useState("followers");

  const [followersCount, setFollowersCount] = useState(0);
  const [followRequestCount, setFollowRequestCount] = useState(0);
  const [friendsCount, setFriendsCount] = useState(0);
  const profileData = useSelector((state) => state.common?.profile);

  const dispatch = useDispatch();

  useEffect(() => {
    if (props.accountId) {
      dispatch(getFollowCount(props.accountId)).then((res) => {
        if (res.data) {
          const newfollowersCount = res.data.data?.followersCount || 0;
          const newfollowRequestCount = res.data.data?.followRequestCount || 0;
          const newfriendsCount = res.data.data?.friendsCount || 0;
          setFollowersCount(newfollowersCount);
          setFollowRequestCount(newfollowRequestCount);
          setFriendsCount(newfriendsCount);
        }
      });
    } else {
      setFollowersCount(+profileData?.followersCount || 0);
      setFollowRequestCount(+profileData?.requestsCount || 0);
      setFriendsCount(+profileData?.friendsCount || 0);
    }
  }, [profileData?._id, props.accountId]);

  return (
    <div class="col-lg-6">
      <div class="central-meta">
        <div class="frnds">
          <Tab.Container id="tabs" activeKey={key} onSelect={(k) => setKey(k)}>
            <Nav variant="tabs">
              <Nav.Item>
                <Nav.Link eventKey="followers" style={{ float: "left" }}>
                  Followers
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
                  <Followers
                    setFollowersCount={setFollowersCount}
                    accountId={props.accountId}
                    followersCount={followersCount}
                    friendsCount={friendsCount}
                  />
                )}
              </Tab.Pane>
              <Tab.Pane eventKey="followersRequest">
                {key === "followersRequest" && (
                  <FollowerRequest
                    setFollowRequestCount={setFollowRequestCount}
                    setFollowersCount={setFollowersCount}
                    accountId={props.accountId}
                    followersCount={followersCount}
                    followRequestCount={followRequestCount}
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
