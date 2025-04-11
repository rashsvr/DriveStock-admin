import React from 'react';

const AdminAnalytics = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Analytics</h2>
      <div className="alert alert-info">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="stroke-current shrink-0 w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <span>Analytics feature coming soon with the next backend update.</span>
      </div>
    </div>
  );
};

export default AdminAnalytics;