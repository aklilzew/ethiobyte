import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../../api/api';

// Import Icons
import { FiFileText, FiPlus, FiEdit, FiTrash2, FiLoader, FiAlertCircle, FiUser, FiClock, FiCheckCircle, FiXCircle, FiInbox } from 'react-icons/fi';

const PostListPage = () => {
  // --- LOGIC (Unchanged) ---
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Kept, might be useful later

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      // !!! Backend Note: Ensure this endpoint returns ALL posts (including drafts) for admin view !!!
      const response = await api.posts.getAll();
      setPosts(response.data);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
      setError(err.response?.data?.error || 'Failed to fetch posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (postId, postTitle) => {
    if (window.confirm(`Are you sure you want to delete the post "${postTitle}"?`)) {
      setError(null);
      try {
        await api.posts.delete(postId);
        setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
        // Optionally add success feedback (e.g., toast notification)
      } catch (err) {
        console.error("Failed to delete post:", err);
        setError(err.response?.data?.error || 'Failed to delete post.');
        // Optionally add error feedback (e.g., toast notification)
      }
    }
  };

  // Helper function for status badge styling
  const getStatusBadge = (status) => {
     const lowerStatus = status?.toLowerCase();
     switch (lowerStatus) {
       case 'published': return { icon: <FiCheckCircle className="mr-1" />, classes: 'bg-green-100 text-green-800' };
       case 'draft': return { icon: <FiEdit className="mr-1" />, classes: 'bg-yellow-100 text-yellow-800' }; // Assuming 'draft' status
       default: return { icon: <FiXCircle className="mr-1" />, classes: 'bg-gray-100 text-gray-700' };
     }
   };

   // Helper function for date formatting (keeping original logic)
   const formatDate = (dateString) => {
    if (!dateString) return <span className="text-gray-400">N/A</span>;
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return <span className="text-red-500">Invalid Date</span>;
    }
  }
  // --- END OF LOGIC ---


  // --- UI Rendering (Redesigned with Tailwind, maintaining text-sm) ---

  // Loading State
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-10rem)] text-center p-10 bg-gray-50">
        <FiLoader className="animate-spin text-5xl text-blue-500 mb-4" />
        <p className="text-xl text-gray-600">Loading posts...</p>
      </div>
    );
  }

  // --- Main Content Display ---
  return (
    <div className="bg-gray-50 min-h-screen p-6 lg:p-10">

      {/* Header Section */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
          <FiFileText className="text-blue-600" />
          Manage Posts
        </h1>
        <Link
          to="/admin/posts/new" // Route remains the same
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-lg font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
          title="Create a new post"
        >
          <FiPlus size={18} />
          Create New Post
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
                <th scope="col" className="px-6 py-3 text-left text-lg font-semibold text-gray-600 uppercase tracking-wider">Title</th>
                <th scope="col" className="px-6 py-3 text-left text-lg font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-1"><FiUser size={12}/>Author</th>
                <th scope="col" className="px-6 py-3 text-left text-lg font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-lg font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-1"><FiClock size={12}/>Created At</th>
                <th scope="col" className="px-6 py-3 text-center text-lg font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            {/* Table Body */}
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Show Empty State only if not loading and no error */}
              {!error && posts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center text-base text-gray-500">
                     <FiInbox className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                     No posts found.
                  </td>
                </tr>
              ) : (
                posts.map(post => {
                   const statusInfo = getStatusBadge(post.status);
                   return (
                    <tr key={post.id} className="hover:bg-blue-50/40 transition-colors duration-150 ease-in-out">
                      {/* Title - Maintain text-sm */}
                      <td className="px-6 py-4 whitespace-nowrap text-lg font-medium text-gray-900">
                        <Link
                          to={`/admin/posts/view/${post.slug}`} // Link remains same
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                          title={`View post: ${post.title}`}
                        >
                          {post.title}
                        </Link>
                      </td>
                      {/* Author - Maintain text-sm */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {post.author || <span className="text-gray-400 italic">Unknown</span>}
                      </td>
                      {/* Status - Maintain text-sm (badge uses text-lg internally) */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                           className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-lg font-medium capitalize ${statusInfo.classes}`}
                           title={`Status: ${post.status || 'unknown'}`}
                        >
                           {statusInfo.icon}
                           {post.status || 'unknown'}
                        </span>
                      </td>
                      {/* Created At - Maintain text-sm */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(post.created_at)}
                      </td>
                      {/* Actions - Maintain text-sm for the cell, actions use text-lg */}
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                        <div className="flex items-center justify-center gap-x-4">
                          {/* Edit Button with Text */}
                          <Link
                            to={`/admin/posts/edit/${post.id}`} // Link remains same
                            className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-900 transition duration-150 ease-in-out px-2 py-1 rounded hover:bg-indigo-100/70 text-lg" // text-lg for button
                            title="Edit this post"
                          >
                            <FiEdit size={14} />
                            <span>Edit</span>
                          </Link>
                          {/* Delete Button with Text */}
                          <button
                            onClick={() => handleDelete(post.id, post.title)} // Handler remains same
                            className="inline-flex items-center gap-1.5 text-red-600 hover:text-red-900 transition duration-150 ease-in-out px-2 py-1 rounded hover:bg-red-100/70 text-lg" // text-lg for button
                            title="Delete this post"
                          >
                            <FiTrash2 size={14} />
                            <span>Delete</span>
                          </button>
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
      {/* Removed the <style jsx> block */}
    </div> // End Base Background
  );
};

export default PostListPage;