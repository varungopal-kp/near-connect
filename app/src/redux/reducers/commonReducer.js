import {
  GET_FOLLOW_USER_DETAIL_FAILURE,
  GET_FOLLOW_USER_DETAIL_REQUEST,
  GET_FOLLOW_USER_DETAIL_SUCCESS,
} from "../constants/follow";
import {
  FETCH_ITEMS_REQUEST,
  FETCH_ITEMS_SUCCESS,
  FETCH_ITEMS_FAILURE,
  UPDATE_PAGE,
  UPDATE_ITEMS,
  CREATE_ITEM,
  DELETE_ITEM,
  GET_PROFILE_REQUEST,
  GET_PROFILE_SUCCESS,
  GET_PROFILE_FAILURE,
  CLEAR_LIST,
  GET_DASHBOARD_COUNT_REQUEST,
  GET_DASHBOARD_COUNT_SUCCESS,
  GET_DASHBOARD_COUNT_FAILURE,
  UPDATE_DASHBOARD_COUNT,
  UPDATE_PROFILE_IMAGE_SUCCESS,
  UPDATE_PROFILE_IMAGE_REQUEST,
  UPDATE_PROFILE_IMAGE_FAILURE,
  UPDATE_PROFILE,
} from "./../constants/common";

const initialState = {
  list: [],
  profile: null,
  loading: false,
  error: null,
  page: 1,
  totalPages: 1,
  hasMore: false,
  totalNotifications: 0,
  totalChats: 0,
  accountDetails: {},
  layout: "1",
};

const itemsReducer = (state = initialState, action) => {
  const listKey = action.listKey || "list";

  switch (action.type) {
    case FETCH_ITEMS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_ITEMS_SUCCESS:
      return {
        ...state,
        loading: false,
        [listKey]: [...(state[listKey] || []), ...action.payload.list],
        page: state.page + 1,
        hasMore: action.payload.hasMore,
      };
    case FETCH_ITEMS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    case CREATE_ITEM:
      const oldList = state[listKey] || [];
      const updatedList = [action.payload, ...oldList];
      if (state.hasMore) {
        updatedList.pop();
      }
      return {
        ...state,
        [listKey]: updatedList,
      };
    case UPDATE_ITEMS:
      return {
        ...state,
        [listKey]: (state[listKey] || []).map((item) =>
          item._id === action.payload._id ? action.payload : item
        ),
      };
    case DELETE_ITEM:
      return {
        ...state,
        [listKey]: (state[listKey] || []).filter(
          (item) => item._id !== action.payload
        ),
      };
    case CLEAR_LIST:
     
      return {
        ...state,
        [listKey]: [],
        page: 1,
        totalPages: 1,
        hasMore: false,
      };
    case UPDATE_PAGE:
      return { ...state, page: action.payload };
    case GET_PROFILE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        profile: null,
      };
    case GET_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        profile: action.payload.data,
      };
    case GET_PROFILE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case GET_DASHBOARD_COUNT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        totalNotifications: 0,
        totalChats: 0,
      };
    case GET_DASHBOARD_COUNT_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        totalNotifications: action.payload.notifications || 0,
        totalChats: action.payload.chats || 0,
      };
    case GET_DASHBOARD_COUNT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case UPDATE_DASHBOARD_COUNT:
      return {
        ...state,
        ...action.payload,
      };
    case GET_FOLLOW_USER_DETAIL_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        accountDetails: {},
      };
    case GET_FOLLOW_USER_DETAIL_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        accountDetails: action.payload?.data || {},
      };
    case GET_FOLLOW_USER_DETAIL_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case UPDATE_PROFILE_IMAGE_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case UPDATE_PROFILE_IMAGE_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        profile: {
          ...state.profile,
          pic: action.payload.data?.pic,
          backgroundPic: action.payload.data?.backgroundPic,
        },
      };
    case UPDATE_PROFILE_IMAGE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case UPDATE_PROFILE:
      return {
        ...state,
        profile: {
          ...state.profile,
          ...action.payload,
        },
      };
    default:
      return state;
  }
};

export default itemsReducer;
