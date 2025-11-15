import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setToken, setCheckTokenLoading } from '../store/slices/userSlice';

export default function useCheckToken() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(setToken(token));
    }
    dispatch(setCheckTokenLoading(false));
  }, [dispatch]);
}
