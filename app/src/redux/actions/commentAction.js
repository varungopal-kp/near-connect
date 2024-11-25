import axios from "../../config/axios";
import {
  CREATE_COMMENT_REQUEST,
  CREATE_COMMENT_SUCCESS,
  CREATE_COMMENT_FAILURE,
  GET_COMMENTS_REQUEST,
  GET_COMMENTS_SUCCESS,
  GET_COMMENTS_FAILURE,
  GET_REPLIES_FAILURE,
  GET_REPLIES_REQUEST,
  GET_REPLIES_SUCCESS,
  CREATE_REPLY_REQUEST,
  CREATE_REPLY_SUCCESS,
  CREATE_REPLY_FAILURE,
  DELETE_COMMENT_REQUEST,
  DELETE_COMMENT_SUCCESS,
  DELETE_COMMENT_FAILURE,
  DELETE_REPLY_REQUEST,
  DELETE_REPLY_SUCCESS,
} from "../constants/comment";

export const getComments = (postId, page, limit) => async (dispatch) => {
  dispatch({ type: GET_COMMENTS_REQUEST });
  try {
    const response = await axios.get(`/comments/${postId}`, {
      params: { page, limit },
    });
    dispatch({
      type: GET_COMMENTS_SUCCESS,
      payload: response.data,
    });
    return Promise.resolve(response.data);
  } catch (error) {
    const errMessage = error.response?.data?.message || "Something went wrong";
    dispatch({
      type: GET_COMMENTS_FAILURE,
      payload: errMessage,
    });
    return Promise.reject(errMessage);
  }
};

export const getReplies = (cmtId, page, limit) => async (dispatch) => {
  dispatch({ type: GET_REPLIES_REQUEST });
  try {
    const response = await axios.get(`/comments/replies/${cmtId}`, {
      params: { page, limit },
    });
    dispatch({
      type: GET_REPLIES_SUCCESS,
      payload: response.data,
    });
    return Promise.resolve(response.data);
  } catch (error) {
    const errMessage = error.response?.data?.message || "Something went wrong";
    dispatch({
      type: GET_REPLIES_FAILURE,
      payload: errMessage,
    });
    return Promise.reject(errMessage);
  }
};

export const createComment = (data) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_COMMENT_REQUEST });
    const response = await axios.post("/comments", data);
    dispatch({
      type: CREATE_COMMENT_SUCCESS,
      payload: response.data,
    });
    return Promise.resolve(response.data);
  } catch (error) {
    const errMessage = error.response?.data?.message || "Something went wrong";
    dispatch({
      type: CREATE_COMMENT_FAILURE,
      payload: errMessage,
    });
    return Promise.reject(errMessage);
  }
};

export const createReply = (data) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_REPLY_REQUEST });
    const response = await axios.post("/comments/reply", data);
    dispatch({
      type: CREATE_REPLY_SUCCESS,
      payload: response.data,
    });
    return Promise.resolve(response.data);
  } catch (error) {
    const errMessage = error.response?.data?.message || "Something went wrong";
    dispatch({
      type: CREATE_REPLY_FAILURE,
      payload: errMessage,
    });
    return Promise.reject(errMessage);
  }
};

export const deleteComment = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_COMMENT_REQUEST });
    const response = await axios.delete(`/comments/${id}`);
    dispatch({
      type: DELETE_COMMENT_SUCCESS,
      payload: response.data,
    });
    return Promise.resolve(response.data);
  } catch (error) {
    const errMessage = error.response?.data?.message || "Something went wrong";
    dispatch({
      type: DELETE_COMMENT_FAILURE,
      payload: errMessage,
    });
    return Promise.reject(errMessage);
  }
};

export const deleteReply = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_REPLY_REQUEST });
    const response = await axios.delete(`/comments/reply/${id}`);
    dispatch({
      type: DELETE_REPLY_SUCCESS,
      payload: response.data,
    });
    return Promise.resolve(response.data);
  } catch (error) {
    const errMessage = error.response?.data?.message || "Something went wrong";
    dispatch({
      type: DELETE_COMMENT_FAILURE,
      payload: errMessage,
    });
    return Promise.reject(errMessage);
  }
};
