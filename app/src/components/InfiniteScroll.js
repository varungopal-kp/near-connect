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
}) {

  const dispatch = useDispatch();
  const { common } = useSelector((state) => state);

  const { list, loading, page, hasMore } = common;

  const initialFetchRef = useRef(false); // Reference to the initial fetch for strict mode

  // Clear the list when the component mounts for switching tabs
  useEffect(() => {
    dispatch({ type: CLEAR_LIST });
  }, []);

  // Fetch items when page changes coz redux state is not updated syhronously
  useEffect(() => {
    if (!initialFetchRef.current && page === 1) {
      dispatch(fetchItems({page, limit, search, user}));
      initialFetchRef.current = true;
    }
  }, [page]);

  const fetchMoreData = () => {
    if (!loading && hasMore) {
      dispatch(fetchItems({page, limit, search, user}));
    }
  };

  return (
    <div>
      <InfiniteScroll
        dataLength={list.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<div style={{ textAlign: "center" }}>Loading...</div>}
        endMessage={
          <>
            {list.length === 0 ? (
              <p style={{ textAlign: "center" }}>No data found.</p>
            ) : (
              <p style={{ textAlign: "center", marginTop: "20px" }}>
                No more data to load.
              </p>
            )}
          </>
        }
      >
        {list.map((item) => (
          <div key={item.id} className="item">
            {infiniteRender(item)}
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
}

export default memo(InfiniteScrollList);
