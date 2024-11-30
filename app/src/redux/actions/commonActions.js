import axios from "../../config/axios";
import {
 
  GET_PROFILE_REQUEST,
  GET_PROFILE_SUCCESS,
  GET_PROFILE_FAILURE,
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
