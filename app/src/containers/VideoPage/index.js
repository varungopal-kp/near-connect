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

  const [open, setOpen] = useState(false);

  const manageModal = (value) => setOpen(value);

  const [videoUrl, setVideoUrl] = useState("");

  useEffect(() => {
    if (!initialFetchRef.current) {
      getVideoList(page, _limit);
      initialFetchRef.current = true;
    }
    return () => {
      setVideoUrl("");
    };
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
                <div>
                  <i
                    class="fa fa-close"
                    onClick={() => handleDeleteVideo(video._id)}
                  ></i>
                </div>
              )}
              <div
                title=""
                data-strip-group="mygroup"
                className="strip pointer"
                onClick={() => {
                  setVideoUrl(video.path);
                  manageModal(true);
                }}
              >
                <img
                  src={`${process.env.REACT_APP_BASE_URL}/${video.thumbnail}`}
                  alt=""
                />
                <i>
                  <svg
                    version="1.1"
                    class="play"
                    x="0px"
                    y="0px"
                    height="40px"
                    width="40px"
                    viewBox="0 0 100 100"
                    enable-background="new 0 0 100 100"
                  >
                    <path
                      class="stroke-solid"
                      fill="none"
                      stroke=""
                      d="M49.9,2.5C23.6,2.8,2.1,24.4,2.5,50.4C2.9,76.5,24.7,98,50.3,97.5c26.4-0.6,47.4-21.8,47.2-47.7
													C97.3,23.7,75.7,2.3,49.9,2.5"
                    />
                    <path
                      class="icon"
                      fill=""
                      d="M38,69c-1,0.5-1.8,0-1.8-1.1V32.1c0-1.1,0.8-1.6,1.8-1.1l34,18c1,0.5,1,1.4,0,1.9L38,69z"
                    />
                  </svg>
                </i>
              </div>
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
        <Modal
          open={open}
          onClose={() => manageModal(false)}
          center
          classNames={{
            overlay: "customOverlay",
            modal: "customModal",
          }}
        >
          <h4>Video</h4>
          {videoUrl && (
            <video
              width="100%"
              height="400"
              controls
              style={{ marginTop: "10px" }}
            >
              <source
                src={`${process.env.REACT_APP_BASE_URL}/${videoUrl}`}
                type="video/mp4"
              />
            </video>
          )}
        </Modal>
        {videos?.length === 0 && (
          <p style={{ textAlign: "center" }}>No Videos</p>
        )}
      </div>
    </div>
  );
}
