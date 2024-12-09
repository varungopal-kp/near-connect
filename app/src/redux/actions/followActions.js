import axios from "../../config/axios";
import {
  FETCH_ITEMS_FAILURE,
  FETCH_ITEMS_REQUEST,
  FETCH_ITEMS_SUCCESS,
  GET_ACCOUNT_DETAILS_FAILURE,
  GET_ACCOUNT_DETAILS_REQUEST,
  GET_ACCOUNT_DETAILS_SUCCESS,
} from "../constants/common";
import {
  CONFIRM_FRIEND_FAILURE,
  CONFIRM_FRIEND_REQUEST,
  CONFIRM_FRIEND_SUCCESS,
  CONFIRM_FOLLOW_REQUEST_FAILURE,
  CONFIRM_FOLLOW_REQUEST_REQUEST,
  CONFIRM_FOLLOW_REQUEST_SUCCESS,
  DELETE_FOLLOW_REQUEST_FAILURE,
  DELETE_FOLLOW_REQUEST_REQUEST,
  DELETE_FOLLOW_REQUEST_SUCCESS,
  REMOVE_FOLLOWER_FAILURE,
  REMOVE_FOLLOWER_REQUEST,
  REMOVE_FOLLOWER_SUCCESS,
  REMOVE_FRIEND_FAILURE,
  REMOVE_FRIEND_REQUEST,
  REMOVE_FRIEND_SUCCESS,
  GET_FOLLOW_COUNT_REQUEST,
  GET_FOLLOW_COUNT_FAILURE,
  GET_FOLLOW_COUNT_SUCCESS,
  GET_FOLLOW_USER_DETAIL_REQUEST,
  GET_FOLLOW_USER_DETAIL_SUCCESS,
  GET_FOLLOW_USER_DETAIL_FAILURE,
} from "../constants/follow";

export const getFollowers = (page, limit) => async (dispatch) => {
  dispatch({ type: FETCH_ITEMS_REQUEST });

  try {
    const response = await axios.get("/follow/followers", {
      params: { page, limit },
    });

    dispatch({ type: FETCH_ITEMS_SUCCESS, payload: { ...response.data.data } });
    return Promise.resolve(response.data);
  } catch (error) {
    const errMessage = error.response?.data?.message || "Something went wrong";
    dispatch({ type: FETCH_ITEMS_FAILURE, payload: error.message });
    return Promise.reject(errMessage);
  }
};

export const getPendingFollowers = (page, limit) => async (dispatch) => {
  dispatch({ type: FETCH_ITEMS_REQUEST });
  try {
    const response = await axios.get("/follow/follow-requests", {
      params: { page, limit },
    });
    dispatch({ type: FETCH_ITEMS_SUCCESS, payload: { ...response.data.data } });
    return Promise.resolve(response.data);
  } catch (error) {
    const errMessage = error.response?.data?.message || "Something went wrong";
    dispatch({ type: FETCH_ITEMS_FAILURE, payload: error.message });
    return Promise.reject(errMessage);
  }
};

export const getFriends = (page, limit) => async (dispatch) => {
  dispatch({ type: FETCH_ITEMS_REQUEST });
  try {
    const response = await axios.get("/follow/friends", {
      params: { page, limit },
    });
    dispatch({ type: FETCH_ITEMS_SUCCESS, payload: { ...response.data.data } });
    return Promise.resolve(response.data);
  } catch (error) {
    console.log(error);
    const errMessage = error.response?.data?.message || "Something went wrong";
    dispatch({ type: FETCH_ITEMS_FAILURE, payload: error.message });
    return Promise.reject(errMessage);
  }
};
export const removeFollower = (id) => async (dispatch) => {
  try {
    dispatch({ type: REMOVE_FOLLOWER_REQUEST });
    const response = await axios.delete(`/follow/remove-follower/${id}`);
    dispatch({ type: REMOVE_FOLLOWER_SUCCESS, payload: response });
    return Promise.resolve(response);
  } catch (error) {
    const errMessage = error.response?.data?.message || "Something went wrong";
    dispatch({ type: REMOVE_FOLLOWER_FAILURE, payload: error.message });
    return Promise.reject(errMessage);
  }
};

export const addFriend = (user) => async (dispatch) => {
  try {
    dispatch({ type: CONFIRM_FRIEND_REQUEST });
    const response = await axios.post(`/follow/confirm-friend/${user}`);
    dispatch({ type: CONFIRM_FRIEND_SUCCESS, payload: response });
    return Promise.resolve(response);
  } catch (error) {
    const errMessage = error.response?.data?.message || "Something went wrong";
    dispatch({ type: CONFIRM_FRIEND_FAILURE, payload: error.message });
    return Promise.reject(errMessage);
  }
};

export const deleteFollowRequest = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_FOLLOW_REQUEST_REQUEST });
    const response = await axios.post(`/follow/delete-request/${id}`);
    dispatch({ type: DELETE_FOLLOW_REQUEST_SUCCESS, payload: response });
    return Promise.resolve(response);
  } catch (error) {
    const errMessage = error.response?.data?.message || "Something went wrong";
    dispatch({ type: DELETE_FOLLOW_REQUEST_FAILURE, payload: error.message });
    return Promise.reject(errMessage);
  }
};
export const confirmFollowRequest = (id) => async (dispatch) => {
  try {
    dispatch({ type: CONFIRM_FOLLOW_REQUEST_REQUEST });
    const response = await axios.post(`/follow/confirm-request/${id}`);
    dispatch({ type: CONFIRM_FOLLOW_REQUEST_SUCCESS, payload: response });
    return Promise.resolve(response);
  } catch (error) {
    const errMessage = error.response?.data?.message || "Something went wrong";
    dispatch({ type: CONFIRM_FOLLOW_REQUEST_FAILURE, payload: error.message });
    return Promise.reject(errMessage);
  }
};
export const removeFriend = (id) => async (dispatch) => {
  try {
    dispatch({ type: REMOVE_FRIEND_REQUEST });
    const response = await axios.delete(`/follow/remove-friend/${id}`);
    dispatch({ type: REMOVE_FRIEND_SUCCESS, payload: response });
    return Promise.resolve(response);
  } catch (error) {
    const errMessage = error.response?.data?.message || "Something went wrong";
    dispatch({ type: REMOVE_FRIEND_FAILURE, payload: error.message });
    return Promise.reject(errMessage);
  }
};
export const getFollowCount = () => async (dispatch) => {
  try {
    dispatch({ type: GET_FOLLOW_COUNT_REQUEST });
    const response = await axios.get(`/follow/counts`);
    dispatch({ type: GET_FOLLOW_COUNT_SUCCESS, payload: response });
    return Promise.resolve(response);
  } catch (error) {
    const errMessage = error.response?.data?.message || "Something went wrong";
    dispatch({ type: GET_FOLLOW_COUNT_FAILURE, payload: error.message });
    return Promise.reject(errMessage);
  }
};
export const getFollowUserDetails = (user) => async (dispatch) => {
  try {
    dispatch({ type: GET_FOLLOW_USER_DETAIL_REQUEST });
    const response = await axios.get(`/follow/${user}`);
    dispatch({ type: GET_FOLLOW_USER_DETAIL_SUCCESS, payload: response });
    return Promise.resolve(response);
  } catch (error) {
    const errMessage = error.response?.data?.message || "Something went wrong";
    dispatch({ type: GET_FOLLOW_USER_DETAIL_FAILURE, payload: error.message });
    return Promise.reject(errMessage);
  }
};
