import axios from "axios";

const api = axios.create({
  baseURL: "https://my-job-portal-x5i9.vercel.app/",
  withCredentials: true
});

api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;