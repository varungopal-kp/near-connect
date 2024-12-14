import React from "react";
import InfiniteScrollList from "../../components/InfiniteScroll";
import CommentList from "../../components/CommentList";
import { getFullUrl } from "../../helpers/utility";
import moment from "moment";
import swal from "sweetalert";
import ProfilePic from "../../components/ProfilePic";
import { useDispatch } from "react-redux";
import { fetchItems, updatePostLike } from "../../redux/actions/postActions";
import { UPDATE_ITEMS } from "../../redux/constants/common";
import { toast } from "react-toastify";

export default function Post(props) {
  const dispatch = useDispatch();

  const updateLikeDislike = (post, key) => {
    const updateItem = { ...post };
    const likeData = {
      post: post._id,
    };

    if (key === "like") {
      if (updateItem.isLiked) {
        updateItem.likes = updateItem.likes - 1;
      } else {
        updateItem.likes = updateItem.likes + 1;
        if (updateItem.isDisliked) {
          updateItem.dislikes = updateItem.dislikes - 1;
        }
      }
      const value = !updateItem.isLiked;
      updateItem.isLiked = value;
      updateItem.isDisliked = false;
      dispatch({ type: UPDATE_ITEMS, payload: updateItem });
      likeData.like = value;
      likeData.dislike = false;
    } else if (key === "dislike") {
      if (updateItem.isDisliked) {
        updateItem.dislikes = updateItem.dislikes - 1;
      } else {
        updateItem.dislikes = updateItem.dislikes + 1;
        if (updateItem.isLiked) {
          updateItem.likes = updateItem.likes - 1;
        }
      }
      const value = !updateItem.isDisliked;
      updateItem.isDisliked = value;
      updateItem.isLiked = false;
      dispatch({ type: UPDATE_ITEMS, payload: updateItem });
      likeData.dislike = value;
      likeData.like = false;
    }
    dispatch(updatePostLike(likeData)).catch((err) => {
      toast.error(err || "Failed");
    });
  };

  const infiniteRender = (item) => {
    return (
      <div className="central-meta item">
        <div className="user-post">
          <div className="friend-info">
            <figure>
              <ProfilePic url={item.user?.pic} defaultSize />
            </figure>
            <div className="friend-name">
              <ins>
                <a href="time-line.html" title="">
                  {item.user?.name}
                </a>
              </ins>
              <span>{moment(item?.createdAt).fromNow() || ""}</span>
            </div>
            <div className="description">
              <p>{item.content}</p>
            </div>
            <div className="post-meta">
              {item.fileType === "image" ? (
                <img
                  src={getFullUrl(item.file)}
                  alt="post"
                  style={{ width: "100%", maxHeight: "400px" }}
                ></img>
              ) : item.fileType === "video" ? (
                <video
                  src={getFullUrl(item.file)}
                  controls
                  autoPlay
                  className="img-fluid"
                  style={{ width: "100%", maxHeight: "400px" }}
                />
              ) : (
                ""
              )}
              <div className="we-video-info">
                <ul>
                  <li
                    onClick={() => {
                      const updateItem = { ...item };
                      updateItem.showComments = !updateItem.showComments;
                      dispatch({ type: UPDATE_ITEMS, payload: updateItem });
                    }}
                  >
                    <span
                      className="comment"
                      data-toggle="tooltip"
                      title="Comments"
                    >
                      <i
                        className={`fa ${
                          item.showComments
                            ? "fa fa-comments"
                            : "fa fa-comments-o"
                        }`}
                      ></i>
                      <ins>{item.comments}</ins>
                    </span>
                  </li>
                  <li
                    onClick={() => {
                      updateLikeDislike(item, "like");
                    }}
                  >
                    <span className="like" data-toggle="tooltip" title="like">
                      <i
                        className={`fa ${
                          item.isLiked ? "fa fa-heart" : "fa fa-heart-o"
                        }`}
                        aria-hidden="true"
                      ></i>
                      <ins>{item.likes}</ins>
                    </span>
                  </li>
                  <li
                    onClick={() => {
                      updateLikeDislike(item, "dislike");
                    }}
                  >
                    <span
                      className="dislike"
                      data-toggle="tooltip"
                      title="dislike"
                    >
                      <i
                        className={`fa ${
                          item.isDisliked
                            ? "fa-thumbs-down"
                            : "fa-thumbs-o-down"
                        }`}
                        aria-hidden="true"
                      ></i>

                      <ins>{item.dislikes}</ins>
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {item.showComments && <CommentList postId={item._id} />}
        </div>
      </div>
    );
  };

  return (
    <div className="loadMore">
      <InfiniteScrollList
        infiniteRender={infiniteRender}
        limit={10}
        fetchItems={fetchItems}
        user={props.accountDetails?._id}
      />
    </div>
  );
}
