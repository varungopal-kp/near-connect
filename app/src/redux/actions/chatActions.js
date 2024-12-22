import axios from "../../config/axios";
import {
  GET_CHAT_HISTORY_REQUEST,
  GET_CHAT_HISTORY_SUCCESS,
  GET_CHAT_HISTORY_FAILURE,
} from "../constants/chat";
import {
  FETCH_ITEMS_FAILURE,
  FETCH_ITEMS_REQUEST,
  FETCH_ITEMS_SUCCESS,
} from "../constants/common";

export const fetchItems =
  ({ page, limit, user = "" }) =>
  async (dispatch) => {
    dispatch({ type: FETCH_ITEMS_REQUEST });

    try {
      const response = await axios.get("/chats", {
        params: { page, limit, user },
      });

      dispatch({
        type: FETCH_ITEMS_SUCCESS,
        payload: { ...response.data.data },
      });
      return Promise.resolve(response.data);
    } catch (error) {
      const errMessage =
        error.response?.data?.message || "Something went wrong";
      dispatch({ type: FETCH_ITEMS_FAILURE, payload: error.message });
      return Promise.reject(errMessage);
    }
  };

export const fetchMessageItems =
  ({ page, limit, user = "" }) =>
  async (dispatch) => {
    const listKey = "messages";
    dispatch({ type: FETCH_ITEMS_REQUEST, listKey: listKey });

    try {
      const response = await axios.get("/chats/messages/" + user, {
        params: { page, limit },
      });

      dispatch({
        type: FETCH_ITEMS_SUCCESS,
        payload: { ...response.data.data },
        listKey: listKey,
      });
      return Promise.resolve(response.data);
    } catch (error) {
      const errMessage =
        error.response?.data?.message || "Something went wrong";
      dispatch({ type: FETCH_ITEMS_FAILURE, payload: error.message });
      return Promise.reject(errMessage);
    }
  };
