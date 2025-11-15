import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

export const ProtectedLayout = ({ allowedRoles }) => {
  const { loggedIn, role, checkTokenLoading } = useSelector(s => s.user);

  if (checkTokenLoading) return <LoadingSpinner />;
  if (!loggedIn) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/" replace />;

  return <Outlet />;
};

export const AuthLayout = () => {
  const { loggedIn, checkTokenLoading } = useSelector(s => s.user);

  if (checkTokenLoading) return <LoadingSpinner />;
  if (loggedIn) return <Navigate to="/" replace />;

  return <Outlet />;
};
