import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API from '../../../api/api'; // Your API object
import { format } from 'date-fns';
// Import icons
import { FiUserPlus, FiEye, FiTrash2, FiLoader, FiAlertCircle, FiCheckCircle, FiXCircle, FiUsers, FiSearch } from 'react-icons/fi';

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  // const [searchTerm, setSearchTerm] = useState(''); // Optional search state

  // --- Toast Configurations (same as before) ---
  const toastConfig = {
    position: "bottom-right", autoClose: 4000, hideProgressBar: false, closeOnClick: true,
    pauseOnHover: true, draggable: true, progress: undefined, theme: "light",
  };
  const notifySuccess = (message) => toast.success( <div className="flex items-center"><FiCheckCircle className="text-green-500 mr-3" size={20} /><span>{message}</span></div>, { ...toastConfig, toastId: message });
  const notifyError = (message, toastId = 'error-toast') => toast.error( <div className="flex items-center"><FiXCircle className="text-red-500 mr-3" size={20} /><span>{message}</span></div>, { ...toastConfig, toastId: toastId });

  // --- Fetch Users (same as before) ---
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true); setError('');
      try {
        const response = await API.users.getAll();
        setUsers(response.data);
      } catch (err) {
        console.error("Error fetching users:", err);
        const status = err.response?.status;
        const errMsg = err.response?.data?.error || 'An unexpected error occurred.';
        if (status === 401 || status === 403) {
          const authErrorMsg = 'Unauthorized access. Please log in again.';
          setError(authErrorMsg); notifyError(authErrorMsg, 'auth-error');
        } else {
          notifyError(`Failed to fetch users: ${errMsg}`, 'fetch-error');
        }
        setUsers([]);
      } finally { setLoading(false); }
    };
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]); // Add searchTerm if using search

  // --- Delete User (same logic) ---
  const handleDeleteUser = async (userId, username) => {
    const confirmDelete = window.confirm(`Are you sure you want to permanently delete the user "${username}"?`);
    if (!confirmDelete) return;
    try {
      await API.users.delete(userId);
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      notifySuccess(`User "${username}" deleted successfully.`);
    } catch (err) {
      console.error("Error deleting user:", err);
      const errMsg = err.response?.data?.error || 'Failed to delete user.';
      notifyError(`Error deleting "${username}": ${errMsg}`, `delete-error-${userId}`);
    }
  };

  // --- Render Logic ---

  // Loading State
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-10rem)] text-center p-10">
        <FiLoader className="animate-spin text-5xl text-blue-500 mb-4" />
        <p className="text-xl text-gray-600">Loading Users...</p>
      </div>
    );
  }

  // --- MODERN TABLE LAYOUT ---
  return (
    <div className="bg-gray-50 min-h-screen p-6 lg:p-10"> {/* Increased page padding */}
      <ToastContainer />

      {/* Header Section */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
          <FiUsers className="text-blue-600" />
          User Management
        </h1>
        {/* Optional: Search/Add Buttons here */}
      </div>

      {/* Persistent Error Display Area */}
      {error && (
        <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 p-4 rounded-lg shadow-sm" role="alert">
          <FiAlertCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-md font-semibold text-red-800">Access Issue</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Table Section - Enhanced Styling */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200/80"> {/* Softer border, larger radius */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            {/* Table Header */}
            <thead className="bg-gray-50"> {/* Optional: bg-white for ultra-minimal */}
              <tr>
                {/* Increased padding, slightly bolder text */}
                <th scope="col" className="px-6 py-4 text-left text-lg font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                <th scope="col" className="px-6 py-4 text-left text-lg font-semibold text-gray-600 uppercase tracking-wider">Username</th>
                <th scope="col" className="px-6 py-4 text-left text-lg font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-4 text-left text-lg font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                <th scope="col" className="px-6 py-4 text-left text-lg font-semibold text-gray-600 uppercase tracking-wider">Joined</th>
                <th scope="col" className="px-6 py-4 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            {/* Table Body */}
            <tbody className="bg-white divide-y divide-gray-200">
              {users.length === 0 && !error ? (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center text-base text-gray-500"> {/* Increased padding */}
                    No user accounts found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  // Enhanced hover effect
                  <tr key={user.id} className="hover:bg-blue-50/40 transition-colors duration-150 ease-in-out">
                    {/* Increased padding, adjusted text styles */}
                    <td className="px-6 py-5 whitespace-nowrap text-lg font-medium text-gray-500">{user.id}</td>
                    <td className="px-6 py-5 whitespace-nowrap text-lg font-semibold text-gray-800">{user.username}</td>
                    <td className="px-6 py-5 whitespace-nowrap text-lg text-gray-600">{user.email}</td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full capitalize ${ // Bolder badge text
                        user.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                        user.role === 'superAdmin' ? 'bg-red-100 text-red-800' :
                        user.role === 'supplier' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {user.role?.replace(/([A-Z])/g, ' $1').trim() || 'User'}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text- text-gray-500">
                      {user.created_at ? format(new Date(user.created_at), 'PP') : 'N/A'} {/* PP format: Oct 19, 2023 */}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-center text-sm font-medium">
                      {/* Larger icons and click area */}
                      <div className="flex items-center justify-center gap-x-3"> {/* Slightly reduced gap */}
                        <Link
                          to={`/admin/users/${user.id}`}
                          className="text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out p-2 rounded-full hover:bg-blue-100/70" // Larger padding, rounded hover
                          title="View Details"
                        >
                          <FiEye size={22} /> {/* Larger icon */}
                        </Link>
                        <button
                          onClick={() => handleDeleteUser(user.id, user.username)}
                          className="text-red-500 hover:text-red-700 transition duration-150 ease-in-out p-2 rounded-full hover:bg-red-100/70" // Larger padding, rounded hover
                          title="Delete User"
                        >
                          <FiTrash2 size={22} /> {/* Larger icon */}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div> {/* End Table Card Wrapper */}

    </div> // End Base Background
  );
};

export default UserListPage;