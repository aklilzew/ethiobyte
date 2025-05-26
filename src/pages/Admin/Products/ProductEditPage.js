import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../../api/api'; // Adjust path as needed

const ProductEditPage = () => {
  const { productId } = useParams(); // Get ID from URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    sku: '',
    stock_quantity: '',
    image_url: '',
    status: 'active', // Default status or fetch from product
  });
  const [loading, setLoading] = useState(true); // Start loading true for initial fetch
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Available product statuses
  const productStatuses = ['active', 'inactive', 'archived'];

  // Fetch existing product data
  const fetchProduct = useCallback(async () => {
    setLoading(true);
    setError('');
    setSuccessMessage(''); // Clear messages on fetch
    try {
      const response = await api.products.getById(productId);
      const product = response.data;
      // Populate form state - handle potential null/undefined values
      setFormData({
         name: product.name || '',
         description: product.description || '',
         price: product.price?.toString() || '', // Convert to string for input value
         sku: product.sku || '',
         stock_quantity: product.stock_quantity?.toString() || '', // Convert to string
         image_url: product.image_url || '',
         status: product.status || 'active', // Default to active if status is missing
      });
    } catch (err) {
      console.error(`Error fetching product ${productId}:`, err);
      if (err.response?.status === 404) {
         setError('Product not found.');
      } else if (err.response?.status === 401 || err.response?.status === 403) {
         setError('Unauthorized to view this product. Redirecting...');
         setTimeout(() => navigate('/login'), 3000);
      } else {
         setError(err.response?.data?.error || 'Failed to load product details.');
      }
    } finally {
      setLoading(false);
    }
  }, [productId, navigate]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]); // Depend on the stable fetchProduct function

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    // Basic Validation
    if (!formData.name || !formData.price || !formData.sku) {
        setError('Name, Price, and SKU are required.');
        setLoading(false);
        return;
    }

    try {
       // Prepare data for update, converting types
      const updateData = {
         name: formData.name,
         description: formData.description,
         price: parseFloat(formData.price) || null, // Send null if invalid? Or 0? Backend uses COALESCE
         sku: formData.sku,
         stock_quantity: parseInt(formData.stock_quantity, 10), // Allow NaN/null if empty? Backend COALESCE handles it
         image_url: formData.image_url || null, // Send null if empty
         status: formData.status,
      };
       // Remove NaN stock_quantity if desired
       if (isNaN(updateData.stock_quantity)) {
           updateData.stock_quantity = null; // Backend COALESCE will keep original value
       }


      // Use the structured api call for update
      const response = await api.products.update(productId, updateData);

      setSuccessMessage(response.data.message || 'Product updated successfully!');
      alert('Product updated successfully!'); // Simple feedback

      // Optionally refetch to confirm changes immediately or rely on message
      // fetchProduct();
      // Or navigate back to list
      // navigate('/admin/products');

    } catch (err) {
      console.error(`Error updating product ${productId}:`, err);
      setError(err.response?.data?.error || 'Failed to update product.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.name) { // Show loading indicator on initial fetch
    return <div className="p-4 text-center">Loading product details...</div>;
  }

  if (error && !formData.name) { // Show error prominently if product couldn't be loaded
    return (
        <div className="container mx-auto px-4 py-8 text-center">
            <p className="text-red-600 bg-red-100 border border-red-300 p-4 rounded mb-4">{error}</p>
            <Link to="/admin/products" className="text-blue-600 hover:underline">
                ← Back to Product List
            </Link>
        </div>
    );
  }


  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <Link to="/admin/products" className="text-blue-600 hover:underline">
          ← Back to Product List
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Edit Product - {formData.name || `ID: ${productId}`}</h1>

      {/* Display errors specific to the update action */}
       {error && formData.name && (
        <div className="mb-4 p-3 text-red-800 bg-red-100 border border-red-300 rounded">
          Update Error: {error}
        </div>
      )}
      {successMessage && (
        <div className="mb-4 p-3 text-green-800 bg-green-100 border border-green-300 rounded">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-4">
         {/* Re-use form fields from Create Page, slightly adapted */}
         <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Product Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            id="description"
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price <span className="text-red-500">*</span></label>
              <input
                type="number"
                id="price"
                name="price"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
             <div>
              <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-1">SKU <span className="text-red-500">*</span></label>
              <input
                type="text"
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
         </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="stock_quantity" className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
              <input
                type="number"
                id="stock_quantity"
                name="stock_quantity"
                min="0"
                step="1"
                value={formData.stock_quantity}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input
                type="text"
                id="image_url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
             <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
               <select
                 id="status"
                 name="status"
                 value={formData.status}
                 onChange={handleChange}
                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white"
               >
                 {productStatuses.map(status => (
                   <option key={status} value={status}>
                     {status.charAt(0).toUpperCase() + status.slice(1)} {/* Capitalize */}
                   </option>
                 ))}
               </select>
            </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductEditPage;