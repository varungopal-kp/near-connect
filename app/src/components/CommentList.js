import React, { useEffect, useState } from "react";
import ReplyList from "./ReplyList";
import { useDispatch, useSelector } from "react-redux";
import {
  createComment,
  getComments,
  createReply,
  deleteComment,
} from "../redux/actions/commentAction";
import { Field, Formik } from "formik";
import { commentSchema, replySchema } from "../validations/commentSchema";
import { validator } from "../helpers/validator";
import { toast } from "react-toastify";
import swal from "sweetalert";
import { UPDATE_ITEMS } from "../redux/constants/common";
import moment from "moment";
import DotsMenu from "./DotMenu";
import ProfilePic from "./ProfilePic";

export default function Comments(props) {
  const dispatch = useDispatch();
  const [moreComment, setMoreComment] = useState(false);
  const [comments, setComment] = useState([]);
  const [newReply, setNewReply] = useState(null);
  const { list } = useSelector((state) => state.common);

  const [page, setPage] = useState(1);
  const limit = 5;

  useEffect(() => {
    if (props.postId && page) {
      handleGetComments(page, limit, comments);
    }
  }, [props.postId, page]);

  const handleGetComments = (_page, _limit, _comments) => {
    dispatch(getComments(props.postId, _page, _limit)).then((res) => {
      if (res.data.comments) {
        setComment([..._comments, ...res.data.comments]);
      }
      if (res.data.hasMore) {
        setMoreComment(true);
      } else {
        setMoreComment(false);
      }
    });
  };

  const onCommentSubmit = (values, { setSubmitting, resetForm }) => {
    try {
      const formData = { ...values, post: props.postId };

      dispatch(createComment(formData))
        .then((data) => {
          if (data.data) {
            const newComments = comments;
            if (newComments.length > 0) {
              if (moreComment) {
                newComments.pop();
              }
            }
            const newData = { ...data.data, canModify: true };
            setComment([newData, ...newComments]);
            updateCommentCount(1);
          }
          toast.success("Successfull");
        })
        .catch((err) => {
          toast.error(err || "Failed");
          setSubmitting(false);
        });
      return resetForm();
    } catch (error) {
      console.error(error);
    }
  };

  const onReplySubmit = (values, { setSubmitting, resetForm }) => {
    try {
      const formData = { ...values };

      dispatch(createReply(formData))
        .then((data) => {
          if (data.data) {
            const newReply = { ...data.data, canModify: true };
            setNewReply(newReply);

            // Find the index of the comment that contains the new reply
            const commentIndex = comments.findIndex(
              (comment) => comment._id === data.data.comment
            );
            if (commentIndex !== -1) {
              let replies = comments[commentIndex].replies || [];

              if (replies?.length === 0) {
                replies = [newReply];
                // Update the comments state with the modified comment
                const newComment = {
                  ...comments[commentIndex],
                  replies: replies,
                };

                // Clone the comment and add the new reply to the replies array
                const newComments = [...comments];
                newComments[commentIndex] = newComment;

                setComment(newComments);
              }
            }

            toast.success("Successful");
          }
        })
        .catch((err) => {
          toast.error(err || "Failed");
          setSubmitting(false);
        });

      return resetForm();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCommentDelete = (id) => {
    dispatch(deleteComment(id))
      .then((res) => {
        if (res.data) {
          const newComments = comments.filter((item) => item._id !== id);
          setComment(newComments);
          updateCommentCount(-1);

          if (moreComment) {
            const page = comments.length;
            handleGetComments(page, 1, newComments);
          }
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Something went wrong");
      });
  };

  const updateCommentCount = (value) => {
    const newList = [...list];
    const updateItem = newList.find((item) => item._id === props.postId);
    updateItem.comments = updateItem.comments + value;
    dispatch({ type: UPDATE_ITEMS, payload: updateItem });
  };

  return (
    <div class="coment-area">
      <ul class="we-comet">
        <li class="post-comment">
          <div class="comet-avatar">
            <ProfilePic profile style={{ width: "40px" , height: "40px"}}/>
          </div>
          <div class="post-comt-box">
            <Formik
              initialValues={{ comment: "" }}
              validate={validator(commentSchema)}
              validateOnBlur
              onSubmit={onCommentSubmit}
            >
              {({
                errors,
                touched,

                handleSubmit,
              }) => (
                <form onSubmit={handleSubmit} method="post">
                  <Field
                    name="comment"
                    type="text"
                    placeholder="write your comment"
                    className={
                      errors.comment && touched.comment ? "input-error" : ""
                    }
                  />
                  {errors.comment && touched.comment && (
                    <div className="error">{errors.comment}</div>
                  )}

                  <button type="submit"></button>
                </form>
              )}
            </Formik>
          </div>
        </li>
        {comments.map((item, index) => {
          return (
            <>
              <li key={index}>
                <div class="comet-avatar">
                  <ProfilePic url={item.user?.pic} style={{ width: "40px" , height: "40px"}}/>
                </div>
                <div class="we-comment">
                  <div class="coment-head">
                    <h5>
                      <a href="time-line.html" title="">
                        {item.user?.name}
                      </a>
                    </h5>
                    <span>{moment(item?.createdAt).fromNow() || ""}</span>
                    {item.canModify && (
                      <DotsMenu
                        action={{
                          delete: () => {
                            swal({
                              title: "Are you sure?",
                              icon: "warning",
                              buttons: true,
                              dangerMode: true,
                            }).then((willDelete) => {
                              if (willDelete) {
                                handleCommentDelete(item._id);
                              }
                            });
                          },
                        }}
                      />
                    )}
                  </div>
                  <p>{item.comment}</p>
                </div>
                <ul>
                  <li class="post-comment">
                    <div class="comet-avatar">
                      <ProfilePic profile style={{ width: "40px" , height: "40px"}}/>
                    </div>
                    <div class="post-comt-box">
                      <Formik
                        initialValues={{ reply: "", comment: item._id }}
                        validate={validator(replySchema)}
                        validateOnBlur
                        onSubmit={onReplySubmit}
                      >
                        {({ errors, touched, handleSubmit }) => (
                          <form onSubmit={handleSubmit} method="post">
                            <Field
                              name="reply"
                              type="text"
                              placeholder="reply"
                              className={
                                errors.reply && touched.reply
                                  ? "input-error"
                                  : ""
                              }
                            />

                            {errors.reply && touched.reply && (
                              <div className="error">{errors.reply}</div>
                            )}

                            <button type="submit"></button>
                          </form>
                        )}
                      </Formik>
                    </div>
                  </li>
                  {item.replies?.length > 0 && (
                    <ReplyList
                      cmtId={item._id}
                      newReply={newReply}
                      setNewReply={setNewReply}
                    />
                  )}
                </ul>
              </li>
            </>
          );
        })}
        {moreComment && (
          <li
            style={{ background: "gainsboro" }}
            onClick={(e) => {
              e.preventDefault();
              setPage(page + 1);
            }}
          >
            <a href="" title="" class="showmore underline">
              more comments
            </a>
          </li>
        )}
      </ul>
    </div>
  );
}
