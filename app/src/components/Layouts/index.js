import React, { useEffect } from "react";

import Header from "./Header";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";
import Footer from "./Footer";
import { useDispatch, useSelector } from "react-redux";
import { getProfile } from "../../redux/actions/commonActions";

export default function Index({ children }) {
  const dispatch = useDispatch();

  const profileData = useSelector((state) => state.common.profile);

  useEffect(() => {
    dispatch(getProfile());
  }, []);

  return (
    <div className="theme-layout">
      {/* Header and Navigation */}
      <Header />
      <section>
        <div className="gap gray-bg">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
                <div className="row" id="page-contents">
                  {/* Left Sidebar */}
                  <LeftSidebar profileData={profileData}/>

                  {/* Main content section renders children */}
                  <>{children}</>

                  {/* Right Sidebar */}
                  <RightSidebar />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <Footer />
    </div>
  );
}
