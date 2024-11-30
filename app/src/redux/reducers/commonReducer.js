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
} from "./../constants/common";

const initialState = {
  list: [],
  profile: null,
  loading: false,
  error: null,
  page: 1,
  totalPages: 1,
  hasMore: false,
};

const itemsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ITEMS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_ITEMS_SUCCESS:
      console.log(action.payload);
      return {
        ...state,
        loading: false,
        list: [...state.list, ...action.payload.list],
        page: state.page + 1,
        hasMore: action.payload.hasMore,
      };
    case FETCH_ITEMS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    case UPDATE_PAGE:
      return { ...state, page: action.payload };
    case CREATE_ITEM:
      const oldList = state.list;
      if (state.hasMore) {
        oldList.pop();
      }
      return {
        ...state,
        list: [action.payload, ...oldList],
      };
    case UPDATE_ITEMS:
      let newList = [...state.list];
      newList = newList.map((item) =>
        item._id === action.payload._id ? action.payload : item
      );
      return {
        ...state,
        list: newList,
      };
    case DELETE_ITEM:
      return {
        ...state,
        list: state.list.filter((item) => item._id !== action.payload),
      };
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
        profile: action.payload,
      };
    case GET_PROFILE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case CLEAR_LIST:
      return {
        ...state,
        list: [],
      };
    default:
      return state;
  }
};

export default itemsReducer;
