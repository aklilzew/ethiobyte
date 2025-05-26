import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../../api/api'; // Adjust path if needed relative to this file
import { format } from 'date-fns'; // For date formatting

// Import Icons
import { FiShoppingCart, FiUser, FiMail, FiDollarSign, FiClock, FiCheckCircle, FiRefreshCw, FiXCircle, FiAlertCircle, FiList, FiLoader, FiArrowLeft, FiEdit, FiSave, FiPackage, FiInfo } from 'react-icons/fi'; // Added FiPackage, FiInfo

const OrderDetailPage = () => {
  // --- LOGIC (Unchanged) ---
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const validStatuses = ['pending', 'processing', 'completed', 'cancelled']; // Kept original

  const fetchOrderDetails = useCallback(async () => {
    if (!id) { setError("Order ID missing in URL."); setLoading(false); return; }
    setLoading(true); setError(''); setUpdateError(''); setUpdateSuccess('');
    try {
      console.log(`Fetching order details for ID: ${id}`);
      const response = await api.orders.getDetails(id);
      console.log("API Response Data:", response.data); // Keep for debugging items issue
      setOrder(response.data);
      setSelectedStatus(response.data.status || '');
    } catch (err) {
      console.error("Error fetching order details:", err);
      if (err.response?.status === 404) { setError(`Order with ID ${id} not found.`); }
      else { setError(err.response?.data?.error || 'Failed to fetch order details.'); }
      setOrder(null);
    } finally { setLoading(false); }
  }, [id]);

  useEffect(() => { fetchOrderDetails(); }, [fetchOrderDetails]);

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value); setUpdateError(''); setUpdateSuccess('');
  };

  const handleUpdateStatus = async (event) => {
    event.preventDefault();
    if (!selectedStatus || !order || !id) { setUpdateError("Missing required info."); return; }
    setIsUpdating(true); setUpdateError(''); setUpdateSuccess('');
    try {
      await api.orders.updateStatus(id, selectedStatus);
      setUpdateSuccess('Order status updated successfully!');
      setOrder(prevOrder => ({ ...prevOrder, status: selectedStatus, updated_at: new Date().toISOString() }));
    } catch (err) {
      console.error("Error updating status:", err);
      setUpdateError(err.response?.data?.error || 'Failed to update status.');
    } finally { setIsUpdating(false); }
  };

  // Date formatting helper (using Pp format)
  const formatDate = (dateString) => {
     if (!dateString) return <span className="text-gray-400 italic">N/A</span>;
    try {
      return format(new Date(dateString), 'Pp');
    } catch (e) {
      console.warn("Could not format date:", dateString, e);
      return <span className="text-red-500 italic">Invalid Date</span>;
    }
  };

   // Status badge helper (using Tailwind classes and icons)
  const getStatusBadge = (status) => {
     const lowerStatus = status?.toLowerCase() || 'unknown';
     switch (lowerStatus) {
       case 'pending': return { icon: <FiClock className="mr-1.5" />, classes: 'bg-yellow-100 text-yellow-800' };
       case 'processing': return { icon: <FiRefreshCw className="mr-1.5" />, classes: 'bg-blue-100 text-blue-800' }; // Add animate-spin-slow in CSS if desired
       case 'completed': return { icon: <FiCheckCircle className="mr-1.5" />, classes: 'bg-green-100 text-green-800' };
       case 'cancelled': return { icon: <FiXCircle className="mr-1.5" />, classes: 'bg-red-100 text-red-800' };
       default: return { icon: <FiInfo className="mr-1.5" />, classes: 'bg-gray-100 text-gray-700' };
     }
   };
  // --- END OF LOGIC ---


  // --- UI Rendering (Improved with Tailwind, text-base focus) ---

  // Loading State
  if (loading) {
     return (
       <div className="flex flex-col justify-center items-center min-h-[calc(100vh-10rem)] text-center p-10 bg-gray-50">
         <FiLoader className="animate-spin text-5xl text-blue-500 mb-4" />
         <p className="text-xl text-gray-600">Loading order details...</p>
       </div>
     );
   }

  // Error State (Fetch Failed)
  if (error) {
     return (
        <div className="bg-gray-100 min-h-screen p-6 lg:p-10">
          <div className="mb-6 flex flex-col items-center gap-4 bg-red-100 border border-red-300 text-red-800 p-6 rounded-lg shadow-md max-w-lg mx-auto text-center" role="alert">
            <FiAlertCircle className="h-10 w-10 text-red-600" />
            <div>
              <h3 className="text-xl font-semibold mb-2">Error Loading Order</h3>
              <p className="text-base">{error}</p> {/* text-base */}
               <Link
                 to="/admin/orders"
                 className="mt-4 inline-flex items-center gap-2 px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500" // text-base
               >
                 <FiArrowLeft size={18}/>
                 Back to Order List
               </Link>
            </div>
          </div>
        </div>
     );
   }

   // Fallback if order is null after loading (e.g., 404 handled gracefully)
   if (!order) {
     return (
       <div className="bg-gray-100 min-h-screen p-6 lg:p-10 text-center">
         <p className="text-base text-gray-600">Order data could not be loaded.</p> {/* text-base */}
         <Link to="/admin/orders" className="mt-4 inline-block text-base text-blue-600 hover:underline">Back to Order List</Link> {/* text-base */}
       </div>
     );
   }

  // --- Main Content Display ---
   const statusInfo = getStatusBadge(order.status);

  return (
    <div className="bg-gray-100 min-h-screen p-6 lg:p-10">
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <div className="mb-6">
           <Link
             to="/admin/orders"
             className="inline-flex items-center gap-2 text-base text-blue-600 hover:text-blue-800 hover:underline" // text-base
           >
             <FiArrowLeft size={18}/>
             Back to Order List
           </Link>
        </div>

        {/* Main Card */}
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
           {/* Header */}
           <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 border-b border-gray-200">
             <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
               <FiShoppingCart className="text-blue-600" />
               Order Details #{order.id}
             </h1>
          </div>

           {/* Order Summary Section */}
           <div className="p-6 md:p-8 border-b border-gray-200">
             <h2 className="text-xl font-semibold text-gray-700 mb-4">Summary</h2>
             {/* Using Definition List for better structure and styling */}
             <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 text-base"> {/* text-base, adjusted gaps */}
                <div className="flex flex-col">
                    <dt className="font-medium text-gray-500 mb-1">Order ID</dt>
                    <dd className="text-gray-900">{order.id}</dd>
                </div>
                 <div className="flex flex-col">
                    <dt className="font-medium text-gray-500 mb-1 flex items-center gap-1.5"><FiUser size={16} /> User</dt>
                    <dd className="text-gray-900">
                        {order.username || <span className="italic text-gray-400">N/A</span>}
                    </dd>
                 </div>
                <div className="flex flex-col">
                    <dt className="font-medium text-gray-500 mb-1 flex items-center gap-1.5"><FiMail size={16} /> Email</dt>
                     <dd className="text-gray-900">
                         {order.email || <span className="italic text-gray-400">No Email Provided</span>}
                     </dd>
                </div>
                 <div className="flex flex-col">
                    <dt className="font-medium text-gray-500 mb-1 flex items-center gap-1.5"><FiDollarSign size={16} /> Total Amount</dt>
                     <dd className="text-gray-900 font-semibold">
                        ${Number(order.total_amount || 0).toFixed(2)}
                     </dd>
                </div>
                <div className="flex flex-col">
                    <dt className="font-medium text-gray-500 mb-1">Current Status</dt>
                    <dd className="text-gray-900">
                         <span
                           className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${statusInfo.classes}`} // Badge uses text-sm is fine
                           title={`Status: ${order.status || 'unknown'}`}
                         >
                           {statusInfo.icon}
                           {order.status || 'unknown'}
                         </span>
                    </dd>
                </div>
                 <div className="flex flex-col">
                    <dt className="font-medium text-gray-500 mb-1 flex items-center gap-1.5"><FiClock size={16} /> Created At</dt>
                    <dd className="text-gray-900">{formatDate(order.created_at)}</dd>
                 </div>
                 <div className="flex flex-col">
                    <dt className="font-medium text-gray-500 mb-1 flex items-center gap-1.5"><FiRefreshCw size={16} /> Last Updated</dt>
                    <dd className="text-gray-900">{formatDate(order.updated_at)}</dd>
                 </div>
             </dl>
           </div>

           {/* Order Items Section */}
           <div className="p-6 md:p-8 border-b border-gray-200">
             <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2"><FiList/> Items</h2>
              {/* ADDED Array.isArray() check */}
             {order.items && Array.isArray(order.items) && order.items.length > 0 ? (
               <div className="overflow-x-auto border border-gray-200 rounded-lg"> {/* Rounded table container */}
                 <table className="min-w-full divide-y divide-gray-200 text-base"> {/* text-base */}
                   <thead className="bg-gray-50">
                     <tr>
                       <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                       <th scope="col" className="px-5 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                       <th scope="col" className="px-5 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                       <th scope="col" className="px-5 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                     </tr>
                   </thead>
                   <tbody className="bg-white divide-y divide-gray-200">
                     {order.items.map((item, index) => (
                       <tr key={`${item.product_id}-${index}-${item.quantity}`} className="hover:bg-gray-50/50"> {/* Improved key slightly */}
                         <td className="px-5 py-4 whitespace-nowrap font-medium text-gray-800">{item.name || `Product ID: ${item.product_id}`}</td>
                         <td className="px-5 py-4 whitespace-nowrap text-center text-gray-600">{item.quantity || 0}</td>
                         <td className="px-5 py-4 whitespace-nowrap text-right text-gray-600">${Number(item.unit_price || 0).toFixed(2)}</td>
                         <td className="px-5 py-4 whitespace-nowrap text-right font-medium text-gray-800">${(Number(item.quantity || 0) * Number(item.unit_price || 0)).toFixed(2)}</td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             ) : (
               <div className="text-center py-8 px-4 border border-dashed border-gray-300 rounded-md">
                  <FiPackage className="mx-auto h-10 w-10 text-gray-400"/>
                 <p className="mt-3 text-base text-gray-500">No items found for this order.</p> {/* text-base */}
               </div>
             )}
           </div>

           {/* Status Update Section */}
           <div className="p-6 md:p-8 bg-gray-50 rounded-b-lg"> {/* Added rounded-b-lg */}
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Update Status</h2>
               <form onSubmit={handleUpdateStatus} className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                 <label htmlFor="statusSelect" className="block text-base font-medium text-gray-700 flex-shrink-0 mb-2 sm:mb-0"> {/* text-base */}
                     New Status:
                 </label>
                 <select
                   id="statusSelect"
                   value={selectedStatus}
                   onChange={handleStatusChange}
                   disabled={isUpdating}
                   aria-label="Select new order status"
                   className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:w-auto flex-grow pl-3 pr-10 py-2.5 text-base border-gray-300 rounded-md disabled:bg-gray-100 appearance-none" // text-base, py-2.5, flex-grow
                 >
                   <option value="" disabled>Select status...</option>
                   {validStatuses.map(status => (
                     <option key={status} value={status}>
                         {status.charAt(0).toUpperCase() + status.slice(1)}
                       </option>
                   ))}
                 </select>
                 <button
                   type="submit"
                   disabled={isUpdating || order.status === selectedStatus || !selectedStatus}
                   className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 w-full sm:w-auto" // text-base, py-2.5
                 >
                   {isUpdating ? (
                      <>
                         <FiLoader className="animate-spin -ml-1 mr-3 h-5 w-5" />
                         Updating...
                      </>
                     ) : (
                      <>
                         <FiSave size={18} className="-ml-1 mr-2" />
                         Update Status
                      </>
                     )}
                 </button>
               </form>
                {/* Update Status Messages */}
               <div className="mt-4 text-base"> {/* text-base */}
                   {updateError && (
                       <p className="text-red-600 bg-red-50 p-3 rounded-md flex items-center gap-2">
                           <FiXCircle size={18}/> {updateError}
                       </p>
                   )}
                   {updateSuccess && (
                       <p className="text-green-600 bg-green-50 p-3 rounded-md flex items-center gap-2">
                          <FiCheckCircle size={18}/> {updateSuccess}
                       </p>
                    )}
               </div>
           </div>
        </div>
      </div>
      {/* Removed the <style jsx> block */}
    </div>
  );
};

export default OrderDetailPage;