// client/src/api/auth.routes.js
import axiosNoAuth from "../axios/axiosNoAuth";
import axiosAuth from "../axios/axiosAuth";

export const loginUser = async (credentials) => {
  try {
    const res = await axiosNoAuth.post('/auth/login', credentials);
     const token = res.data.data.token; // bk trimite token
    localStorage.setItem('token', token); 
  
    return res.data;
  } catch (error) {
    console.error("Error logging in:", error);
    return error.response?.data;
  }
};

export const checkToken = async (token) => {
  try {
    const res = await axiosAuth.post('/auth/check', { token });
    return res.data;
  } catch (error) {
    console.error("Token validation failed:", error);
    throw error;
  }
};
