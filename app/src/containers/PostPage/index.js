import React from "react";
import { toast } from "react-toastify";

import { useDispatch, useSelector } from "react-redux"; // Import useDispatch
import {
  updatePostLike,
  deletePost,
  fetchItems,
} from "../../redux/actions/postActions";

import InfiniteScrollList from "../../components/InfiniteScroll";
import moment from "moment";
import { getFullUrl } from "../../helpers/utility";
import CommentList from "../../components/CommentList";
import { DELETE_ITEM, UPDATE_ITEMS } from "../../redux/constants/common";
import swal from "sweetalert";
import ProfilePic from "../../components/ProfilePic";

export default function Index(props) {
  const dispatch = useDispatch();
  const { loading, profile } = useSelector((state) => state.common);

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

  const handlePostDelete = (id) => {
    dispatch(deletePost(id))
      .then((res) => {
        if (res.data) {
          dispatch({ type: DELETE_ITEM, payload: id });
          toast.success("Post deleted successfully");
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Something went wrong");
      });
  };

  const infiniteRender = (item) => {
    return (
      <div className="central-meta item">
        <div className="user-post">
          <div className="friend-info">
            <figure>
              <ProfilePic url={item.user?.pic} />
            </figure>
            <div className="friend-name">
              <ins>
                <a href="time-line.html" title="">
                  {item.user?.name}
                </a>
              </ins>
              <span>{moment(item?.createdAt).fromNow() || ""}</span>
              {item.canModify && (
                <a
                  href=""
                  className="delete-post"
                  title="Reply"
                  style={{ float: "right", fontSize: "12px" }}
                  onClick={(e) => {
                    e.preventDefault();
                    swal({
                      title: "Are you sure?",
                      icon: "warning",
                      buttons: true,
                      dangerMode: true,
                    }).then((willDelete) => {
                      if (willDelete) {
                        handlePostDelete(item._id);
                      }
                    });
                  }}
                >
                  Remove
                </a>
              )}
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
    <div className="col-lg-6">
      {/* add post new box */}
      {profile?._id && (
        <div className="loadMore">
          <InfiniteScrollList
            infiniteRender={infiniteRender}
            limit={10}
            fetchItems={fetchItems}
            user={profile?._id}
          />
        </div>
      )}
    </div>
  );
}
