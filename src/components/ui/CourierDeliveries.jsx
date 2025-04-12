import React from 'react';
import { useAuth } from '../../context/AuthContext';
import LoadingAnimation from '../function/LoadingAnimation';

const CourierDeliveries = () => {
  const { isAuthChecked } = useAuth();

  if (!isAuthChecked) return <LoadingAnimation />;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Deliveries</h2>
      <p>Manage your deliveries here.</p>
      {/* Add delivery list, status updates, etc. */}
    </div>
  );
};

export default CourierDeliveries;