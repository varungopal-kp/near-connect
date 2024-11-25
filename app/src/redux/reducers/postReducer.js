import {
  CREATE_POSTS_FAILURE,
  CREATE_POSTS_REQUEST,
  CREATE_POSTS_SUCCESS,
  GET_POSTS_FAILURE,
  GET_POSTS_REQUEST,
  GET_POSTS_SUCCESS,
} from "../constants/posts";

const initialState = {
  loading: false,
  posts: null,
  post: null,
  error: null,
};

const postReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_POSTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_POSTS_SUCCESS:
      return {
        ...state,
        loading: false,
        posts: action.payload,
        error: null,
      };
    case GET_POSTS_FAILURE:
      return {
        ...state,
        loading: false,
        posts: null,
        error: action.payload,
      };
    case CREATE_POSTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case CREATE_POSTS_SUCCESS:
      return {
        ...state,
        loading: false,
        post: action.payload,
        error: null,
      };
    case CREATE_POSTS_FAILURE:
      return {
        ...state,
        loading: false,
        post: null,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default postReducer;
