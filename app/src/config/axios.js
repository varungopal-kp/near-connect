import axios from "axios";
import store from "../redux/store"; // Import your Redux store
import { logout } from "../redux/actions/authActions"; // Import your logout action

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // Replace with your API URL
});

axiosInstance.defaults.withCredentials = true;

// Request interceptor to add the token to headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Get the token from local storage
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // Add token to request headers
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If the error is due to an expired token (e.g., 401 Unauthorized)
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // Call the refresh token API
        const response = await axios.post(
          "http://localhost:8000/auth/refresh-token",
          {
            refreshToken: localStorage.getItem("rtoken"),
          }
        );

        // Update the local storage with the new token
        const accessToken = response.data?.data?.accessToken;
        localStorage.setItem("token", accessToken);

        // Set the new token to the original request and retry
        axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If refreshing fails, dispatch logout action
        store.dispatch(logout());
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
