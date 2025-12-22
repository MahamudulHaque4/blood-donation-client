import axios from "axios";

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
});

// ✅ attach JWT token
axiosSecure.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access-token");
    if (token) {
      config.headers.authorization = `Bearer ${token}`; // ✅ lowercase
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ DO NOT force redirect here
axiosSecure.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // optional: cleanup token only
    if (status === 401 || status === 403) {
      localStorage.removeItem("access-token");
    }

    return Promise.reject(error);
  }
);

export default axiosSecure;
