import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import {
  deletePhoto,
  getPhotos,
  uploadPhoto,
} from "../../redux/actions/postActions";
import { toast } from "react-toastify";
import swal from "sweetalert";

export default function Index(props) {
  const dispatch = useDispatch();

  const initialFetchRef = useRef(false); // For strict mode

  const fileInputRef = React.useRef(null);

  const [photos, setPhotos] = React.useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);

  const _limit = 2;

  useEffect(() => {
    if (!initialFetchRef.current) {
      getPhotoList(page, _limit);
      initialFetchRef.current = true;
    }
  }, []);

  const getPhotoList = (page, limit = _limit, list = false) => {
    dispatch(getPhotos(page, limit, props.accountId)).then((res) => {
      if (res.data) {
        setPhotos((prev) => {
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

  const handleAddPhotos = (e) => {
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
      if (files[0].size > 5 * 1024 * 1024) {
        return toast.error("File size should be less than 5 MB");
      }
      if (!files[0].type.startsWith("image")) {
        return toast.error("Only images are allowed");
      }

      const formData = new FormData();
      formData.append("photo", files[0]);

      return dispatch(uploadPhoto(formData))
        .catch((err) => {
          return toast.error(err || "Something went wrong");
        })
        .then((res) => {
          if (res.data) {
            const oldList = photos;
            if (hasMore) {
              oldList.pop();
            }
            setPhotos([res.data, ...oldList]);
            return toast.success("Successfull");
          }
        });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeletePhoto = (id) => {
    try {
      swal({
        title: "Are you sure?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          dispatch(deletePhoto(id))
            .then((res) => {
              if (res.data) {
                const newList = photos.filter((photo) => photo._id !== id);
                setPhotos(newList);
                const newPhoto = photos.length;
                getPhotoList(newPhoto, 1, newList);
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
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <button
                className="btn btn-primary"
                style={{ float: "right" }}
                onClick={handleAddPhotos}
              >
                Add Photos
              </button>
            </>
          )}
        </p>
        <ul class="photos">
          {photos?.map((photo) => (
            <li>
              {props.layout !== 4 && (
                <i
                  class="fa fa-close"
                  onClick={() => handleDeletePhoto(photo._id)}
                ></i>
              )}
              <a
                class="strip"
                href={`${process.env.REACT_APP_BASE_URL}/${photo.path}`}
                title=""
                data-strip-group="mygroup"
                data-strip-group-options="loop: false"
              >
                <img
                  src={`${process.env.REACT_APP_BASE_URL}/${photo.path}`}
                  alt=""
                />
              </a>
            </li>
          ))}
        </ul>
        {hasMore && (
          <div class="lodmore">
            <button
              class="btn-view btn-load-more"
              onClick={() => {
                getPhotoList(page + 1);
                setPage(page + 1);
              }}
            ></button>
          </div>
        )}
        {photos?.length === 0 && (
          <p style={{ textAlign: "center" }}>No Photos</p>
        )}
      </div>
    </div>
  );
}
