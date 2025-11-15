import {jwtDecode} from 'jwt-decode';

export const decodeToken = (token) => {
  try {
    if (!token || typeof token !== 'string') return null;
    return jwtDecode(token);
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};
