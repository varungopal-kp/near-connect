import React, { useEffect } from "react";
import { useSelector } from "react-redux";

export default function ProfilePic(props) {
  const [image, setImage] = React.useState(
    `${process.env.REACT_APP_URL}/images/propic.jpg`
  );

  let picStyle = {};

  if (props.defaultSize) {
    picStyle = { width: "60px", height: "60px" };
  }
  if (props.style) {
    picStyle = {
      ...picStyle,
      ...props.style,
    };
  }

  const profileData = useSelector((state) => state.common.profile);

  useEffect(() => {
    if (props.url && !props.profile) {
      setImage(`${process.env.REACT_APP_BASE_URL}/${props.url}`);
    }
  }, [props.url, props.profile]);

  useEffect(() => {
    if (props.profile && profileData) {
      if (props.thumb) {
        setImage(`${process.env.REACT_APP_BASE_URL}/${profileData.thumbnail}`);
      } else if (profileData?.pic) {
        setImage(`${process.env.REACT_APP_BASE_URL}/${profileData.pic}`);
      }
    }
  }, [profileData, props.profile]);

  return (
    <img src={`${image}`} alt="pic" style={picStyle} loading="lazy" srcset />
  );
}
