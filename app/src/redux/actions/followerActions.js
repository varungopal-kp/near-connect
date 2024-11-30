import axios from "../../config/axios";
import {
  FETCH_ITEMS_FAILURE,
  FETCH_ITEMS_REQUEST,
  FETCH_ITEMS_SUCCESS,
} from "../constants/common";

export const getFollowers = () => async (dispatch) => {
  dispatch({ type: FETCH_ITEMS_REQUEST });
  try {
    const response = await axios.get("/followers/followers");
    
    dispatch({ type: FETCH_ITEMS_SUCCESS, payload: { ...response.data.data } });
  } catch (error) {
    dispatch({ type: FETCH_ITEMS_FAILURE, payload: error.message });
  }
};

export const getFollowersPending = () => async (dispatch) => {
  dispatch({ type: FETCH_ITEMS_REQUEST });
  try {
    const response = await axios.get("/followers/follower-requests");
    dispatch({ type: FETCH_ITEMS_SUCCESS, payload: { ...response.data.data } });
  } catch (error) {
    dispatch({ type: FETCH_ITEMS_FAILURE, payload: error.message });
  }
};

export const getFriend = () => async (dispatch) => {
  dispatch({ type: FETCH_ITEMS_REQUEST });
  try {
    const response = await axios.get("/followers/friends");
    dispatch({ type: FETCH_ITEMS_SUCCESS, payload: { ...response.data.data } });
  } catch (error) {
    dispatch({ type: FETCH_ITEMS_FAILURE, payload: error.message });
  }
};
