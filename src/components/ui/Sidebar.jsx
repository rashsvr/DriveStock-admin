import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { LogOut } from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);

  const navItems = {
    admin: [
      { path: '/dashboard/admins', label: 'Manage Admins' },
      { path: '/dashboard/couriers', label: 'Manage Couriers' },
      { path: '/dashboard/sellers', label: 'Manage Sellers' },
      { path: '/dashboard/buyers', label: 'Manage Buyers' },
      { path: '/dashboard/categories', label: 'Manage Categories' },
    ],
    seller: [
      { path: '/dashboard/products', label: 'My Products' },
      { path: '/dashboard/orders', label: 'My Orders' },
    ],
    buyer: [
      { path: '/dashboard/products', label: 'Browse Products' },
      { path: '/dashboard/cart', label: 'Cart' },
      { path: '/dashboard/orders', label: 'My Orders' },
    ],
    courier: [
      { path: '/dashboard/deliveries', label: 'My Deliveries' },
      // Placeholder for courier-specific routes
    ],
  };

  return (
    <div className="drawer-side">
      <label htmlFor="sidebar" className="drawer-overlay"></label>
      <ul className="menu p-4 w-64 bg-base-100 h-full text-base-content">
        <li className="mb-4">
          <h2 className="text-xl font-bold">Dashboard</h2>
        </li>
        {user &&
          navItems[user.role]?.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => (isActive ? 'bg-primary text-white' : '')}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        <li className="mt-auto">
          <button onClick={logout} className="flex items-center">
            <LogOut className="mr-2" size={20} /> Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;