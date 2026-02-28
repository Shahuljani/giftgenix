import axios from "axios";

const API = "https://giftgenix.onrender.com";

export const generateResponse = (data) =>
  axios.post(`${API}/generate`, data);