import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import {
  deleteVideo,
  getVideos,
  uploadVideo,
} from "../../redux/actions/postActions";
import { toast } from "react-toastify";
import swal from "sweetalert";
import { Modal } from "react-responsive-modal";

export default function Index(props) {
  const dispatch = useDispatch();

  const initialFetchRef = useRef(false); // For strict mode

  const fileInputRef = React.useRef(null);

  const [videos, setVideos] = React.useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);

  const _limit = 2;

  useEffect(() => {
    if (!initialFetchRef.current) {
      getVideoList(page, _limit);
      initialFetchRef.current = true;
    }
  }, []);

  const getVideoList = (page, limit = _limit, list = false) => {
    dispatch(getVideos(page, limit, props.accountId)).then((res) => {
      if (res.data) {
        setVideos((prev) => {
          let oldList = prev;
          if (list) {
            oldList = list;
          }
          return [...oldList, ...res.data.list];
        });
        if (res.data.hasMore) {
          setHasMore(true);
        } else {
          setHasMore(false);
        }
      }
    });
  };

  const handleAddVideo = (e) => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    try {
      const files = event.target.files;

      if (files.length === 0) {
        return "";
      }
      if (files[0].size > 100 * 1024 * 1024) {
        return toast.error("File size should be less than 100 MB");
      }
      if (!files[0].type.startsWith("video")) {
        return toast.error("Only videos are allowed");
      }

      const formData = new FormData();
      formData.append("video", files[0]);

      return dispatch(uploadVideo(formData))
        .catch((err) => {
          return toast.error(err || "Something went wrong");
        })
        .then((res) => {
          if (res.data) {
            const oldList = videos;
            if (hasMore) {
              oldList.pop();
            }
            setVideos([res.data, ...oldList]);
            return toast.success("Successfull");
          }
        });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteVideo = (id) => {
    try {
      swal({
        title: "Are you sure?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          dispatch(deleteVideo(id))
            .then((res) => {
              if (res.data) {
                const newList = videos.filter((photo) => photo._id !== id);
                setVideos(newList);
                const newPhoto = videos.length;
                getVideoList(newPhoto, 1, newList);
              }
            })
            .catch((err) => {
              toast.error(err || "Something went wrong");
            });
        }
      });
    } catch (error) {
      console.error(error);
    }
  };
  console.log(videos, "videos");
  return (
    <div class="col-lg-6">
      <div class="central-meta">
        <p class="widget-title">
          {props.layout !== 4 && (
            <>
              {" "}
              <input
                type="file"
                accept="video/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <button
                className="btn btn-primary"
                style={{ float: "right" }}
                onClick={handleAddVideo}
              >
                Add Video
              </button>
            </>
          )}
        </p>
        <ul class="photos">
          {videos?.map((video) => (
            <li>
              {props.layout !== 4 && (
                <i
                  class="fa fa-close"
                  onClick={() => handleDeleteVideo(video._id)}
                ></i>
              )}

              <iframe
                width="100%"
                height="480px"
                src={`${process.env.REACT_APP_BASE_URL}/${video.path}`}
                frameBorder="0"
                allowFullScreen
                title="ex"
              />
            </li>
          ))}
        </ul>
        {hasMore && (
          <div class="lodmore">
            <button
              class="btn-view btn-load-more"
              onClick={() => {
                getVideoList(page + 1);
                setPage(page + 1);
              }}
            ></button>
          </div>
        )}
        {videos?.length === 0 && (
          <p style={{ textAlign: "center" }}>No Videos</p>
        )}
      </div>
    </div>
  );
}
