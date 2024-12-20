import React, { useEffect } from "react";

import Header from "./Header";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";
import Footer from "./Footer";
import { useDispatch } from "react-redux";
import { getProfile } from "../../redux/actions/commonActions";
import { useParams } from "react-router-dom";
import { getFollowUserDetails } from "../../redux/actions/followActions";
import { toast } from "react-toastify";

export default function Index({ children }) {
  const token = localStorage.getItem("token");

  const dispatch = useDispatch();
  const [_layout, setLayout] = React.useState(0);

  const { username } = useParams();

  const [profile, setProfile] = React.useState({});
  const [blocked, setBlocked] = React.useState(false);

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
    }else{
      dispatch(getProfile());
      dispatch(getFollowUserDetails(username))
        .then((res) => {
          if (res.data) {
            const data = res.data?.data;
            if (data.blockedByHim) {
              return setBlocked(true);
            }
            return setProfile(data);
          }
        })
        .catch((err) => {
          toast.error(err || "Something went wrong");
        });
    }
  }, []);


  useEffect(() => {
    if (profile?.userRelation === "friends") {
      setLayout(4);
    } else {
      setLayout(3);
    }
  }, [profile?._id]);

  return (
    <div className="theme-layout">
      {_layout !== 0 && profile?._id && blocked === false && token && (
        <>
          {/* Header and Navigation */}
          <Header layout={_layout} profileData={profile} />
          <section>
            <div className="gap gray-bg">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="row" id="page-contents">
                      {/* Left Sidebar */}
                      <LeftSidebar profileData={profile} layout={_layout} />

                      {/* Main content section renders children */}
                      {/* Pass props to children */}
                      <>
                        {React.cloneElement(children, {
                          accountDetails: profile,
                          layout: _layout,
                        })}
                      </>

                      {/* Right Sidebar */}
                      <RightSidebar layout={_layout} profileData={profile} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* Footer */}
          <Footer />
        </>
      )}
    </div>
  );
}
