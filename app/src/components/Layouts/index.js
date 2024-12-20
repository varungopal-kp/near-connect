import React, { useEffect } from "react";

import Header from "./Header";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";
import Footer from "./Footer";
import { useDispatch, useSelector } from "react-redux";
import { getProfile } from "../../redux/actions/commonActions";

export default function Index({ children, layout }) {
  let defaultLayout = 1;

  const token = localStorage.getItem("token");

  const [_layout, setLayout] = React.useState(layout || defaultLayout);

  const dispatch = useDispatch();

  const common = useSelector((state) => state.common);

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
    } else {
      dispatch(getProfile());
    }
  }, []);

  useEffect(() => {
    setLayout(layout || defaultLayout);
  }, [layout]); // Run when the `layout` prop changes

  return (
    <div className="theme-layout">
      {token && (
        <>
          {/* Header and Navigation */}
          <Header layout={_layout} profileData={common.profile} />
          <section>
            <div className="gap gray-bg">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="row" id="page-contents">
                      {/* Left Sidebar */}
                      <LeftSidebar
                        profileData={common.profile}
                        layout={_layout}
                      />

                      {/* Main content section renders children */}

                      <>{children}</>

                      {/* Right Sidebar */}
                      <RightSidebar layout={_layout} />
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
