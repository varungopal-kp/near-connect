
import "./App.css";
import { Provider } from 'react-redux';

import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layouts/index";
import HomePage from "./containers/HomePage/index";
import LoginPage from "./containers/LoginPage/index";
import store from "./redux/store";
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
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </div>
    </Provider>
  );
}

export default App;
