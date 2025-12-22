import axios from "axios";

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
});


axiosSecure.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access-token");
    if (token) {
      config.headers.authorization = `Bearer ${token}`; 
    }
    return config;
  },
  (error) => Promise.reject(error)
);


axiosSecure.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    
    if (status === 401 || status === 403) {
      localStorage.removeItem("access-token");
    }

    return Promise.reject(error);
  }
);

export default axiosSecure;
