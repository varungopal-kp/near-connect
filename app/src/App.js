import "./App.css";
import "react-responsive-modal/styles.css";

import { Provider } from "react-redux";

import { Routes, Route } from "react-router-dom";
import LoginPage from "./containers/LoginPage/index";
import store from "./redux/store";

import Layout from "./components/Layouts/index";
import Layout2 from "./components/Layouts/index2";
import Notification from "./components/Notifications/index";
import HomePage from "./containers/HomePage/index";
import FriendsPage from "./containers/FriendsPage/index";
import FollowerPage from "./containers/FollowerPage/index";
import NotificationPage from "./containers/NotificationPage/index";
import SearchPage from "./containers/SearchPage/index";
import PortraitPage from "./containers/PortraitPage/index";
import PhotoPage from "./containers/PhotoPage/index";
import VideoPage from "./containers/VideoPage/index";
import ProfilePage from "./containers/ProfilePage/index";
import NearbyPage from "./containers/NearbyPage/index";
import PostPage from "./containers/PostPage/index";
import ChatPage from "./containers/ChatPage/index";
import Loader from "./components/Loader/index";

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
            path="/photos"
            element={
              <Layout>
                <PhotoPage />
              </Layout>
            }
          />
          <Route
            path="/videos"
            element={
              <Layout>
                <VideoPage />
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
          <Route
            path="/search"
            element={
              <Layout layout={2}>
                <SearchPage />
              </Layout>
            }
          />
          <Route
            path="/profile"
            element={
              <Layout>
                <ProfilePage />
              </Layout>
            }
          />
            <Route
            path="/nearby"
            element={
              <Layout>
                <NearbyPage />
              </Layout>
            }
          />
           <Route
            path="/posts"
            element={
              <Layout>
                <PostPage />
              </Layout>
            }
          />
           <Route
            path="/chats"
            element={
              <Layout>
                <ChatPage />
              </Layout>
            }
          />
          <Route
            path="/account/:username"
            element={
              <Layout2>
                <PortraitPage />
              </Layout2>
            }
          />
          <Route
            path="/account/:username/friends"
            element={
              <Layout2>
                <FriendsPage />
              </Layout2>
            }
          />
          <Route
            path="/account/:username/followers"
            element={
              <Layout2>
                <FollowerPage />
              </Layout2>
            }
          />
          <Route
            path="/account/:username/photos"
            element={
              <Layout2>
                <PhotoPage />
              </Layout2>
            }
          />
          <Route
            path="/account/:username/videos"
            element={
              <Layout2>
                <VideoPage />
              </Layout2>
            }
          />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
      <Loader />
      <Notification />
    </Provider>
  );
}

export default App;
