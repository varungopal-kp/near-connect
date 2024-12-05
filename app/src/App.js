import "./App.css";
import { Provider } from "react-redux";

import { Routes, Route } from "react-router-dom";
import LoginPage from "./containers/LoginPage/index";
import store from "./redux/store";

import Layout from "./components/Layouts/index";
import Notification from "./components/Notifications/index";
import HomePage from "./containers/HomePage/index";
import FriendsPage from "./containers/FriendsPage/index";
import FollowerPage from "./containers/FollowerPage/index";
import NotificationPage from "./containers/NotificationPage/index";

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <HomePage />
              </Layout>
            }
          />
          <Route
            path="/friends"
            element={
              <Layout>
                <FriendsPage />
              </Layout>
            }
          />
          <Route
            path="/followers"
            element={
              <Layout>
                <FollowerPage />
              </Layout>
            }
          />
          <Route
            path="/notifications"
            element={
              <Layout>
                <NotificationPage />
              </Layout>
            }
          />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
      <Notification />
    </Provider>
  );
}

export default App;
