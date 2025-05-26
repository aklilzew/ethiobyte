import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../../api/api'; // Adjust path as needed

const ProductCreatePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    sku: '',
    stock_quantity: '',
    image_url: '', // Assuming a simple URL for now
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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
      // Prepare data, converting types if necessary
      const productData = {
         ...formData,
         price: parseFloat(formData.price) || 0,
         stock_quantity: parseInt(formData.stock_quantity, 10) || 0,
      };

      // Use the structured api call
      const response = await api.products.create(productData);

      setSuccessMessage(response.data.message || 'Product created successfully!');
      alert('Product created successfully!'); // Simple feedback

      // Clear form or redirect
      // setFormData({ name: '', description: '', price: '', sku: '', stock_quantity: '', image_url: '' });
      navigate(`/admin/products/edit/${response.data.productId}`); // Redirect to edit page of new product

    } catch (err) {
      console.error("Error creating product:", err);
      setError(err.response?.data?.error || 'Failed to create product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
       <div className="mb-6">
        <Link to="/admin/products" className="text-blue-600 hover:underline">
          ← Back to Product List
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Create New Product</h1>

      {error && (
        <div className="mb-4 p-3 text-red-800 bg-red-100 border border-red-300 rounded">
          {error}
        </div>
      )}
       {successMessage && (
        <div className="mb-4 p-3 text-green-800 bg-green-100 border border-green-300 rounded">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-4">
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
                step="0.01" // Allows cents
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="stock_quantity" className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
              <input
                type="number"
                id="stock_quantity"
                name="stock_quantity"
                min="0"
                step="1" // Whole numbers for stock
                value={formData.stock_quantity}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input
                type="text" // Change to file input later if needed
                id="image_url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductCreatePage;