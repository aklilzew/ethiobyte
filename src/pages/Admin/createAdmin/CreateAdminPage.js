// src/pages/admin/CreateAdminPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Make sure the path to your api service is correct
import api from '../../../api/api';
const CreateAdminPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate(); // Use navigate if needed after creation

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!formData.username || !formData.email || !formData.password) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }
    // Add password validation if needed (e.g., length)
    // if (formData.password.length < 8) { ... }

    try {
      // Use the API service function
      const response = await api.users.createAdmin(formData);
      setSuccess(response.data.message || 'Admin user created successfully!');
      setFormData({ username: '', email: '', password: '' }); // Clear form
      // Optionally navigate away after success
      // setTimeout(() => navigate('/admin/users'), 1500);
    } catch (err) {
      console.error("Error creating admin user:", err);
      setError(err.response?.data?.error || 'Failed to create admin user.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-create-admin-page p-4 md:p-6">
      <div className="flex justify-between items-center mb-6 border-b pb-2">
        <h1 className="text-2xl font-semibold text-gray-800">Create New Admin User</h1>
        {/* Link back to the user list page */}
        <Link to="/admin/users" className="text-purple-600 hover:text-purple-800 hover:underline text-sm font-medium">
          ← Back to User List
        </Link>
      </div>

      {error && <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 border border-red-300 rounded-md">{error}</div>}
      {success && <div className="mb-4 p-3 text-sm text-green-700 bg-green-100 border border-green-300 rounded-md">{success}</div>}

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg px-6 py-8">
        <div className="mb-5">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
            Username <span className="text-red-500">*</span>
          </label>
          <input
            className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            id="username"
            type="text"
            placeholder="Enter a unique username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-5">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            id="email"
            type="email"
            placeholder="Enter admin's email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            id="password"
            type="password"
            placeholder="Create a strong password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            // Add minLength if desired
          />
           <p className="text-xs text-gray-500">Set an initial password for the admin.</p>
        </div>
        <div className="flex items-center justify-end">
          <button
            className={`bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            type="submit"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Admin User'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAdminPage;