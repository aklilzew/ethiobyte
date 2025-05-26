import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../api/api';
import { format } from 'date-fns';
import { FiShoppingCart, FiEye, FiLoader, FiAlertCircle, FiInbox, FiUser, FiMail, FiDollarSign, FiCheckCircle, FiClock, FiXCircle, FiRefreshCw, FiInfo } from 'react-icons/fi';

const OrderListPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.orders.getAll();
        setOrders(response.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(err.response?.data?.error || 'Failed to fetch orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return <span className="text-gray-400 italic">N/A</span>;
    try {
      return format(new Date(dateString), 'Pp');
    } catch (e) {
      console.error("Error formatting date:", e);
      return <span className="text-red-500 italic">Invalid Date</span>;
    }
  };

  const getStatusBadge = (status) => {
    const lowerStatus = status?.toLowerCase() || 'unknown';
    switch (lowerStatus) {
      case 'pending':
        return { icon: <FiClock className="mr-1.5" />, classes: 'bg-yellow-100 text-yellow-800' };
      case 'processing':
        return { icon: <FiRefreshCw className="mr-1.5" />, classes: 'bg-blue-100 text-blue-800' };
      case 'completed':
        return { icon: <FiCheckCircle className="mr-1.5" />, classes: 'bg-green-100 text-green-800' };
      case 'cancelled':
        return { icon: <FiXCircle className="mr-1.5" />, classes: 'bg-red-100 text-red-800' };
      default:
        return { icon: <FiInfo className="mr-1.5" />, classes: 'bg-gray-100 text-gray-700' };
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-10rem)] text-center p-10 bg-gray-50">
        <FiLoader className="animate-spin text-5xl text-blue-500 mb-4" />
        <p className="text-xl text-gray-600">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen p-6 lg:p-10">
        <div
          className="mb-6 flex flex-col items-center gap-4 bg-red-100 border border-red-300 text-red-800 p-6 rounded-lg shadow-md max-w-lg mx-auto text-center"
          role="alert"
        >
          <FiAlertCircle className="h-10 w-10 text-red-600" />
          <div>
            <h3 className="text-xl font-semibold mb-2">Error Loading Orders</h3>
            <p className="text-base">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6 lg:p-10">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
          <FiShoppingCart className="text-blue-600" />
          Admin - All Orders
        </h1>
      </div>

      <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full table-fixed divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th scope="col" className="w-[10%] px-6 py-4 text-left text-lg font-semibold text-gray-600 uppercase tracking-wider">
                  Order ID
                </th>
                <th scope="col" className="w-[15%] px-6 py-4 text-left text-lg font-semibold text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <FiUser size={14} />
                    User
                  </div>
                </th>
                <th scope="col" className="w-[20%] px-6 py-4 text-left text-lg font-semibold text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <FiMail size={14} />
                    Email
                  </div>
                </th>
                <th scope="col" className="w-[12%] px-6 py-4 text-left text-lg font-semibold text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <FiDollarSign size={14} />
                    Total
                  </div>
                </th>
                <th scope="col" className="w-[15%] px-6 py-4 text-left text-lg font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="w-[20%] px-6 py-4 text-left text-lg font-semibold text-gray-600 uppercase tracking-wider">
                  Created At
                </th>
                <th scope="col" className="w-[8%] px-6 py-4 text-center text-lg font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-20 text-center text-base text-gray-500">
                    <FiInbox className="mx-auto h-14 w-14 text-gray-400 mb-4" />
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const statusInfo = getStatusBadge(order.status);
                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-blue-50/40 transition-colors duration-200 ease-in-out"
                    >
                      <td className="px-6 py-5 whitespace-nowrap text-lg font-medium text-gray-500">
                        {order.id}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-lg text-gray-800 font-medium">
                        {order.username || <span className="text-gray-400 italic">N/A</span>}
                      </td>
                      <td className="px-6 py-5 text-lg text-gray-600">
                        {order.email || <span className="text-gray-400 italic">N/A</span>}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-lg text-gray-700 font-semibold">
                        ${Number(order.total_amount || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-lg">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${statusInfo.classes}`}
                          title={`Status: ${order.status || 'unknown'}`}
                        >
                          {statusInfo.icon}
                          {order.status || 'unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-base text-gray-500">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-center text-base font-medium">
                        <Link
                          to={`/admin/orders/${order.id}`}
                          className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-900 transition duration-150 ease-in-out px-3 py-1.5 rounded-md hover:bg-indigo-100 text-base font-medium"
                          title="View order details"
                        >
                          <FiEye size={18} />
                          <span>View</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderListPage;