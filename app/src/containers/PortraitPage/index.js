import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import Abouts from "./abouts";
import Post from "./post";

export default function Index(props) {
  const dispatch = useDispatch();
  const [page, setPage] = React.useState(0);

  useEffect(() => {
    if (props.userRelation === "friends") {
      setPage(2);
    } else {
      setPage(1);
    }
  }, []);

  return (
    <div class="col-lg-6">
      <div class="central-meta">
        {page === 1 ? (
          <Abouts user={props.accountId} />
        ) : (
          <Post user={props.accountId} />
        )}
      </div>
    </div>
  );
}
