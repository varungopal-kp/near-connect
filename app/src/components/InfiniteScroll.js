import React, { useEffect, memo, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import { CLEAR_LIST } from "../redux/constants/common";

function InfiniteScrollList({
  infiniteRender,
  limit = 10,
  fetchItems,
  search = "",
  user = "",
  listKey = "list",
  lastmessage = true,
}) {
  const dispatch = useDispatch();
  const { common } = useSelector((state) => state);

  const { [listKey]: list, loading, page, hasMore } = common;

  const initialFetchRef = useRef(false); // Reference to the initial fetch for strict mode

  const prevUser = useRef(user);

  // Clear the list when the component mounts for switching tabs
  useEffect(() => {
    dispatch({ type: CLEAR_LIST, listKey: listKey });
  }, []);

  // Fetch items when page changes coz redux state is not updated syhronously
  useEffect(() => {
    if (!initialFetchRef.current && page === 1) {
      dispatch(fetchItems({ page, limit, search, user }));
      initialFetchRef.current = true;
    } else {
      // for multiple components in same page with user change
      if (user) {
        if (prevUser.current !== user) {
          dispatch({ type: CLEAR_LIST, listKey: listKey });
          fetchData(1);
          prevUser.current = user;
        }
      }
    }
  }, [page, user]);

  const fetchMoreData = () => {
    if (!loading && hasMore) {
      dispatch(fetchItems({ page, limit, search, user }));
    }
  };

  const fetchData = (_page) => {
    dispatch(fetchItems({ _page, limit, search, user }));
  };

  return (
    <div>
      <InfiniteScroll
        dataLength={list?.length || 0}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<div style={{ textAlign: "center" }}>Loading...</div>}
        endMessage={
          <>
            {list?.length === 0 ? (
              <p style={{ textAlign: "center" }}>No data found.</p>
            ) : (
              lastmessage && (
                <p style={{ textAlign: "center", marginTop: "20px" }}>
                  No more data to load.
                </p>
              )
            )}
          </>
        }
      >
        {list?.map((item) => (
          <div key={item.id} className="item">
            {infiniteRender(item)}
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
}

export default memo(InfiniteScrollList);
