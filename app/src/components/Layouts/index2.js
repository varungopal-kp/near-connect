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
  const dispatch = useDispatch();
  const [_layout, setLayout] = React.useState(0);

  const { username } = useParams();

  const [profile, setProfile] = React.useState({});

  useEffect(() => {
    dispatch(getProfile());
    dispatch(getFollowUserDetails(username))
      .then((res) => {
        console.log(res.data);
        if (res.data) {
          setProfile(res.data?.data);
        }
      })
      .catch((err) => {
        toast.error(err || "Something went wrong");
      });
  }, []);

  useEffect(() => {
    if (profile?.userRelation === "friends") {
      setLayout(4);
    } else {
      setLayout(3);
    }
  }, [profile?._id]);

  console.log(profile, _layout);

  return (
    <div className="theme-layout">
      {_layout !== 0 && profile?._id && (
        <>
          {/* Header and Navigation */}
          <Header layout={_layout} profileData={profile}/>
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
                          accountId: profile?._id,
                          userRelation: profile?.userRelation,
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
