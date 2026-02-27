import axios from "axios";

const API = "http://127.0.0.1:5000";

export const generateResponse = (data) =>
  axios.post(`${API}/generate`, data);