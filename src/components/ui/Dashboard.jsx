import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import LoadingAnimation from '../function/LoadingAnimation';

const Dashboard = ({ children }) => {
  const { user, isAuthChecked } = useAuth();

  if (!isAuthChecked) return <LoadingAnimation />;

  if (!user || user.role === 'buyer') {
    return <Navigate to="/login" replace />;
  }

  // Redirect to analytics for direct /dashboard access
  if (!children) {
    return <Navigate to="/dashboard/analytics" replace />;
  }

  return (
    <div className="drawer lg:drawer-open">
      <input id="sidebar" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <div className="navbar bg-base-100 shadow">
          <div className="flex-none lg:hidden">
            <label htmlFor="sidebar" className="btn btn-square btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-5 h-5 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold">{user?.role.toUpperCase()} Dashboard</h1>
          </div>
        </div>
        <div className="p-6 flex-1">{children}</div>
      </div>
      <Sidebar />
    </div>
  );
};

export default Dashboard;