import axios from "../../config/axios";
import {
  FETCH_ITEMS_FAILURE,
  FETCH_ITEMS_REQUEST,
  FETCH_ITEMS_SUCCESS,
} from "../constants/common";
import {
  ADD_FRIEND_FAILURE,
  ADD_FRIEND_REQUEST,
  ADD_FRIEND_SUCCESS,
  REMOVE_FOLLOWER_FAILURE,
  REMOVE_FOLLOWER_REQUEST,
  REMOVE_FOLLOWER_SUCCESS,
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

export const getFriend = (page, limit) => async (dispatch) => {
  dispatch({ type: FETCH_ITEMS_REQUEST });
  try {
    const response = await axios.get("/follow/friends", {
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
    dispatch({ type: ADD_FRIEND_REQUEST });
    const response = await axios.post(`/follow/add-friend/${user}`);
    dispatch({ type: ADD_FRIEND_SUCCESS, payload: response });
    return Promise.resolve(response);
  } catch (error) {
    const errMessage = error.response?.data?.message || "Something went wrong";
    dispatch({ type: ADD_FRIEND_FAILURE, payload: error.message });
    return Promise.reject(errMessage);
  }
};
