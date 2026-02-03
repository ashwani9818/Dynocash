import axios from "axios";
import unAuthorizedHelper from "@/helpers/unAutorizedHelper";

const apiBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;
console.log("url for base", apiBaseUrl);

const axiosBaseApi = axios.create({
  baseURL: apiBaseUrl + "api/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: attach token
axiosBaseApi.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete axiosBaseApi.defaults.headers.common.Authorization;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error); // propagate to try/catch
  }
);

// Response interceptor: handle errors like 500 and 403
axiosBaseApi.interceptors.response.use(
  (response) => response, // success responses
  (error) => {
    console.error("API Response error:", error.response ?? error.message);

    // Handle 403 (Unauthorized/Login Expired) - redirect to login
    if (error.response?.status === 403) {
      unAuthorizedHelper(error);
      return Promise.reject(error);
    }

    // Optional: you can return a standard format to always handle errors consistently
    return Promise.reject(error);
  }
);

export default axiosBaseApi;
