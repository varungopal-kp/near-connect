import axios from "axios";
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  SIGNUP_FAILURE,
  LOGOUT,
} from "../constants/auth";

const BASE_URL = process.env.REACT_APP_BASE_URL;
export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_REQUEST });

    // You would typically make an API call here
    const response = await axios.post(BASE_URL + "/auth/login", {
      email,
      password,
    });

    // On success, dispatch LOGIN_SUCCESS with the token and user data
    dispatch({
      type: LOGIN_SUCCESS,
      payload: response.data?.data || null,
    });
    // Save the token to localStorage (or session storage)
    if (response.data.data) {
      localStorage.setItem("token", response.data.data.accessToken);
      localStorage.setItem("rtoken", response.data.data.refreshToken);
      localStorage.setItem("userId", response.data.data.user?._id);
    }
    return Promise.resolve(response.data);
  } catch (error) {
    console.log(error);
    const errMessage = error.response?.data?.message || "Login failed";
    dispatch({
      type: LOGIN_FAILURE,
      payload: errMessage,
    });
    return Promise.reject(errMessage);
  }
};

export const signup = (data) => async (dispatch) => {
  try {
    dispatch({ type: SIGNUP_REQUEST });

    // You would typically make an API call here
    const response = await axios.post(BASE_URL + "/auth/signup", {
      ...data,
    });

    // On success, dispatch SIGNUP_SUCCESS with the token and user data
    dispatch({
      type: SIGNUP_SUCCESS,
      payload: response.data?.data || null,
    });
    // Save the token to localStorage (or session storage)

    return Promise.resolve(response.data);
  } catch (error) {
    const errMessage = error.response?.data?.message || "Signup failed";
    dispatch({
      type: SIGNUP_FAILURE,
      payload: errMessage,
    });
    return Promise.reject(errMessage);
  }
};

// Logout action
export const logout = () => {
  return (dispatch) => {
    localStorage.removeItem("token");
    localStorage.removeItem("rtoken");
    dispatch({ type: LOGOUT });
  };
};
