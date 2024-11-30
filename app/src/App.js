
import "./App.css";
import { Provider } from 'react-redux';

import { Routes, Route } from "react-router-dom";
import LoginPage from "./containers/LoginPage/index";
import store from "./redux/store";

import Layout from "./components/Layouts/index";
import HomePage from "./containers/HomePage/index";
import FriendsPage from "./containers/FriendsPage/index";
import Followers from "./containers/FollowerPage/index";


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
              <Followers />
            </Layout>
          }
        />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </div>
    </Provider>
  );
}

export default App;
