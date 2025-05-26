import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/api'; // Adjust path to your API config

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    // Basic frontend validation first
    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill out all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true); // Start loading only after basic validation passes

    try {
      // Note: No token/userId is typically returned on registration in secure systems.
      // Usually, you just get a success message and redirect to login.
      // Adjust based on your actual API response.
      await api.auth.register({ username, email, password });

      setSuccessMessage('Registration successful! Redirecting to login...');
      setLoading(false);
      setTimeout(() => navigate('/login'), 2000); // Redirect after showing success message
    } catch (err) {
      const message = err.response?.data?.error || 'Registration failed. Please try again.';
      setError(message);
      setLoading(false);
    }
  };

  return (
    // Consistent outer container style
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-100 px-4 mt-10">
      {/* Consistent content box style: width, padding, shadow, rounding */}
      <div className="w-full max-w-xl bg-white shadow-2xl rounded-3xl p-10">
        {/* Consistent heading style */}
        <h1 className="text-4xl font-bold text-center text-indigo-700 mb-4">Create Account</h1>
        {/* Consistent subtitle style */}
        <p className="text-lg text-center text-gray-600 mb-6">Join us! Fill out the form below.</p>

        {/* Consistent error message style */}
        {error && (
          <div className="mb-5 p-4 text-lg text-red-700 bg-red-100 border border-red-300 rounded-lg text-center">
            {error}
          </div>
        )}
        {/* Consistent success message style (adapted for green) */}
        {successMessage && (
          <div className="mb-5 p-4 text-lg text-green-700 bg-green-100 border border-green-300 rounded-lg text-center">
            {successMessage}
          </div>
        )}

        {/* Consistent form spacing */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Consistent label and input styles */}
          <div>
            <label htmlFor="username" className="block text-lg font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-5 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Choose a username"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-lg font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Create a password (min. 6 chars)"
              required
            />
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-lg font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-5 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Confirm your password"
              required
            />
          </div>

          {/* Consistent button style */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-lg font-semibold text-white rounded-xl transition duration-200 ${
              loading ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        {/* Consistent bottom link style */}
        <p className="mt-6 text-center text-lg text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 font-bold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;