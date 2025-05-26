// src/pages/Login.js (or wherever LoginPage is defined)
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/api'; // Adjust path as needed

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill out all fields.');
      setLoading(false);
      return;
    }

    try {
      const response = await api.auth.login({ email, password });
      const { token, userId, role } = response.data; // Expect role from backend

      if (!token || !userId || !role) {
         console.error("Login response missing token, userId, or role:", response.data);
         setError("Login failed: Incomplete user data received.");
         setLoading(false);
         return;
      }

      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('role', role); // Store the role

      // --- UPDATED: Conditional Navigation Based on Role ---
      const userRole = role.toLowerCase();
      if (userRole === 'admin' || userRole === 'superadmin') {
        navigate('/admin'); // Redirect BOTH admin and superAdmin here
      } else {
        // Assuming 'user' role goes to user dashboard
        navigate('/userdashboard');
      }
      // Don't setLoading(false) on success because navigation happens

    } catch (err) {
      const message = err.response?.data?.error || 'Login failed. Please check credentials.';
      setError(message);
      setLoading(false);
    }
  };

  // --- JSX remains the same ---
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-100 px-4">
      <div className="w-full max-w-xl bg-white shadow-2xl rounded-3xl p-10">
        <h1 className="text-4xl font-bold text-center text-indigo-700 mb-4">Login</h1>
        <p className="text-lg text-center text-gray-600 mb-6">Welcome back! Please login to your account.</p>

        {error && (
          <div className="mb-5 p-4 text-lg text-red-700 bg-red-100 border border-red-300 rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Enter your email" required
            />
          </div>
          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-lg font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Enter your password" required
            />
          </div>
          {/* Submit Button */}
          <button
            type="submit" disabled={loading}
            className={`w-full py-3 text-lg font-semibold text-white rounded-xl transition duration-200 ${loading ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        {/* Link to Register */}
        <p className="mt-6 text-center text-lg text-gray-600">
          Don’t have an account?{' '}
          <Link to="/register" className="text-indigo-600 font-bold hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;