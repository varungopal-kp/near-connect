import {
  GET_FOLLOWERS_REQUEST,
  GET_FOLLOWERS_PENDING_REQUEST,
  GET_FRIEND_REQUEST,
} from "../constants/follow";

const initialState = {
  loading: false,
  followers: null,
  friends: null,
  pendingFollowers: null,
  error: null,
};

const followReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_FOLLOWERS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case GET_FOLLOWERS_PENDING_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case GET_FRIEND_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    default:
      return state;
  }
};

export default followReducer;
