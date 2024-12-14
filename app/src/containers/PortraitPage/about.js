import React from "react";


export default function About(props) {
  return (
    <div className="new-postbox">
      <h4>About </h4>

      <p>
        {props.accountDetails?.about}
      </p>
    </div>
  );
}
