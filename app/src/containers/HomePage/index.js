import React from "react";
import { toast } from "react-toastify";
import { Field, Formik } from "formik";
import { useDispatch, useSelector } from "react-redux"; // Import useDispatch
import {
  createPost,
  updatePostLike,
  deletePost,
  fetchItems,
} from "../../redux/actions/postActions";
import { postSchema } from "../../validations/postSchema";
import { validator } from "../../helpers/validator";
import InfiniteScrollList from "../../components/InfiniteScroll";
import moment from "moment";
import { getFullUrl } from "../../helpers/utility";
import CommentList from "../../components/CommentList";
import {
  CREATE_ITEM,
  DELETE_ITEM,
  UPDATE_ITEMS,
} from "../../redux/constants/common";
import swal from "sweetalert";
import ProfilePic from "../../components/ProfilePic";

export default function Index() {
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.common);

  const [postFile, setPostFile] = React.useState(null);
  const [postFileType, setPostFileType] = React.useState(null);

  const maxFileSize = 100 * 1024 * 1024;

  const clearFiles = () => {
    setPostFile(null);
    setPostFileType(null);
  };

  const fileUrl = () => {
    if (postFileType) {
      return URL.createObjectURL(postFile);
    }
    return "";
  };

  const handlePostFile = (e, type) => {
    try {
      const file = e.target.files[0];

      if (file.size > maxFileSize) {
        return toast.error("File size should be less than 100 MB");
      }
      if (type === "image") {
        if (!file.type.startsWith("image")) {
          return toast.error("Only images are allowed");
        }
      } else if (type === "video") {
        if (!file.type.startsWith("video")) {
          return toast.error("Only videos are allowed");
        }
      }
      setPostFile(file);
      setPostFileType(type);
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit = (values, { setSubmitting, resetForm }) => {
    try {
      const formData = new FormData();

      if (!values.content) {
        return toast.error("Content is required");
      }
      formData.append("content", values.content);

      if (postFile) {
        formData.append("file", postFile);
        formData.append("fileType", postFileType);
      }
      dispatch(createPost(formData))
        .then((data) => {
          toast.success("Successfull");
          if (data.data) {
            return dispatch({ type: CREATE_ITEM, payload: data.data }); // add items in list
          }
        })
        .catch((err) => {
          toast.error(err || "Failed");
          setSubmitting(false);
        });
      setPostFile(null);
      setPostFileType(null);
      return resetForm();
    } catch (error) {
      console.error(error);
    }
  };

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
      <div className="central-meta ">
        <div className="new-postbox">
          {postFileType && (
            <div class="post-meta">
              {postFileType === "image" ? (
                <img
                  src={fileUrl()}
                  alt=""
                  style={{ width: "100%", maxHeight: "400px" }}
                />
              ) : (
                postFileType === "video" && (
                  <iframe
                    title="Post Video"
                    src={fileUrl()}
                    height="400"
                    webkitallowfullscreen
                    mozallowfullscreen
                    allowfullscreen
                  ></iframe>
                )
              )}

              <div class="we-video-info">
                <ul>
                  <li>
                    <span
                      class="dislike"
                      data-toggle="tooltip"
                      title="Remove"
                      onClick={clearFiles}
                    >
                      <ins>Remove</ins>
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          )}
          <figure>
            <ProfilePic profile defaultSize/>
          </figure>
          <div className="newpst-input">
            <Formik
              initialValues={{ content: "" }}
              validate={validator(postSchema)}
              validateOnBlur
              onSubmit={onSubmit}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
              }) => (
                <form
                  onSubmit={handleSubmit}
                  method="post"
                  encType="multipart/form-data"
                >
                  <Field
                    name="content"
                    as="textarea"
                    rows="2"
                    placeholder="write something"
                    className={
                      errors.content && touched.content ? "input-error" : ""
                    }
                  />
                  {errors.content && touched.content && (
                    <div className="error">{errors.content}</div>
                  )}

                  <div className="attachments">
                    <ul>
                      {!postFileType && (
                        <>
                          <li>
                            <i className="fa fa-image"></i>
                            <label className="fileContainer">
                              <input
                                type="file"
                                name="image"
                                onChange={(e) => handlePostFile(e, "image")}
                                accept="image/*"
                              />
                            </label>
                          </li>
                          <li>
                            <i className="fa fa-video-camera"></i>
                            <label className="fileContainer">
                              <input
                                type="file"
                                name="video"
                                onChange={(e) => handlePostFile(e, "video")}
                                accept="video/*"
                              />
                            </label>
                          </li>
                        </>
                      )}
                      <li>
                        <button type="submit" disabled={loading}>
                          Publish
                        </button>
                      </li>
                    </ul>
                  </div>
                </form>
              )}
            </Formik>
          </div>
        </div>
      </div>
      {/* add post new box */}
      <div className="loadMore">
        <InfiniteScrollList
          infiniteRender={infiniteRender}
          limit={10}
          fetchItems={fetchItems}
        />
      </div>
    </div>
  );
}
