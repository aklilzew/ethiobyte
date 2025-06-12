import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../api/api";

const CreateAdminPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!formData.username || !formData.email || !formData.password) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.users.createAdmin(formData);
      setSuccess(response.data.message || "Admin user created successfully!");
      setFormData({ username: "", email: "", password: "" });
    } catch (err) {
      console.error("Error creating admin user:", err);
      setError(err.response?.data?.error || "Failed to create admin user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-create-admin-page p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6 border-b border-gray-300 pb-2">
        <h1 className="text-2xl font-semibold text-gray-800 transition-colors duration-300 hover:text-purple-600 cursor-default">
          Create New Admin User
        </h1>
        <Link
          to="/admin/users"
          className="text-purple-600 hover:text-purple-800 hover:underline text-sm font-medium transition-colors duration-300"
        >
          ← Back to User List
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 border border-red-300 rounded-md shadow-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 text-sm text-green-700 bg-green-100 border border-green-300 rounded-md shadow-sm">
          {success}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg px-6 py-8 max-w-lg mx-auto"
      >
        <div className="mb-5">
          <label
            className="block text-gray-700 text-sm font-bold mb-2 transition-colors duration-300 hover:text-purple-600 cursor-pointer"
            htmlFor="username"
          >
            Username <span className="text-red-500">*</span>
          </label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Enter a unique username"
            value={formData.username}
            onChange={handleChange}
            required
            className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300 hover:shadow-lg hover:border-purple-600"
          />
        </div>

        <div className="mb-5">
          <label
            className="block text-gray-700 text-sm font-bold mb-2 transition-colors duration-300 hover:text-purple-600 cursor-pointer"
            htmlFor="email"
          >
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter admin's email"
            value={formData.email}
            onChange={handleChange}
            required
            className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300 hover:shadow-lg hover:border-purple-600"
          />
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2 transition-colors duration-300 hover:text-purple-600 cursor-pointer"
            htmlFor="password"
          >
            Password <span className="text-red-500">*</span>
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Create a strong password"
            value={formData.password}
            onChange={handleChange}
            required
            className="shadow-sm appearance-none border rounded w-full py-2 px-3 mb-2 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300 hover:shadow-lg hover:border-purple-600"
          />
          <p className="text-xs text-gray-500">
            Set an initial password for the admin.
          </p>
        </div>

        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out shadow-md hover:shadow-lg ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Creating..." : "Create Admin User"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAdminPage;
