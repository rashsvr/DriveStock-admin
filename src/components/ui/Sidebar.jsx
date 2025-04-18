import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
  const { user, logout } = useAuth();

  const navItems = {
    admin: [
      { path: '/dashboard/analytics', label: 'Analytics' },
      { path: '/dashboard/admins', label: 'Manage Admins' },
      { path: '/dashboard/couriers', label: 'Manage Couriers' },
      { path: '/dashboard/sellers', label: 'Manage Sellers' },
      { path: '/dashboard/buyers', label: 'Manage Buyers' },
      { path: '/dashboard/categories', label: 'Manage Categories' },
      { path: '/dashboard/orders', label: 'Manage Orders' },
      { path: '/dashboard/complaints', label: 'Manage Complaints' }, // New item
      { path: '/dashboard/products', label: 'Manage Products' },
    ],
    seller: [
      { path: '/dashboard/analytics', label: 'Analytics' },
      { path: '/dashboard/seller-products', label: 'My Products' },
      { path: '/dashboard/seller-orders', label: 'My Orders' },
    ],
    courier: [
      { path: '/dashboard/analytics', label: 'Analytics' },
      { path: '/dashboard/deliveries', label: 'My Deliveries' },
    ],
  };

  if (!user || user.role === 'buyer') return null;

  return (
    <motion.div
      initial={{ x: -256 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="drawer-side z-40"
    >
      <label htmlFor="sidebar" className="drawer-overlay"></label>
      <div className="w-64 h-full bg-gradient-to-b from-gray-800 to-gray-900 text-white shadow-xl flex flex-col">
        {/* Header with User Profile as Navigation Item */}
        <div className="p-4 border-b border-gray-700">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            <h1 className="text-xl font-bold text-teal-500">DriveStock</h1>
            <NavLink
              to="/dashboard/profile"
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-teal-500 text-white shadow-md'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`
              }
            >
              <motion.div
                whileHover={{ x: 5 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="flex items-center space-x-3"
              >
                <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center">
                  <User size={20} />
                </div>
                <div>
                  <span className="text-sm font-medium">{user?.name || 'User'}</span>
                  <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
                </div>
              </motion.div>
            </NavLink>
          </motion.div>
        </div>

        {/* Navigation Items */}
        <ul className="flex-1 p-4 space-y-2 overflow-y-auto">
          <li className="mb-4">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Dashboard</h2>
          </li>
          <AnimatePresence>
            {navItems[user.role]?.map((item) => (
              <motion.li
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center p-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-teal-500 text-white shadow-md'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`
                  }
                >
                  <motion.span
                    whileHover={{ x: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    {item.label}
                  </motion.span>
                </NavLink>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-700">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 p-2 bg-red-500 hover:bg-red-600 rounded-lg text-white transition-colors duration-200"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;