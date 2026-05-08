import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true, // send session cookie
});

export default api;
