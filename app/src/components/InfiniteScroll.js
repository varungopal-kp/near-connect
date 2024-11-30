import React, { useEffect, memo, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";

function InfiniteScrollList({ infiniteRender, limit = 10, fetchItems }) {
  const dispatch = useDispatch();
  const { common } = useSelector((state) => state);

  const { list, loading, page, hasMore } = common;

  const initialFetchRef = useRef(false); // Reference to the initial fetch for strict mode

  useEffect(() => {
    if (!initialFetchRef.current) {
      dispatch(fetchItems(page, limit));
      initialFetchRef.current = true;
    }
  }, []);


  const fetchMoreData = () => {
    if (!loading && hasMore) {
      dispatch(fetchItems(page, limit));
    }
  };

  return (
    <div>
      <InfiniteScroll
        dataLength={list.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={<p style={{ textAlign: "center" }}>No more data to load</p>}
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
