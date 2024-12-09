// Loader.js
import React from "react";
import "./index.css"; // Optional for styling
import { useSelector } from "react-redux";

export default function Loader() {
  const loading = useSelector(
    (state) => state.common?.loading || state.post?.loading
  );
  if (!loading) return null;
  return (
    <div className="loader">
      <div className="spinner"></div>
    </div>
  );
}
