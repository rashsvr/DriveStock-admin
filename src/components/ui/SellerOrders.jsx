import React, { useState, useEffect } from "react";
import sellerApi from "../../services/sellerApi";
import Alert from "./Alert"; // Adjust path as needed
import LoadingAnimation from "../function/LoadingAnimation";

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({
    status: "",
    startDate: "",
    endDate: "",
  });
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [expandedRow, setExpandedRow] = useState(null); // Track the expanded row

  useEffect(() => {
    fetchOrders();
  }, [pagination.page]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
      };
      if (filters.status) params.status = filters.status;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      console.log("Fetching orders with params:", params);
      const response = await sellerApi.getSellerOrders(params);
      if (!response.success || !Array.isArray(response.data)) {
        throw new Error("Invalid orders data received.");
      }
      console.log("Orders response:", response.data);
      setOrders(response.data);
      setPagination({
        page: response.pagination.page,
        limit: response.pagination.limit,
        total: response.pagination.total,
      });
    } catch (error) {
      const status = error.code || error.response?.status;
      const messages = {
        400: "Invalid filter parameters provided.",
        401: "Unauthorized: Please log in.",
        403: "Forbidden: Seller access required.",
        404: "No orders found with the specified filters.",
        500: "Server error. Please try again later.",
      };
      console.error("Fetch orders error:", error);
      setAlert({
        type: "error",
        message: messages[status] || error.message || "Failed to fetch orders.",
        onClose: () => setAlert(null),
      });
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = async (e) => {
    e.preventDefault();
    setPagination({ ...pagination, page: 1 });
    await fetchOrders();
  };

  const resetFilters = async () => {
    setFilters({ status: "", startDate: "", endDate: "" });
    setPagination({ ...pagination, page: 1 });
    setLoading(true);
    try {
      console.log("Resetting filters, fetching all orders");
      const response = await sellerApi.getSellerOrders({
        page: 1,
        limit: pagination.limit,
      });
      console.log("Reset orders response:", response.data);
      setOrders(response.data);
      setPagination({
        page: response.pagination.page,
        limit: response.pagination.limit,
        total: response.pagination.total,
      });
    } catch (error) {
      const status = error.code || error.response?.status;
      const messages = {
        400: "Invalid request.",
        401: "Unauthorized: Please log in.",
        403: "Forbidden: Seller access required.",
        500: "Server error. Please try again later.",
      };
      setAlert({
        type: "error",
        message: messages[status] || error.message || "Failed to fetch orders.",
        onClose: () => setAlert(null),
      });
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (orderId, status) => {
    setUpdatingOrderId(orderId);
    setNewStatus(status);
  };

  const updateStatus = async (orderId) => {
    if (!newStatus) return;
    setLoading(true);
    try {
      console.log("Updating order status:", { orderId, status: newStatus });
      await sellerApi.updateOrderStatus(orderId, { status: newStatus });
      setAlert({
        type: "success",
        message: "Order status updated successfully.",
        onClose: () => setAlert(null),
      });
      await fetchOrders();
    } catch (error) {
      const status = error.code || error.response?.status;
      const messages = {
        400: "Invalid status provided.",
        401: "Unauthorized: Please log in.",
        403: "Forbidden: Seller access required.",
        404: "Order not found.",
        500: "Server error. Please try again later.",
      };
      setAlert({
        type: "error",
        message:
          messages[status] || error.message || "Failed to update order status.",
        onClose: () => setAlert(null),
      });
    } finally {
      setLoading(false);
      setUpdatingOrderId(null);
      setNewStatus("");
    }
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    setLoading(true);
    try {
      console.log("Cancelling order:", orderId);
      await sellerApi.cancelOrder(orderId);
      setAlert({
        type: "success",
        message: "Order cancelled successfully.",
        onClose: () => setAlert(null),
      });
      await fetchOrders();
    } catch (error) {
      const status = error.code || error.response?.status;
      const messages = {
        400: "Invalid request.",
        401: "Unauthorized: Please log in.",
        403: "Forbidden: Seller access required.",
        404: "Order not found.",
        500: "Server error. Please try again later.",
      };
      setAlert({
        type: "error",
        message: messages[status] || error.message || "Failed to cancel order.",
        onClose: () => setAlert(null),
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > Math.ceil(pagination.total / pagination.limit))
      return;
    setPagination({ ...pagination, page: newPage });
  };

  const toggleRow = (orderId) => {
    setExpandedRow(expandedRow === orderId ? null : orderId);
  };

  if (loading) return <LoadingAnimation />;

  return (
    <div className="p-4 bg-[#1A2526] text-white">
      <h2 className="text-2xl font-bold mb-4 text-blue-500">Manage Orders</h2>
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Filters */}
      <form
        onSubmit={applyFilters}
        className="mb-6 bg-[#1A2526] p-4 rounded-lg"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="label text-sm text-white">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="select select-bordered w-full text-black"
            >
              <option value="">All Statuses</option>
              <option value="Accepted">Accepted</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
            </select>
          </div>
          <div>
            <label className="label text-sm text-white">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="input input-bordered w-full text-black"
            />
          </div>
          <div>
            <label className="label text-sm text-white">End Date</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="input input-bordered w-full text-black"
            />
          </div>
        </div>
        <div className="mt-4 flex space-x-2">
          <button
            type="submit"
            className="btn bg-teal-500 border-none hover:bg-teal-600 text-white"
          >
            Apply Filters
          </button>
          <button
            type="button"
            onClick={resetFilters}
            className="btn bg-orange-500 border-none hover:bg-orange-600 text-white"
          >
            Reset
          </button>
        </div>
      </form>

      {/* Orders Table */}
      <div className="overflow-x-auto rounded-lg">
        <table className="table w-full bg-[#1A2526] text-white">
          <thead className="text-blue-500">
            <tr>
              <th>ID</th>
              <th>Status</th>
              <th>Total</th>
              <th>Date</th>
              <th>Buyer ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <React.Fragment key={order._id + order.item._id}>
                  <tr
                    onClick={() => toggleRow(order._id + order.item._id)}
                    className="cursor-pointer hover:bg-gray-700"
                  >
                    <td>{order._id}</td>
                    <td>{order.item.sellerStatus || "N/A"}</td>
                    <td>
                      {order.item.price
                        ? `$${order.item.price.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })}`
                        : "N/A"}
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>{order.buyerId?._id || "N/A"}</td>
                    <td className="flex space-x-2">
                      {updatingOrderId === order._id ? (
                        <>
                          <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            className="select select-bordered select-sm text-black"
                          >
                            <option value="">Select Status</option>
                            <option value="Accepted">Accepted</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                          </select>
                          <button
                            onClick={() => updateStatus(order._id)}
                            className="btn btn-sm bg-teal-500 border-none hover:bg-teal-600 text-white"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => {
                              setUpdatingOrderId(null);
                              setNewStatus("");
                            }}
                            className="btn btn-sm bg-orange-500 border-none hover:bg-orange-600 text-white"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() =>
                              handleStatusChange(order._id, order.status)
                            }
                            className="btn btn-sm bg-blue-500 border-none hover:bg-blue-600 text-white"
                          >
                            Edit Status
                          </button>
                          {order.item.sellerStatus !== "Cancelled" &&
                            order.item.sellerStatus !== "Delivered" && (
                              <button
                                onClick={() => cancelOrder(order._id)}
                                className="btn btn-sm bg-red-600 border-none hover:bg-red-700 text-white"
                              >
                                Cancel Order
                              </button>
                            )}
                        </>
                      )}
                    </td>
                  </tr>
                  {expandedRow === (order._id + order.item._id) && (
                    <tr>
                      <td colSpan="6" className="p-4 bg-gray-800">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Buyer Information */}
                          <div>
                            <h3 className="text-lg font-semibold text-blue-400">Buyer Information</h3>
                            <p><strong>Name:</strong> {order.buyerId.name}</p>
                            <p><strong>Email:</strong> {order.buyerId.email}</p>
                            <p><strong>Phone:</strong> {order.buyerId.phone}</p>
                          </div>

                          {/* Item Details */}
                          <div>
                            <h3 className="text-lg font-semibold text-blue-400">Item Details</h3>
                            <p><strong>Product Title:</strong> {order.item.productId.title}</p>
                            <p><strong>Brand:</strong> {order.item.productId.brand}</p>
                            <p><strong>Condition:</strong> {order.item.productId.condition}</p>
                            <p><strong>Quantity:</strong> {order.item.quantity}</p>
                            <p><strong>Price per Unit:</strong> ${order.item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                            <p><strong>Images:</strong> {order.item.productId.images.length > 0 ? (
                              <a href={order.item.productId.images[0]} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                View Image
                              </a>
                            ) : 'N/A'}</p>
                          </div>

                          {/* Shipping Address */}
                          <div>
                            <h3 className="text-lg font-semibold text-blue-400">Shipping Address</h3>
                            <p><strong>Street:</strong> {order.shippingAddress.street}</p>
                            <p><strong>City:</strong> {order.shippingAddress.city}</p>
                            <p><strong>District:</strong> {order.shippingAddress.district}</p>
                            <p><strong>Country:</strong> {order.shippingAddress.country}</p>
                            <p><strong>Postal Code:</strong> {order.shippingAddress.postalCode}</p>
                          </div>

                          {/* Courier Details */}
                          <div>
                            <h3 className="text-lg font-semibold text-blue-400">Courier Details</h3>
                            {order.item.courierDetails?.courierId ? (
                              <>
                                <p><strong>Courier ID:</strong> {order.item.courierDetails.courierId}</p>
                                <p><strong>Tracking Number:</strong> {order.item.courierDetails.trackingNumber || 'N/A'}</p>
                              </>
                            ) : (
                              <p>No courier assigned.</p>
                            )}
                            <p><strong>Courier Status:</strong> {order.item.courierStatus || 'N/A'}</p>
                          </div>

                          {/* Status History */}
                          <div className="col-span-1 md:col-span-2">
                            <h3 className="text-lg font-semibold text-blue-400">Status History</h3>
                            {order.item.statusHistory.length > 0 ? (
                              <ul className="list-disc pl-5">
                                {order.item.statusHistory.map((status, index) => (
                                  <li key={index}>
                                    {status.status} - Updated by {status.updatedBy.role} ({status.updatedBy.userId || 'System'}) on {new Date(status.updatedAt).toLocaleString()}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p>No status history available.</p>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-gray-400">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.total > 0 && (
        <div className="flex justify-center mt-4 space-x-2">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="btn bg-teal-500 border-none hover:bg-teal-600 text-white"
          >
            Previous
          </button>
          <span className="self-center">
            Page {pagination.page} of{" "}
            {Math.ceil(pagination.total / pagination.limit)}
          </span>
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={
              pagination.page >= Math.ceil(pagination.total / pagination.limit)
            }
            className="btn bg-teal-500 border-none hover:bg-teal-600 text-white"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default SellerOrders;