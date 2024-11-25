import axios from "../../config/axios";
import {
  CREATE_POSTS_FAILURE,
  CREATE_POSTS_REQUEST,
  CREATE_POSTS_SUCCESS,
  DELETE_POST_FAILURE,
  DELETE_POST_REQUEST,
  DELETE_POST_SUCCESS,
  GET_POSTS_FAILURE,
  GET_POSTS_REQUEST,
  GET_POSTS_SUCCESS,
  UPDATE_POST_LIKE_FAILURE,
  UPDATE_POST_LIKE_REQUEST,
  UPDATE_POST_LIKE_SUCCESS,
} from "../constants/posts";

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
