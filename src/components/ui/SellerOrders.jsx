import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import Table from './Table';
import Alert from './Alert';
import ConfirmationModal from './ConfirmationModal';
import LoadingAnimation from '../function/LoadingAnimation';
import { format } from 'date-fns';

const SellerOrders = () => {
  const { getSellerOrders, updateOrderStatus } = useAuth();
  const queryClient = useQueryClient();
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['sellerOrders'],
    queryFn: () => getSellerOrders({ page: 1, limit: 100 }), // Fetch all for simplicity
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }) => updateOrderStatus(orderId, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries(['sellerOrders']);
      setIsStatusModalOpen(false);
      setSelectedOrder(null);
      setNewStatus('');
    },
    onError: (err) => {
      // Alert handles error display
    },
  });

  const handleStatusUpdate = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.items[0]?.sellerStatus || 'Pending');
    setIsStatusModalOpen(true);
  };

  const confirmStatusUpdate = () => {
    if (selectedOrder && newStatus) {
      updateStatusMutation.mutate({ orderId: selectedOrder._id, status: newStatus });
    }
  };

  if (isLoading) {
    return <LoadingAnimation />;
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert type="error" message={error.message || 'Failed to load orders'} />
      </div>
    );
  }

  const orders = data?.data || [];

  const columns = [
    { key: '_id', label: 'Order ID', render: (item) => item._id.slice(0, 8) + '...' },
    { key: 'buyer', label: 'Buyer', render: (item) => item.buyerId.name },
    { key: 'total', label: 'Total', render: (item) => `$${item.total.toFixed(2)}` },
    {
      key: 'status',
      label: 'Status',
      render: (item) => item.items[0]?.sellerStatus || 'Pending',
    },
    {
      key: 'createdAt',
      label: 'Date',
      render: (item) => format(new Date(item.createdAt), 'PPP'),
    },
  ];

  const actions = [
    {
      label: 'Update Status',
      className: 'btn-primary bg-highlight-blue hover:bg-blue-700',
      onClick: handleStatusUpdate,
    },
    {
      label: 'View Details',
      className: 'btn-secondary bg-highlight-teal hover:bg-teal-600',
      onClick: (order) => {
        // Log details or open a modal
        console.log('Order Details:', order);
      },
    },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-base-100 text-white">
      <h1 className="text-2xl sm:text-3xl font-bold">Seller Orders</h1>

      {updateStatusMutation.isError && (
        <Alert
          type="error"
          message={updateStatusMutation.error.message || 'Failed to update status'}
        />
      )}

      <div className="card bg-[#2A3536] shadow-xl">
        <div className="card-body">
          <Table
            data={orders}
            columns={columns}
            actions={actions}
            emptyMessage="No orders found"
          />
        </div>
      </div>

      <ConfirmationModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        onConfirm={confirmStatusUpdate}
        title="Update Order Status"
        message={
          <div className="space-y-4">
            <p>Update status for order {selectedOrder?._id.slice(0, 8)}...</p>
            <select
              className="select select-bordered w-full bg-[#2A3536] text-white"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        }
        confirmText={updateStatusMutation.isLoading ? 'Updating...' : 'Update'}
      />
    </div>
  );
};

export default SellerOrders;