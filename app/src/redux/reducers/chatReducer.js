import {
  GET_CHAT_HISTORY_REQUEST,
  GET_CHAT_HISTORY_SUCCESS,
  GET_CHAT_HISTORY_FAILURE,
} from "../constants/chat";

const initialState = {
  loading: false,
  chats: [],
  error: null,
};

const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CHAT_HISTORY_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_CHAT_HISTORY_SUCCESS:
      return {
        ...state,
        loading: false,
        chats: action.payload,
        error: null,
      };
    case GET_CHAT_HISTORY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default chatReducer;
