import axios from "../../config/axios";
import {
  GET_CHAT_HISTORY_REQUEST,
  GET_CHAT_HISTORY_SUCCESS,
  GET_CHAT_HISTORY_FAILURE,
} from "../constants/chat";

export const getChatHistory = () => async (dispatch) => {
  try {
    dispatch({ type: GET_CHAT_HISTORY_REQUEST });
    const response = await axios.get("/chats");
    dispatch({
      type: GET_CHAT_HISTORY_SUCCESS,
      payload: response.data,
    });
    return Promise.resolve(response.data);
  } catch (error) {
    const errMessage = error.response?.data?.message || "Something went wrong";
    dispatch({
      type: GET_CHAT_HISTORY_FAILURE,
      payload: errMessage,
    });
    return Promise.reject(errMessage);
  }
};
