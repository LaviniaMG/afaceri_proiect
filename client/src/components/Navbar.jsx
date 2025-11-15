// client/src/components/Navbar.jsx
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { classNames } from '../utils/tailwind';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/userSlice';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loggedIn, role } = useSelector(state => state.user);

const navigation = [
  { name: 'Homepage', href: '/user/dashboard' },
  ...(role === 'user' ? [
    { name: 'Pets', href: '/user/pets' },
    { name: 'Products', href: '/user/products' },
    { name: 'Cart', href: '/user/cart' },
  ] : []),
  ...(role === 'admin' ? [{ name: 'Admin products', href: '/admin/products' }
  ] : []),
];

  const isActive = (href) => location.pathname === href;

  const handleAuthClick = () => {
    if (loggedIn) {
      dispatch(logout());
      navigate('/login');
    } else {
      navigate('/login');
    }
  };
  const handleProfileClick =() =>{
    if (loggedIn) {
      navigate('/profile');
    } else {
       dispatch(logout());
      navigate('/login');
    }
  }

  return (
    <Disclosure as="nav" className="bg-gray-800">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/* Mobile menu button */}
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <DisclosureButton className="inline-flex items-center justify-center p-2 text-gray-400 hover:bg-gray-700 rounded-md">
              <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              <XMarkIcon className="hidden h-6 w-6" aria-hidden="true" />
            </DisclosureButton>
          </div>
          {/* Logo and links */}
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex-shrink-0">
              <img className="h-8 w-auto" src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500" alt="Logo" />
            </div>
            <div className="hidden sm:block sm:ml-6">
              <div className="flex space-x-4">
                {navigation.map(item => (
                  <Link key={item.name} to={item.href} className={classNames(
                    isActive(item.href) ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'px-3 py-2 rounded-md text-sm font-medium'
                  )}>
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          {/* User menu */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2">
            <Menu as="div" className="relative ml-3">
              <MenuButton className="flex rounded-full focus:outline-none">
                <UserCircleIcon className="h-8 w-8 text-gray-400" />
              </MenuButton>
              <MenuItems className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-1">
                <MenuItem>
                  <button onClick={handleAuthClick} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    {loggedIn ? 'Sign out' : 'Sign in'}
                  </button>
                </MenuItem>
                    <MenuItem>
                  <button onClick={handleProfileClick} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    {loggedIn ? 'Profile' :''}
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>
      <DisclosurePanel className="sm:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navigation.map(item => (
            <Link key={item.name} to={item.href} className={classNames(
              isActive(item.href) ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
              'block px-3 py-2 rounded-md text-base font-medium'
            )}>{item.name}</Link>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
