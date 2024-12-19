import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { deleteReply, getReplies } from "../redux/actions/commentAction";
import { toast } from "react-toastify";
import swal from "sweetalert";
import moment from "moment";
import DotsMenu from "./DotMenu";
import ProfilePic from "./ProfilePic";

export default function Reply(props) {
  const dispatch = useDispatch();
  const [replies, setReply] = useState([]);
  const [page, setPage] = useState(1);
  const [moreReply, setMoreReply] = useState(false);

  const limit = 3;

  useEffect(() => {
    if (props.newReply) {
      const newReplies = replies;

      if (newReplies.length > 0) {
        if (moreReply) {
          newReplies.pop();
        }
      }

      setReply([props.newReply, ...newReplies]);
      props.setNewReply(null);
    }
  }, [props.newReply]);

  useEffect(() => {
    if (props.cmtId && page) {
      handleGetReplies(page, limit, replies);
    }
  }, [props.cmtId, page]);

  const handleGetReplies = (_page, _limit, _replies) => {
    dispatch(getReplies(props.cmtId, _page, _limit)).then((res) => {
      if (res.data.replies) {
        setReply([..._replies, ...res.data.replies]);
      }
      if (res.data.hasMore) {
        setMoreReply(true);
      } else {
        setMoreReply(false);
      }
    });
  };

  const handleReplyDelete = (id) => {
    dispatch(deleteReply(id))
      .then((res) => {
        if (res.data) {
          const newReplies = replies.filter((item) => item._id !== id);
          setReply(newReplies);

          if (moreReply) {
            const page = replies.length;
            handleGetReplies(page, 1, newReplies);
          }
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Something went wrong");
      });
  };

  return (
    <>
      {replies.map((item, index) => {
        return (
          <li>
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
                        }).then((confirm) => {
                          if (confirm) {
                            handleReplyDelete(item._id);
                          }
                        });
                      },
                    }}
                  />
                )}
              </div>
              <p>{item.reply}</p>
            </div>
          </li>
        );
      })}
      {moreReply && (
        <li
          onClick={(e) => {
            e.preventDefault();
            setPage(page + 1);
          }}
        >
          <a href="" title="" class="showmore underline">
            more replies
          </a>
        </li>
      )}
    </>
  );
}
