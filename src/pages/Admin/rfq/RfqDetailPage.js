import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; // Import useParams, Link, useNavigate
import api from '../../../api/api'; // Adjust path if needed

// Import Icons
import { FiFileText, FiCalendar, FiUser, FiClock, FiList, FiLoader, FiAlertCircle, FiArrowLeft, FiEdit, FiPackage, FiXCircle } from 'react-icons/fi';
import { format } from 'date-fns'; // For better date formatting

const RfqDetailPage = () => {
  // --- LOGIC (Unchanged) ---
  const { rfqId } = useParams();
  const [rfqDetails, setRfqDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Use navigate for programmatic navigation if needed

  useEffect(() => {
    const fetchRfqData = async () => {
      if (!rfqId) {
        setError('RFQ ID is missing from the URL.');
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        console.log(`Fetching details for RFQ ID: ${rfqId}`);
        const response = await api.rfqs.getDetails(rfqId);
        setRfqDetails(response.data);
      } catch (err) {
        console.error("Failed to fetch RFQ details:", err.response || err);
        setError(err.response?.data?.error || err.message || 'Failed to fetch RFQ details.');
      } finally {
        setLoading(false);
      }
    };
    fetchRfqData();
  }, [rfqId]);

  // Helper for formatting dates consistently
  const formatDate = (dateString, includeTime = false) => {
    if (!dateString) return <span className="text-gray-400">N/A</span>;
    try {
      const date = new Date(dateString);
      // Use date-fns for better formatting options
      const formatString = includeTime ? 'PPpp' : 'PP'; // PP = Oct 26, 2023; PPpp = Oct 26, 2023, 6:30:00 PM
      return format(date, formatString);
    } catch (e) {
      return <span className="text-red-500">Invalid Date</span>;
    }
  }
  // --- END OF LOGIC ---


  // --- UI Rendering (Redesigned with Tailwind) ---

  // Loading State
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-10rem)] text-center p-10 bg-gray-50">
        <FiLoader className="animate-spin text-5xl text-blue-500 mb-4" />
        <p className="text-xl text-gray-600">Loading RFQ details...</p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
       <div className="bg-gray-50 min-h-screen p-6 lg:p-10">
         <div className="mb-6 flex items-start gap-3 bg-red-100 border border-red-300 text-red-800 p-6 rounded-lg shadow-md max-w-2xl mx-auto" role="alert">
           <FiAlertCircle className="h-6 w-6 flex-shrink-0 mt-1" />
           <div>
             <h3 className="text-lg font-semibold mb-2">Error Fetching RFQ Details</h3>
             <p className="text-md">{error}</p>
              <Link
                to="/admin/rfqs" // Link back to the list page
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <FiArrowLeft size={16}/>
                Back to List
              </Link>
           </div>
         </div>
       </div>
    );
  }

  // Not Found State (after loading, if details are still null)
  if (!rfqDetails) {
     return (
       <div className="bg-gray-50 min-h-screen p-6 lg:p-10">
         <div className="text-center py-16">
            <FiXCircle className="mx-auto h-16 w-16 text-gray-400"/>
           <h2 className="mt-4 text-2xl font-semibold text-gray-700">RFQ Not Found</h2>
           <p className="mt-2 text-lg text-gray-500">
             The requested RFQ could not be found or may have been deleted.
           </p>
           <Link
             to="/admin/rfqs" // Link back to the list page
             className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
           >
             <FiArrowLeft size={16}/>
             Back to RFQ List
           </Link>
         </div>
       </div>
     );
  }

  // --- Main Content Display (RFQ Details Found) ---
  return (
    <div className="bg-gray-100 min-h-screen p-6 lg:p-10">
      {/* Card Container */}
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
                <FiFileText className="text-blue-600" />
                {rfqDetails.title}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                RFQ ID: {rfqDetails.rfq_number || rfqDetails.id}
              </p>
            </div>
            {/* Action Buttons */}
            <div className="flex gap-3 flex-shrink-0">
               <Link
                to="/admin/rfqs"
                className="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-300 text-xs sm:text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
              >
                <FiArrowLeft size={16} />
                Back
              </Link>
              
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* Description */}
          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Description</h2>
            <p className="text-base text-gray-600 whitespace-pre-wrap">{rfqDetails.description || <span className="text-gray-400 italic">No description provided.</span>}</p>
          </div>

          {/* Due Date */}
          <div className="flex items-center gap-3 border-t pt-4 md:border-none md:pt-0">
             <FiCalendar className="h-6 w-6 text-red-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-500">Due Date</p>
              <p className="text-base font-semibold text-red-700">{formatDate(rfqDetails.due_date)}</p>
            </div>
          </div>

          {/* Created At */}
          <div className="flex items-center gap-3 border-t pt-4 md:border-none md:pt-0">
            <FiClock className="h-6 w-6 text-gray-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-500">Created At</p>
              <p className="text-base text-gray-700">{formatDate(rfqDetails.created_at, true)}</p>
            </div>
          </div>

          {/* Requester (Optional) */}
          {rfqDetails.requester && (
            <div className="flex items-center gap-3 border-t pt-4 md:border-none md:pt-0">
              <FiUser className="h-6 w-6 text-gray-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-500">Created By</p>
                <p className="text-base text-gray-700">{rfqDetails.requester}</p>
              </div>
            </div>
          )}

        </div> {/* End Details Grid */}

        {/* Items Section */}
        <div className="border-t border-gray-200 px-6 md:px-8 py-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
             <FiList/> Items Requested
          </h2>
          {rfqDetails.items && rfqDetails.items.length > 0 ? (
            <div className="overflow-x-auto border border-gray-200 rounded-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                    <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th scope="col" className="px-5 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rfqDetails.items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50">
                      <td className="px-5 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{item.item_name}</td>
                      <td className="px-5 py-4 whitespace-normal text-sm text-gray-600">{item.description}</td>
                      <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{item.quantity}</td>
                      <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">{item.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 px-4 border border-dashed border-gray-300 rounded-md">
               <FiPackage className="mx-auto h-10 w-10 text-gray-400"/>
              <p className="mt-3 text-base text-gray-500">No items were added to this RFQ.</p>
            </div>
          )}
        </div>
      </div> {/* End Card Container */}
      {/* Removed the <style jsx> block */}
    </div>
  );
};

export default RfqDetailPage;