import {
  GET_COMMENTS_REQUEST,
  GET_COMMENTS_SUCCESS,
  GET_COMMENTS_FAILURE,
  GET_REPLIES_FAILURE,
  GET_REPLIES_REQUEST,
  GET_REPLIES_SUCCESS,
} from "../constants/comments";

const initialState = {
  loading: false,
  comments: [],
  replies: [],
  comment: null,
  error: null,
};

const commentReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_COMMENTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_COMMENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        comments: action.payload,
        error: null,
      };
    case GET_COMMENTS_FAILURE:
      return {
        ...state,
        loading: false,
        comments: [],
        error: action.payload,
      };
    case GET_REPLIES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_REPLIES_SUCCESS:
      return {
        ...state,
        loading: false,
        replies: action.payload,
        error: null,
      };
    case GET_REPLIES_FAILURE:
      return {
        ...state,
        loading: false,
        replies: [],
        error: action.payload,
      };

    default:
      return state;
  }
};

export default commentReducer;
