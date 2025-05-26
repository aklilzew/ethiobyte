// src/pages/Orders/OrderList.jsx
// NO CHANGES REQUIRED from the previous version with the "Create New Order" button.
// Keep the version provided in the previous response.
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Adjust the path to your api.js file if needed
import api from '../../../api/api';

// Placeholder: Replace with your actual logic to check admin role
const checkIsAdmin = () => {
  // Example: const user = JSON.parse(localStorage.getItem('user')); return user?.role === 'admin';
  return false; // Or determine based on your auth context/storage
};

// Placeholder: Replace with your actual logic to check if a user is logged in
const isLoggedIn = () => !!localStorage.getItem('token');

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const isAdmin = checkIsAdmin(); // Check if the user has admin privileges

  useEffect(() => {
    // Ensure user is logged in before fetching
    if (!isLoggedIn()) {
      setError("Please log in to view orders.");
      setLoading(false);
      // Optionally navigate to login
      // navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        let response;
        if (isAdmin) {
          response = await api.orders.getAll();
        } else {
          response = await api.orders.getMine();
        }
        setOrders(response.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(err.response?.data?.error || `Failed to fetch orders.`);
        if (err.response?.status === 401) {
           setError("Unauthorized. Please log in again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const formatDate = (dateString) => {
     return new Date(dateString).toLocaleDateString();
  }

  return (
    <div>
      <h1>{isAdmin ? 'All Customer Orders' : 'My Orders'}</h1>

      {isLoggedIn() && !isAdmin && (
        <Link to="new" style={styles.createButton}>
          + Create New Order
        </Link>
      )}

      {loading && <p>Loading orders...</p>}
      {error && <p style={styles.error}>Error: {error}</p>}

      {!loading && !error && orders.length === 0 && (
        <p>No orders found.</p>
      )}

      {!loading && !error && orders.length > 0 && (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Order ID</th>
              {isAdmin && <th style={styles.th}>User</th>}
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Total Amount</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td style={styles.td}>#{order.id}</td>
                 {isAdmin && <td style={styles.td}>{order.username || order.email || `User ID: ${order.user_id}`}</td>}
                <td style={styles.td}>{formatDate(order.created_at)}</td>
                <td style={styles.td}>{formatCurrency(order.total_amount)}</td>
                <td style={styles.td}>
                   <span style={{...styles.statusBadge, ...styles.status[order.status]}}>
                      {order.status}
                   </span>
                </td>
                <td style={styles.td}>
                  <Link
                    to={`${order.id}`} // Relative link to details page
                    style={styles.actionLink}
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

// Basic styles
const styles = {
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '20px' },
  th: { borderBottom: '2px solid #ddd', padding: '12px', textAlign: 'left', backgroundColor: '#f8f8f8' },
  td: { borderBottom: '1px solid #eee', padding: '12px', verticalAlign: 'middle' },
  actionLink: { textDecoration: 'none', color: '#007bff', marginRight: '10px', whiteSpace: 'nowrap' },
  createButton: { marginBottom: '20px', display: 'inline-block', padding: '10px 15px', backgroundColor: '#28a745', color: 'white', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold' },
  error: { color: 'red', border: '1px solid red', padding: '10px', borderRadius: '4px', backgroundColor: '#fdd' },
  statusBadge: { padding: '4px 8px', borderRadius: '12px', fontSize: '0.85em', color: 'white', textTransform: 'capitalize', display: 'inline-block', whiteSpace: 'nowrap' },
  status: { pending: { backgroundColor: '#ffc107', color: '#333' }, processing: { backgroundColor: '#17a2b8' }, completed: { backgroundColor: '#28a745' }, cancelled: { backgroundColor: '#6c757d' } },
};

export default OrderList;