// src/pages/Orders/OrderDetails.jsx
// NO CHANGES REQUIRED from the previous version.
// Keep the version provided in the previous response.
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// Adjust the path to your api.js file if needed
import api from '../../../api/api';

// Placeholder: Replace with your actual logic
const checkIsAdmin = () => {
  return false; // Assume not admin by default
};

const OrderDetails = () => {
  const { orderId } = useParams(); // Get orderId from URL parameter
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [isProcessingAction, setIsProcessingAction] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const isAdmin = checkIsAdmin();

  const fetchOrderDetails = async () => {
    if (!orderId) return;
    setLoading(true);
    setError(null);
    setActionError(null);
    try {
      const response = await api.orders.getDetails(orderId);
      setOrder(response.data);
      setNewStatus(response.data?.status || '');
    } catch (err) {
      console.error("Error fetching order details:", err);
      if (err.response?.status === 404) { setError("Order not found."); }
      else if (err.response?.status === 403) { setError("Unauthorized to view this order."); }
      else { setError(err.response?.data?.error || "Failed to fetch order details."); }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const handleCancelOrder = async () => {
    if (!order?.id || order.status === 'cancelled' || order.status === 'completed') return;

    setActionError(null);
    setIsProcessingAction(true);
    if (window.confirm(`Are you sure you want to cancel Order #${order.id}?`)) {
      try {
        await api.orders.cancel(order.id);
        alert('Order cancelled successfully!');
        fetchOrderDetails(); // Refetch details
      } catch (err) {
        console.error("Error cancelling order:", err);
        setActionError(err.response?.data?.error || "Failed to cancel order.");
      } finally {
         setIsProcessingAction(false);
      }
    } else {
       setIsProcessingAction(false);
    }
  };

  const handleUpdateStatus = async (e) => {
     e.preventDefault();
     if (!isAdmin || !order?.id || !newStatus || newStatus === order.status) return;

     setActionError(null);
     setIsProcessingAction(true);
     try {
        await api.orders.updateStatus(order.id, newStatus);
        alert('Order status updated successfully!');
        fetchOrderDetails(); // Refetch details
     } catch (err) {
        console.error("Error updating order status:", err);
        setActionError(err.response?.data?.error || "Failed to update status.");
     } finally {
        setIsProcessingAction(false);
     }
  };


  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const formatDate = (dateString) => {
     return new Date(dateString).toLocaleString();
  }

  // --- Render Logic ---
  if (loading) return <p>Loading order details...</p>;
  if (error) return <p style={styles.error}>Error: {error}</p>;
  if (!order) return <p>Order data not available.</p>;

  const canCancel = !isAdmin && order.status !== 'completed' && order.status !== 'cancelled';

  return (
    <div>
      <h1>Order Details #{order.id}</h1>
      <button onClick={() => navigate(-1)} style={styles.backButton}>← Back to Orders</button>

      <div style={styles.detailsGrid}>
          <div><strong>Order ID:</strong> #{order.id}</div>
          <div><strong>Status:</strong> <span style={{...styles.statusBadge, ...styles.status[order.status]}}>{order.status}</span></div>
          <div><strong>Order Date:</strong> {formatDate(order.created_at)}</div>
          <div><strong>Last Updated:</strong> {formatDate(order.updated_at)}</div>
          {isAdmin && <div><strong>User:</strong> {order.username || `ID: ${order.user_id}`}</div>}
          <div><strong>Total Amount:</strong> {formatCurrency(order.total_amount)}</div>
      </div>

      {/* Action Buttons */}
      <div style={styles.actionsContainer}>
          {canCancel && (
             <button onClick={handleCancelOrder} disabled={isProcessingAction} style={styles.cancelButton} >
               {isProcessingAction ? 'Cancelling...' : 'Cancel Order'}
             </button>
           )}
           {actionError && <p style={{...styles.error, marginLeft: '15px'}}>{actionError}</p>}
      </div>


       {/* Admin Status Update */}
      {isAdmin && (
        <form onSubmit={handleUpdateStatus} style={styles.adminForm}>
          <label htmlFor="orderStatus">Update Status:</label>
          <select id="orderStatus" value={newStatus} onChange={(e) => setNewStatus(e.target.value)} disabled={isProcessingAction} style={styles.selectInput}>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
          </select>
          <button type="submit" disabled={isProcessingAction || newStatus === order.status} style={styles.updateButton}>
              {isProcessingAction ? 'Updating...' : 'Update Status'}
          </button>
        </form>
      )}

      <h2>Order Items</h2>
      {order.items && order.items.length > 0 ? (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Product</th>
              <th style={styles.th}>Quantity</th>
              <th style={styles.th}>Unit Price (at time of order)</th>
              <th style={styles.th}>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, index) => (
              <tr key={item.product_id || index}>
                <td style={styles.td}>{item.name || `Product ID: ${item.product_id}`}</td>
                <td style={styles.td}>{item.quantity}</td>
                <td style={styles.td}>{formatCurrency(item.unit_price)}</td>
                <td style={styles.td}>{formatCurrency(item.quantity * item.unit_price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No items found for this order.</p>
      )}
    </div>
  );
};

// Basic styles
const styles = {
  backButton: { marginBottom: '20px', padding: '8px 12px', cursor: 'pointer' },
  detailsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', marginBottom: '25px', padding: '15px', border: '1px solid #eee', borderRadius: '4px', backgroundColor: '#fdfdfd' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '20px' },
  th: { borderBottom: '2px solid #ddd', padding: '12px', textAlign: 'left', backgroundColor: '#f8f8f8' },
  td: { borderBottom: '1px solid #eee', padding: '12px', verticalAlign: 'middle' },
  actionsContainer: { marginTop: '20px', marginBottom: '20px', display: 'flex', alignItems: 'center' },
  cancelButton: { padding: '10px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  updateButton: { padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  adminForm: { marginTop: '20px', padding: '15px', border: '1px solid #eee', borderRadius: '4px', backgroundColor: '#f8f9fa' },
  selectInput: { padding: '10px', marginRight: '10px', marginLeft: '5px', minWidth: '150px' },
  error: { color: 'red' },
  statusBadge: { padding: '4px 8px', borderRadius: '12px', fontSize: '0.85em', color: 'white', textTransform: 'capitalize', display: 'inline-block' },
  status: { pending: { backgroundColor: '#ffc107', color: '#333' }, processing: { backgroundColor: '#17a2b8' }, completed: { backgroundColor: '#28a745' }, cancelled: { backgroundColor: '#6c757d' } },
};

export default OrderDetails;