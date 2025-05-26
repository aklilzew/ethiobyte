// src/pages/Logout.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function LogoutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Perform logout operations
    const performLogout = () => {
      try {
        // Clear all items from localStorage
        
        // Alternatively, if you want to remove specific items:
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('role');
        
        // Redirect to login page after a brief delay for visual feedback
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } catch (error) {
        console.error('Logout error:', error);
        // Still redirect even if there was an error clearing storage
        navigate('/login');
      }
    };

    performLogout();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-100">
      <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md w-full mx-4">
        <h1 className="text-3xl font-bold text-indigo-700 mb-4">Logging Out</h1>
        <p className="text-lg text-gray-600">You are being securely logged out...</p>
        <div className="mt-6">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-indigo-600 h-2.5 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LogoutPage;