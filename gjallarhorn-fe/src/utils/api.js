import axios from "axios";

const api = axios.create({
  baseURL: "https://status.aesirsystems.co.za/api", // your Flask backend
  withCredentials: true,
});

export default api;
