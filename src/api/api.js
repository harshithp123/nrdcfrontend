import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Create a separate axios instance for token renewal
const refreshInstance = axios.create({
  baseURL: "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
});

// Request interceptor → attach access token
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor → handle token expiration
api.interceptors.response.use(
  (response) => response?.data,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const currentToken = sessionStorage.getItem("token");
        if (!currentToken) throw new Error("No token found");

        // ⚡ Use refreshInstance to avoid recursive interceptor calls
        const res = await refreshInstance.get(`/api/auth/renew?token=${currentToken}`);

        // Adjust this based on your backend response
        const newToken = res.data.accessToken || res.data.token;

        if (!newToken) throw new Error("No new token returned");

        sessionStorage.setItem("token", newToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        console.error("Token renewal failed ❌", err);
        sessionStorage.removeItem("token");
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
