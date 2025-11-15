import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/User/Profile';
import AdminDashboard from './pages/Admin/AdminPage';
import Pets from './pages/User/Pets';
import Products from './pages/User/Products';
import Cart from './pages/User/Cart';
import Register from './pages/Auth/Register';
import Login from './pages/Auth/LoginPage';
import Dashboard from './pages/User/Dashboard';
import ProductsPage from './pages/Admin/ProductsPage';
import { ProtectedLayout, AuthLayout } from './components/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: "login", element: <Login /> },
          { path: "register", element: <Register /> },
        ],
      },
      {
        element: <ProtectedLayout allowedRoles={['user', 'admin']} />,
        children: [
          { index: true, element: <HomePage /> },
        ],
      },
      {
        element: <ProtectedLayout allowedRoles={['user']} />,
        children: [
          { path: "user/dashboard", element: <Dashboard /> },
          { path: "user/pets", element: <Pets /> },
          { path: "user/products", element: <Products /> },
          { path: "user/cart", element: <Cart /> },
          { path: "profile", element: <ProfilePage /> }
        ],
      },
      {
        element: <ProtectedLayout allowedRoles={['admin']} />,
        children: [
          { path: "admin", element: <AdminDashboard /> },
           { path: "admin/products", element: <ProductsPage /> }
        ],
      },
    ],
  },
]);
