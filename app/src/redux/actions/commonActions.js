import axios from "../../config/axios";
import {
  FETCH_ITEMS_REQUEST,
  FETCH_ITEMS_SUCCESS,
  FETCH_ITEMS_FAILURE,
  GET_PROFILE_REQUEST,
  GET_PROFILE_SUCCESS,
  GET_PROFILE_FAILURE,
} from "../constants/common";

export const fetchItems = (page, limit) => async (dispatch) => {
  dispatch({ type: FETCH_ITEMS_REQUEST });

  try {
    const response = await axios.get("/posts/list", {
      params: { page, limit },
    });
    let data = [];
    if (response.data.data?.list) {
      data = [...response.data.data.list];
      data.map((item) => {
        item.showComments = false;
        item.isLiked = item.postinteractions[0]?.like || false;
        item.isDisliked =   item.postinteractions[0]?.dislike || false;
      });
    }

    dispatch({
      type: FETCH_ITEMS_SUCCESS,
      payload: { ...response.data.data },
    });
    return Promise.resolve(response.data);
  } catch (error) {
    const errMessage = error.response?.data?.message || "Something went wrong";
    dispatch({
      type: FETCH_ITEMS_FAILURE,
      error: error.message,
    });
    return Promise.reject(errMessage);
  }
};

export const getProfile = () => async (dispatch) => {
  try {
    dispatch({ type: GET_PROFILE_REQUEST });
    const response = await axios.get("/users/profile");
    dispatch({
      type: GET_PROFILE_SUCCESS,
      payload: response.data,
    });
    return Promise.resolve(response.data);
  } catch (error) {
    const errMessage = error.response?.data?.message || "Something went wrong";
    dispatch({
      type: GET_PROFILE_FAILURE,
      error: error.message,
    });
    return Promise.reject(errMessage);
  }
};
