import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../../api/api';

// Import Icons (for UI enhancement)
import { FiFileText, FiPlus, FiEye, FiTrash2, FiLoader, FiAlertCircle, FiInbox } from 'react-icons/fi';

const RfqListPage = () => {
  // --- LOGIC (Unchanged) ---
  const [rfqs, setRfqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Kept, though not used in original logic snippet

  const fetchRfqs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.rfqs.getAllRFQS();
      setRfqs(response.data);
    } catch (err) {
      console.error("Failed to fetch RFQs:", err);
      setError(err.response?.data?.error || 'Failed to fetch RFQs. Please try again.');
      if (err.response?.status === 401) {
          // navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRfqs();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (rfqId, rfqTitle) => {
    if (window.confirm(`Are you sure you want to delete RFQ "${rfqTitle || rfqId}"? This will also delete associated items and responses.`)) {
      setError(null);
      try {
        await api.rfqs.delete(rfqId);
        setRfqs(prevRfqs => prevRfqs.filter(rfq => rfq.id !== rfqId));
      } catch (err) {
        console.error("Failed to delete RFQ:", err);
        setError(err.response?.data?.error || 'Failed to delete RFQ.');
      }
    }
  };

  const formatDate = (dateString) => {
     if (!dateString) return <span className="text-gray-400">N/A</span>; // Added subtle styling for N/A
     try {
       // Using original toLocaleDateString as requested
       return new Date(dateString).toLocaleDateString();
     } catch (e) {
       return <span className="text-red-500">Invalid Date</span>; // Added subtle styling for error
     }
  }
  // --- END OF LOGIC ---

  // --- UI Rendering (Redesigned with Tailwind) ---
  return (
    <div className="bg-gray-50 min-h-screen p-6 lg:p-10">

      {/* Header Section */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
          <FiFileText className="text-blue-600" />
          My RFQs (Requests for Quotation)
        </h1>
        
      </div>

      {/* Loading State */}
      {loading && (
         <div className="flex justify-center items-center py-16">
            <FiLoader className="animate-spin text-4xl text-blue-500 mr-3" />
            <span className="text-lg text-gray-600">Loading RFQs...</span>
         </div>
      )}

      {/* Error State */}
      {error && !loading && ( // Show error only if not loading
        <div className="mb-6 flex items-start gap-3 bg-red-100 border border-red-300 text-red-800 p-4 rounded-lg shadow-sm" role="alert">
          <FiAlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-md font-semibold">Error</h3>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Table Section - Shown when not loading and no critical error */}
      {!loading && ( // Render table structure even if fetch failed but loading is done
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200/80">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              {/* Table Header */}
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-base font-semibold text-gray-600 uppercase tracking-wider">Title</th>
                  <th scope="col" className="px-6 py-3 text-center text-base font-semibold text-gray-600 uppercase tracking-wider">Items</th>
                  <th scope="col" className="px-6 py-3 text-center text-base font-semibold text-gray-600 uppercase tracking-wider">Responses</th>
                  <th scope="col" className="px-6 py-3 text-left text-base font-semibold text-gray-600 uppercase tracking-wider">Due Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-base font-semibold text-gray-600 uppercase tracking-wider">Created</th>
                  <th scope="col" className="px-6 py-3 text-center text-base font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              {/* Table Body */}
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Show Empty State only if there's no error and rfqs array is empty */}
                {!error && rfqs.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-16 text-center text-base text-gray-500">
                       <FiInbox className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                       You haven't created any RFQs yet.
                    </td>
                  </tr>
                ) : (
                  // Map over rfqs if available (even if there was an error during delete, we might still have some rfqs)
                  rfqs.map(rfq => (
                    <tr key={rfq.id} className="hover:bg-blue-50/40 transition-colors duration-150 ease-in-out">
                      {/* Title */}
                      <td className="px-6 py-4 whitespace-nowrap text-lg font-medium text-gray-900">
                        <Link
                          to={`/admin/rfqs/${rfq.id}`} // Link remains same
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                          title={`View details for ${rfq.title || 'RFQ ' + rfq.id}`} // Tooltip
                        >
                          {rfq.title || `RFQ ${rfq.id}`}
                        </Link>
                      </td>
                      {/* Items Count */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        {rfq.items_count ?? 0}
                      </td>
                      {/* Responses Count */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        {rfq.responses_count ?? 0}
                      </td>
                      {/* Due Date */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(rfq.due_date)}
                      </td>
                      {/* Created Date */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(rfq.created_at)}
                      </td>
                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <div className="flex items-center justify-center gap-x-3">
                          {/* View/Edit Link */}
                          <Link
                            to={`/admin/rfqs/edit/${rfq.id}`} // Link remains same
                            className="text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out p-2 rounded-full hover:bg-blue-100/70"
                            title="View/Edit RFQ"
                          >
                            <FiEye size={20} />
                          </Link>
                          {/* Delete Button */}
                          <button
                            onClick={() => handleDelete(rfq.id, rfq.title)} // Handler remains same
                            className="text-red-500 hover:text-red-700 transition duration-150 ease-in-out p-2 rounded-full hover:bg-red-100/70"
                            title="Delete RFQ"
                          >
                            <FiTrash2 size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* Removed the <style jsx> block */}
    </div>
  );
};

export default RfqListPage;