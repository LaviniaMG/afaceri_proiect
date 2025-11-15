import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function HomePage() {
  const { role } = useSelector(state => state.user);

  if (!role) return null;

  if (role === 'admin') return <Navigate to="/admin" replace />;
  return <Navigate to="/user/dashboard" replace />;
}
