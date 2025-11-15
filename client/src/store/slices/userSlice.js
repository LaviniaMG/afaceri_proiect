import { createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

const initialState = {
  token: null,
  loggedIn: false,
  role: null,
  checkTokenLoading: true,
};

const decodeToken = (token) => {
  try {
    if (!token) return null;
    return jwtDecode(token);
  } catch (err) {
    console.error('Failed to decode token:', err);
    return null;
  }
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setToken: (state, action) => {
      const token = action.payload;
      state.token = token;

      const decoded = decodeToken(token);
      if (decoded?.role) {
        state.loggedIn = true;
        state.role = decoded.role; // admin sau user
      } else {
        state.loggedIn = false;
        state.role = null;
      }
    },

    logout: (state) => {
      state.token = null;
      state.loggedIn = false;
      state.role = null;
      localStorage.removeItem('token');
    },
    setCheckTokenLoading: (state, action) => {
      state.checkTokenLoading = action.payload;
    },
  },
});

export const { setToken, logout, setCheckTokenLoading } = userSlice.actions;
export default userSlice.reducer;
