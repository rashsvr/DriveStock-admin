import React from 'react';
import { useAuth } from '../../context/AuthContext';
import LoadingAnimation from '../function/LoadingAnimation';

const CourierAnalytics = () => {
  const { isAuthChecked } = useAuth();

  if (!isAuthChecked) return <LoadingAnimation />;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Courier Analytics</h2>
      <p>View your delivery performance here.</p>
      {/* Add charts, stats, etc. */}
    </div>
  );
};

export default CourierAnalytics;