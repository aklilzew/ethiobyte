import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../../api/api'; // Adjust path to your api.js file's default export

// Import Icons
import { FiPackage, FiPlus, FiEdit, FiArchive, FiLoader, FiAlertCircle, FiXCircle, FiSearch, FiDollarSign, FiHash, FiTag, FiCheckCircle, FiX, FiInfo } from 'react-icons/fi';
// Optional: Import Toast
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

const ProductListPage = () => {
  // --- LOGIC (Unchanged) ---
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.products.getAll();
      if (response.data.err) {
         setProducts([]);
      } else {
         setProducts(response.data);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError('Unauthorized. Please log in again.');
      } else {
        setError(err.response?.data?.error || 'Failed to fetch products.');
      }
       setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (productId) => {
    if (window.confirm(`Are you sure you want to archive product ID: ${productId}?`)) {
      setActionLoading(true);
      try {
        await api.products.delete(productId);
        alert('Product archived successfully!');
        await fetchProducts();
      } catch (err) {
        console.error(`Error archiving product ${productId}:`, err);
        alert(err.response?.data?.error || 'Failed to archive product.');
      } finally {
          setActionLoading(false);
      }
    }
  };

 const getStatusBadge = (status) => {
    const lowerStatus = status?.toLowerCase();
    switch (lowerStatus) {
      case 'active': return { icon: <FiCheckCircle className="mr-1.5" />, classes: 'bg-green-100 text-green-800' };
      case 'inactive': return { icon: <FiX className="mr-1.5" />, classes: 'bg-yellow-100 text-yellow-800' };
      case 'archived': return { icon: <FiArchive className="mr-1.5" />, classes: 'bg-red-100 text-red-800' };
      default: return { icon: <FiInfo className="mr-1.5" />, classes: 'bg-gray-100 text-gray-700' };
    }
  };

  const formatPrice = (price) => {
      const priceNum = Number(price);
      if (!isNaN(priceNum)) {
        return `$${priceNum.toFixed(2)}`;
      }
      return <span className="text-gray-400 italic">$ N/A</span>;
  };
  // --- END OF LOGIC ---


  // --- UI Rendering (Redesigned with Text Labels for Actions) ---

  // Loading State (Initial Fetch)
  if (loading && products.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-10rem)] text-center p-10 bg-gray-50">
        <FiLoader className="animate-spin text-5xl text-blue-500 mb-4" />
        <p className="text-xl text-gray-600">Loading products...</p>
      </div>
    );
  }

  // --- Main Content Display ---
  return (
    <div className="bg-gray-50 min-h-screen p-6 lg:p-10">
      {/* Optional: Toast Container */}
      {/* <ToastContainer /> */}

      {/* Header Section */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
          <FiPackage className="text-blue-600" />
          Product Management
        </h1>
        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-lg font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
          title="Create a new product"
        >
          <FiPlus size={18} />
          Add New Product
        </Link>
      </div>

      {/* Error State Display */}
      {error && (
        <div className="mb-6 flex items-start gap-3 bg-red-100 border border-red-300 text-red-800 p-4 rounded-lg shadow-sm" role="alert">
          <FiAlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-md font-semibold">Error</h3>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Table Section */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200/80">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            {/* Table Header */}
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-1"><FiHash size={12}/>ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">SKU</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-1"><FiDollarSign size={12}/>Price</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Stock</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            {/* Table Body */}
            <tbody className="bg-white divide-y divide-gray-200">
              {!loading && products.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-16 text-center text-base text-gray-500">
                     <FiPackage className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                     No products found.
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                   const statusInfo = getStatusBadge(product.status);
                   return (
                    <tr key={product.id} className="hover:bg-blue-50/40 transition-colors duration-150 ease-in-out">
                      <td className="px-6 py-4 whitespace-nowrap text-lg font-medium text-gray-500">{product.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-lg font-semibold text-gray-800">{product.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-500 font-mono">{product.sku || <span className="text-gray-400">N/A</span>}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-700">{formatPrice(product.price)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-500">{product.stock_quantity ?? <span className="text-gray-400">N/A</span>}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-lg">
                        <span
                           className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-lg font-medium capitalize ${statusInfo.classes}`}
                           title={`Status: ${product.status || 'unknown'}`}
                        >
                           {statusInfo.icon}
                           {product.status || 'unknown'}
                        </span>
                      </td>
                      {/* Actions with Text Labels */}
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <div className="flex items-center justify-center gap-x-4"> {/* Increased gap slightly */}
                          {/* Edit Button with Text */}
                          <Link
                            to={`/admin/products/edit/${product.id}`}
                            // Adjusted styling for icon + text button look
                            className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-900 transition duration-150 ease-in-out px-2 py-1 rounded hover:bg-indigo-100/70 text-lg"
                            title="Edit this product"
                          >
                            <FiEdit size={14} /> {/* Slightly smaller icon */}
                            <span>Edit</span>
                          </Link>
                          {/* Archive Button with Text - Conditionally Rendered */}
                          {product.status !== 'archived' && (
                            <button
                              onClick={() => handleDelete(product.id)}
                              disabled={actionLoading}
                               // Adjusted styling for icon + text button look
                              className={`inline-flex items-center gap-1.5 text-red-600 hover:text-red-900 transition duration-150 ease-in-out px-2 py-1 rounded hover:bg-red-100/70 text-lg ${actionLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                              title="Archive this product"
                            >
                              {actionLoading ? (
                                <>
                                  <FiLoader className="animate-spin" size={14}/>
                                  <span>Archiving...</span>
                                </>
                               ) : (
                                <>
                                  <FiArchive size={14} /> {/* Slightly smaller icon */}
                                  <span>Archive</span>
                                </>
                               )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                   );
                })
              )}
            </tbody>
          </table>
        </div>
      </div> {/* End Table Card Wrapper */}

    </div> // End Base Background
  );
};

export default ProductListPage;