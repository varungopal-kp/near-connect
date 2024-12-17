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
  PROFILE_SEARCH_REQUEST,
  PROFILE_SEARCH_SUCCESS,
  PROFILE_SEARCH_FAILURE,
  FETCH_ITEMS_REQUEST,
  FETCH_ITEMS_SUCCESS,
  FETCH_ITEMS_FAILURE,
  UPDATE_PROFILE_IMAGE_REQUEST,
  UPDATE_PROFILE_IMAGE_SUCCESS,
  UPDATE_PROFILE_IMAGE_FAILURE,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAILURE,
  GET_NEARBY_USERS_REQUEST,
  GET_NEARBY_USERS_SUCCESS,
  GET_NEARBY_USERS_FAILURE,
  BLOCK_USER_REQUEST,
  BLOCK_USER_SUCCESS,
  BLOCK_USER_FAILURE,
  UNBLOCK_USER_REQUEST,
  UNBLOCK_USER_SUCCESS,
  UNBLOCK_USER_FAILURE,
  UPDATE_FCM_REQUEST,
  UPDATE_FCM_SUCCESS,
  UPDATE_FCM_FAILURE,
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
export const searchProfile =
  ({ page, limit, search }) =>
  async (dispatch) => {
    try {
      dispatch({ type: FETCH_ITEMS_REQUEST });
      const response = await axios.get("/users/search", {
        params: { page, limit, search },
      });

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

export const updateProfileImage = (data) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PROFILE_IMAGE_REQUEST });
    const response = await axios.put("/users/profile/image", data);
    dispatch({
      type: UPDATE_PROFILE_IMAGE_SUCCESS,
      payload: response.data,
    });
    return Promise.resolve(response.data);
  } catch (error) {
    const errMessage = error.response?.data?.message || "Something went wrong";
    dispatch({
      type: UPDATE_PROFILE_IMAGE_FAILURE,
      error: error.message,
    });
    return Promise.reject(errMessage);
  }
};

export const updateProfile = (data) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PROFILE_REQUEST });
    const response = await axios.put("/users/profile", data);
    dispatch({
      type: UPDATE_PROFILE_SUCCESS,
      payload: response.data,
    });
    return Promise.resolve(response.data);
  } catch (error) {
    const errMessage = error.response?.data?.message || "Something went wrong";
    dispatch({
      type: UPDATE_PROFILE_FAILURE,
      error: error.message,
    });
    return Promise.reject(errMessage);
  }
};

export const getNearByUsers =
  ({ page, limit }) =>
  async (dispatch) => {
    try {
      dispatch({ type: FETCH_ITEMS_REQUEST });
      const response = await axios.get("/users/nearby", {
        params: { page, limit },
      });
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
export const blockUser = (data) => async (dispatch) => {
  try {
    dispatch({ type: BLOCK_USER_REQUEST });
    const response = await axios.post("/users/block", data);
    dispatch({
      type: BLOCK_USER_SUCCESS,
      payload: response.data,
    });
    return Promise.resolve(response.data);
  } catch (error) {
    const errMessage = error.response?.data?.message || "Something went wrong";
    dispatch({
      type: BLOCK_USER_FAILURE,
      error: error.message,
    });
    return Promise.reject(errMessage);
  }
};
export const unblockUser = (data) => async (dispatch) => {
  try {
    dispatch({ type: UNBLOCK_USER_REQUEST });
    const response = await axios.post("/users/unblock", data);
    dispatch({
      type: UNBLOCK_USER_SUCCESS,
      payload: response.data,
    });
    return Promise.resolve(response.data);
  } catch (error) {
    const errMessage = error.response?.data?.message || "Something went wrong";
    dispatch({
      type: UNBLOCK_USER_FAILURE,
      error: error.message,
    });
    return Promise.reject(errMessage);
  }
};

export const updateFcmToken = (data) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_FCM_REQUEST });
    const response = await axios.put("/users/fcm-token", data);
    dispatch({
      type: UPDATE_FCM_SUCCESS,
      payload: response.data,
    });
    return Promise.resolve(response.data);
  } catch (error) {
    const errMessage = error.response?.data?.message || "Something went wrong";
    dispatch({
      type: UPDATE_FCM_FAILURE,
      error: error.message,
    });
    return Promise.reject(errMessage);
  }
};