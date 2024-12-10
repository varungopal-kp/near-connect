import axios from "../../config/axios";
import {
  FETCH_ITEMS_FAILURE,
  FETCH_ITEMS_REQUEST,
  FETCH_ITEMS_SUCCESS,
} from "../constants/common";
import {
  CREATE_POSTS_FAILURE,
  CREATE_POSTS_REQUEST,
  CREATE_POSTS_SUCCESS,
  DELETE_PHOTO_FAILURE,
  DELETE_PHOTO_REQUEST,
  DELETE_PHOTO_SUCCESS,
  DELETE_POST_FAILURE,
  DELETE_POST_REQUEST,
  DELETE_POST_SUCCESS,
  DELETE_VIDEO_FAILURE,
  DELETE_VIDEO_REQUEST,
  DELETE_VIDEO_SUCCESS,
  GET_PHOTOS_FAILURE,
  GET_PHOTOS_REQUEST,
  GET_PHOTOS_SUCCESS,
  GET_POSTS_FAILURE,
  GET_POSTS_REQUEST,
  GET_POSTS_SUCCESS,
  GET_VIDEOS_FAILURE,
  GET_VIDEOS_REQUEST,
  GET_VIDEOS_SUCCESS,
  UPDATE_POST_LIKE_FAILURE,
  UPDATE_POST_LIKE_REQUEST,
  UPDATE_POST_LIKE_SUCCESS,
  UPLOAD_PHOTO_FAILURE,
  UPLOAD_PHOTO_REQUEST,
  UPLOAD_PHOTO_SUCCESS,
  UPLOAD_VIDEO_FAILURE,
  UPLOAD_VIDEO_REQUEST,
  UPLOAD_VIDEO_SUCCESS,
} from "../constants/posts";

export const fetchItems =
  ({ page, limit, user = "" }) =>
  async (dispatch) => {
    dispatch({ type: FETCH_ITEMS_REQUEST });

    try {
      const response = await axios.get("/posts/list", {
        params: { page, limit, user },
      });

      if (response.data.data?.list) {
        response.data.data.list.forEach((item) => {
          item.showComments = false;
          item.isLiked = item.postinteractions[0]?.like || false;
          item.isDisliked = item.postinteractions[0]?.dislike || false;
        });
      }

      dispatch({
        type: FETCH_ITEMS_SUCCESS,
        payload: { ...response.data.data },
      });
      return Promise.resolve(response.data);
    } catch (error) {
      const errMessage =
        error.response?.data?.message || "Something went wrong";
      dispatch({
        type: FETCH_ITEMS_FAILURE,
        error: error.message,
      });
      return Promise.reject(errMessage);
    }
  };

export const getPosts = () => async (dispatch) => {
  try {
    dispatch({ type: GET_POSTS_REQUEST });

    // You would typically make an API call here
    const response = await axios.get("/posts");

    // On success, dispatch GET_POSTS_SUCCESS with the posts data
    dispatch({
      type: GET_POSTS_SUCCESS,
      payload: response.data,
    });
    return Promise.resolve(response.data);
  } catch (error) {
    const errMessage = error.response?.data?.message || "Something went wrong";
    dispatch({
      type: GET_POSTS_FAILURE,
      payload: errMessage,
    });
    return Promise.reject(errMessage);
  }
};

export const createPost = (data) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_POSTS_REQUEST });

    // You would typically make an API call here
    const response = await axios.post("/posts", data);

    // On success, dispatch CREATE_POSTS_SUCCESS with the posts data
    dispatch({
      type: CREATE_POSTS_SUCCESS,
      payload: response.data,
    });
    return Promise.resolve(response.data);
  } catch (error) {
    const errMessage = error.response?.data?.message || "Something went wrong";
    dispatch({
      type: CREATE_POSTS_FAILURE,
      payload: errMessage,
    });
    return Promise.reject(errMessage);
  }
};
export const updatePostLike = (data) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_POST_LIKE_REQUEST });

    const response = await axios.post("/posts/like", data);

    dispatch({
      type: UPDATE_POST_LIKE_SUCCESS,
      payload: response.data,
    });
    return Promise.resolve(response.data);
  } catch (error) {
    const errMessage = error.response?.data?.message || "Something went wrong";
    dispatch({
      type: UPDATE_POST_LIKE_FAILURE,
      payload: errMessage,
    });
    return Promise.reject(errMessage);
  }
};

export const deletePost = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_POST_REQUEST });

    const response = await axios.delete(`/posts/${id}`);
    dispatch({
      type: DELETE_POST_SUCCESS,
      payload: response.data,
    });
    return Promise.resolve(response.data);
  } catch (error) {
    const errMessage = error.response?.data?.message || "Something went wrong";
    dispatch({
      type: DELETE_POST_FAILURE,
      payload: errMessage,
    });
    return Promise.reject(errMessage);
  }
};
export const getPhotos =
  (page, limit, user = "") =>
  async (dispatch) => {
    try {
      dispatch({ type: GET_PHOTOS_REQUEST });

      const response = await axios.get("/posts/photos", {
        params: { page, limit, user },
      });

      dispatch({
        type: GET_PHOTOS_SUCCESS,
        payload: response.data,
      });
      return Promise.resolve(response.data);
    } catch (error) {
      const errMessage =
        error.response?.data?.message || "Something went wrong";
      dispatch({
        type: GET_PHOTOS_FAILURE,
        payload: errMessage,
      });
      return Promise.reject(errMessage);
    }
  };
export const getVideos =
  (page, limit, user = "") =>
  async (dispatch) => {
    try {
      dispatch({ type: GET_VIDEOS_REQUEST });

      const response = await axios.get("/posts/videos", {
        params: { page, limit, user },
      });

      dispatch({
        type: GET_VIDEOS_SUCCESS,
        payload: response.data,
      });
      return Promise.resolve(response.data);
    } catch (error) {
      const errMessage =
        error.response?.data?.message || "Something went wrong";
      dispatch({
        type: GET_VIDEOS_FAILURE,
        payload: errMessage,
      });
      return Promise.reject(errMessage);
    }
  };

export const uploadPhoto = (formData) => async (dispatch) => {
  try {
    dispatch({ type: UPLOAD_PHOTO_REQUEST });

    const response = await axios.post("/posts/photos", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    dispatch({
      type: UPLOAD_PHOTO_SUCCESS,
      payload: response.data,
    });
    return Promise.resolve(response.data);
  } catch (error) {
    const errMessage = error.response?.data?.message || "Something went wrong";
    dispatch({
      type: UPLOAD_PHOTO_FAILURE,
      payload: errMessage,
    });
    return Promise.reject(errMessage);
  }
};

export const uploadVideo = (formData) => async (dispatch) => {
  try {
    dispatch({ type: UPLOAD_VIDEO_REQUEST });

    const response = await axios.post("/posts/videos", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    dispatch({
      type: UPLOAD_VIDEO_SUCCESS,
      payload: response.data,
    });
    return Promise.resolve(response.data);
  } catch (error) {
    const errMessage = error.response?.data?.message || "Something went wrong";
    dispatch({
      type: UPLOAD_VIDEO_FAILURE,
      payload: errMessage,
    });
    return Promise.reject(errMessage);
  }
};

export const deletePhoto = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_PHOTO_REQUEST });

    const response = await axios.delete(`/posts/photos/${id}`);
    dispatch({
      type: DELETE_PHOTO_SUCCESS,
      payload: response.data,
    });
    return Promise.resolve(response.data);
  } catch (error) {
    const errMessage = error.response?.data?.message || "Something went wrong";
    dispatch({
      type: DELETE_PHOTO_FAILURE,
      payload: errMessage,
    });
    return Promise.reject(errMessage);
  }
};
export const deleteVideo = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_VIDEO_REQUEST });

    const response = await axios.delete(`/posts/videos/${id}`);
    dispatch({
      type: DELETE_VIDEO_SUCCESS,
      payload: response.data,
    });
    return Promise.resolve(response.data);
  } catch (error) {
    const errMessage = error.response?.data?.message || "Something went wrong";
    dispatch({
      type: DELETE_VIDEO_FAILURE,
      payload: errMessage,
    });
    return Promise.reject(errMessage);
  }
};
