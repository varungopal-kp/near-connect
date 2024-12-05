import axios from "../../config/axios";
import {
  GET_PROFILE_REQUEST,
  GET_PROFILE_SUCCESS,
  GET_PROFILE_FAILURE,
  GET_DASHBOARD_COUNT_SUCCESS,
  GET_DASHBOARD_COUNT_FAILURE,
  GET_DASHBOARD_COUNT_REQUEST,
  GET_USER_NOTIFICATIONS_FAILURE,
  GET_USER_NOTIFICATIONS_REQUEST,
  GET_USER_NOTIFICATIONS_SUCCESS,
  UPDATE_NOTIFICATION_SEEN_REQUEST,
  UPDATE_NOTIFICATION_SEEN_SUCCESS,
  UPDATE_NOTIFICATION_SEEN_FAILURE,
  DELETE_NOTIFICATION_FAILURE,
  DELETE_NOTIFICATION_SUCCESS,
  DELETE_NOTIFICATION_REQUEST,
} from "../constants/common";

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

export const getDashboardCount = () => async (dispatch) => {
  try {
    dispatch({ type: GET_DASHBOARD_COUNT_REQUEST });
    const response = await axios.get("/dashboard/counts");

    dispatch({
      type: GET_DASHBOARD_COUNT_SUCCESS,
      payload: response.data?.data,
    });
    return Promise.resolve(response.data);
  } catch (error) {
    const errMessage = error.response?.data?.message || "Something went wrong";
    dispatch({
      type: GET_DASHBOARD_COUNT_FAILURE,
      error: error.message,
    });
    return Promise.reject(errMessage);
  }
};
export const getUserNotification = () => async (dispatch) => {
  try {
    dispatch({ type: GET_USER_NOTIFICATIONS_REQUEST });
    const response = await axios.get("/notifications");
    dispatch({
      type: GET_USER_NOTIFICATIONS_SUCCESS,
      payload: response.data,
    });
    return Promise.resolve(response.data);
  } catch (error) {
    const errMessage = error.response?.data?.message || "Something went wrong";
    dispatch({
      type: GET_USER_NOTIFICATIONS_FAILURE,
      error: error.message,
    });
    return Promise.reject(errMessage);
  }
};

export const updateNotificationSeen = () => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_NOTIFICATION_SEEN_REQUEST });
    const response = await axios.put(`/notifications`);
    dispatch({
      type: UPDATE_NOTIFICATION_SEEN_SUCCESS,
      payload: response.data,
    });
    return Promise.resolve(response.data);
  } catch (error) {
    const errMessage = error.response?.data?.message || "Something went wrong";
    dispatch({
      type: UPDATE_NOTIFICATION_SEEN_FAILURE,
      error: error.message,
    });
    return Promise.reject(errMessage);
  }
};
export const deleteNotification = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_NOTIFICATION_REQUEST });
    const response = await axios.delete(`/notifications/${id}`);
    dispatch({
      type: DELETE_NOTIFICATION_SUCCESS,
      payload: response.data,
    });
    return Promise.resolve(response.data);
  } catch (error) {
    const errMessage = error.response?.data?.message || "Something went wrong";
    dispatch({
      type: DELETE_NOTIFICATION_FAILURE,
      error: error.message,
    });
    return Promise.reject(errMessage);
  }
};
