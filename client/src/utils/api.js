import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

export const authHeaders = async (user) => {
  if (!user) return {};

  const token = await user.getIdToken();

  return {
    Authorization: `Bearer ${token}`,
  };
};

export default api;