import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import { thunk } from "redux-thunk";
import authReducer from "../redux/reducers/authReducer";
import postReducer from "../redux/reducers/postReducer";
import commonReducer from "../redux/reducers/commonReducer";
import followerReducer from "../redux/reducers/followerReducer";

// Combine multiple reducers (if needed) into a rootReducer
const rootReducer = combineReducers({
  auth: authReducer,
  post: postReducer,
  common: commonReducer,
  connections: followerReducer,
});

// Check if Redux DevTools Extension is installed and use it if available
const composeEnhancers =
  (typeof window !== "undefined" &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

// Create Redux store with middleware and enhancers
const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

export default store;