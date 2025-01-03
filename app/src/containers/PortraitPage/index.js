import React, { useEffect } from "react";

import About from "./about";
import Post from "./post";

export default function Index(props) {
  
  const [page, setPage] = React.useState(0);

  useEffect(() => {
    if (props.accountDetails?.userRelation === "friends") {
      setPage(2);
    } else {
      setPage(1);
    }
  }, []);

  return (
    <div class="col-lg-6">
      <div class="central-meta">
        {page === 1 ? (
          <About accountDetails={props.accountDetails} />
        ) : (
          <Post user={props.accountDetails} />
        )}
      </div>
    </div>
  );
}
