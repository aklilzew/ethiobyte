import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../../../api/api';
import { format } from 'date-fns'; // For formatting dates

const UserDetailPage = () => {
  const { userId } = useParams(); // Get userId from the URL parameter
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditingRole, setIsEditingRole] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [updateStatus, setUpdateStatus] = useState({ message: '', error: '' });

  // Define valid roles (as per your backend controller)
  const validRoles = ['user', 'admin', 'superAdmin','supplier'];

  // Fetch user data
  const fetchUser = useCallback(async () => {
    setLoading(true);
    setError('');
    setUpdateStatus({ message: '', error: '' }); // Clear status on refetch
    try {
      // Directly use API object
      const response = await API.users.getById(userId); // <-- Pass the userId here
      setUser(response.data);
      setSelectedRole(response.data.role); // Initialize selected role
    } catch (err) {
      console.error(`Error fetching user ${userId}:`, err);
      if (err.response?.status === 404) {
        setError('User not found.');
      } else if (err.response?.status === 401 || err.response?.status === 403) {
        setError('You are not authorized to view this user. Redirecting...');
        setTimeout(() => navigate('/login'), 3000);
      }
      else {
        setError(err.response?.data?.error || 'Failed to fetch user details.');
      }
      setUser(null); // Clear user data on error
    } finally {
      setLoading(false);
    }
  }, [userId, navigate]); // Dependency array includes userId and navigate

  useEffect(() => {
    fetchUser();
  }, [fetchUser]); // fetchUser is now stable due to useCallback

  // Handle role update
  const handleRoleUpdate = async (e) => {
    e.preventDefault(); // Prevent default form submission if wrapped in a form
    setUpdateStatus({ message: '', error: '' });
    if (!selectedRole || !validRoles.includes(selectedRole)) {
        setUpdateStatus({ error: 'Please select a valid role.', message: '' });
        return;
    }

    // Check permissions based on localStorage (assuming superAdmin can change roles)
    const currentUserRole = localStorage.getItem('role');
    if (currentUserRole?.toLowerCase() !== 'superadmin') {
        setUpdateStatus({ error: 'Permission denied. Only Super Admins can change roles.', message: '' });
        return;
    }

    setLoading(true); // Indicate loading state during update
    try {
        // Directly use API object
        await API.put(`/users/${userId}/role`, { role: selectedRole }); // Corresponds to updateUserRole
        setUpdateStatus({ message: 'User role updated successfully!', error: '' });
        setIsEditingRole(false); // Exit editing mode
        // Optionally refetch user data to confirm change
        fetchUser();
    } catch (err) {
        console.error("Error updating user role:", err);
        setUpdateStatus({ error: err.response?.data?.error || 'Failed to update role.', message: '' });
    } finally {
        setLoading(false); // End loading state
    }
  };

  // --- Placeholder for Delete Functionality ---
  // const handleDeleteUser = async () => {
  //   if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
  //     setLoading(true);
  //     try {
  //       // Need backend endpoint DELETE /api/users/:id
  //       // await API.delete(`/users/${userId}`);
  //       alert('User deleted successfully.');
  //       navigate('/admin/users'); // Redirect to list after deletion
  //     } catch (err) {
  //       console.error("Error deleting user:", err);
  //       alert(err.response?.data?.error || 'Failed to delete user.');
  //       setLoading(false);
  //     }
  //   }
  // };
  // --- End Placeholder ---


  if (loading && !user) { // Show loading only on initial load
    return <div className="p-4 text-center">Loading user details...</div>;
  }

  if (error) {
    return (
        <div className="container mx-auto px-4 py-8 text-center">
            <p className="text-red-600 bg-red-100 border border-red-300 p-4 rounded mb-4">{error}</p>
            <Link to="/admin/users" className="text-blue-600 hover:underline">
                ← Back to User List
            </Link>
        </div>
    );
  }

  if (!user) {
      // This case might occur if fetch fails but error isn't set properly, or after deletion redirect fails
       return <div className="p-4 text-center">User data could not be loaded.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/admin/users" className="text-blue-600 hover:underline">
          ← Back to User List
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6 text-gray-800">User Details - {user.username}</h1>

      {/* Status Messages */}
      {updateStatus.message && (
        <div className="mb-4 p-3 text-green-800 bg-green-100 border border-green-300 rounded">
          {updateStatus.message}
        </div>
      )}
      {updateStatus.error && (
        <div className="mb-4 p-3 text-red-800 bg-red-100 border border-red-300 rounded">
          {updateStatus.error}
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div><strong className="text-gray-600">ID:</strong> {user.id}</div>
          <div><strong className="text-gray-600">Username:</strong> {user.username}</div>
          <div><strong className="text-gray-600">Email:</strong> {user.email}</div>
          <div>
            <strong className="text-gray-600 mr-2">Role:</strong>
            {!isEditingRole ? (
              <>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold mr-2 ${
                   user.role === 'admin' ? 'bg-blue-200 text-blue-800' :
                   user.role === 'superAdmin' ? 'bg-red-200 text-red-800' :
                   'bg-green-200 text-green-800'
                }`}>
                  {user.role}
                </span>
                {/* Only show edit button if the current logged-in user is superAdmin */}
                {localStorage.getItem('role')?.toLowerCase() === 'superadmin' && (
                    <button
                      onClick={() => setIsEditingRole(true)}
                      className="text-blue-500 hover:text-blue-700 text-xs font-medium"
                      disabled={loading} // Disable button during any loading state
                      title="Edit Role (SuperAdmin only)"
                    >
                      (Edit)
                    </button>
                )}
              </>
            ) : (
              <form onSubmit={handleRoleUpdate} className="inline-flex items-center gap-2">
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="p-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  disabled={loading}
                >
                  {validRoles.map(roleOption => (
                    <option key={roleOption} value={roleOption}>
                      {roleOption}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-700 text-white text-xs font-bold py-1 px-2 rounded disabled:opacity-50"
                  disabled={loading || selectedRole === user.role}
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => { setIsEditingRole(false); setSelectedRole(user.role); setUpdateStatus({ message: '', error: '' }); }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 text-xs font-bold py-1 px-2 rounded disabled:opacity-50"
                   disabled={loading}
                >
                  Cancel
                </button>
              </form>
            )}
          </div>
          <div>
            <strong className="text-gray-600">Joined:</strong>
            {user.created_at ? format(new Date(user.created_at), 'MMMM d, yyyy h:mm a') : 'N/A'}
          </div>
        </div>

        {/* Placeholder for other user details if available (e.g., profile) */}
        {/* <div className="mt-4 pt-4 border-t">
            <h2 className="text-xl font-semibold mb-2 text-gray-700">Profile Information</h2>
             Fetch and display profile details if available
        </div> */}

        {/* Placeholder for Delete Button */}
        {/* <div className="mt-6 pt-4 border-t border-gray-200 text-right">
            <button
               onClick={handleDeleteUser}
               className="bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
               disabled={loading} // Disable while any loading operation is in progress
               title="Delete this user (requires backend implementation)"
            >
               Delete User Account
            </button>
        </div> */}
      </div>
    </div>
  );
};

export default UserDetailPage;