import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns'; // For date formatting
import api from '../../../api/api'; // Adjust path if needed
import {
    FiPlus, FiLoader, FiAlertCircle, FiFileText, FiUser, FiCalendar, FiExternalLink, FiInbox
} from 'react-icons/fi'; // Import icons

// --- Main PostList Component ---
const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Basic check if a token exists (improve based on your actual auth logic)
    const isLoggedIn = () => !!localStorage.getItem('token');

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            setError(null);
            try {
                // Assuming getAll fetches published posts by default
                const response = await api.posts.getAll();
                setPosts(response.data || []); // Ensure posts is always an array
            } catch (err) {
                console.error("PostList: Error fetching posts:", err);
                setError(err.response?.data?.error || err.message || 'Failed to load posts.');
                setPosts([]); // Clear posts on error
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []); // Runs once on component mount

    // --- Helper Functions ---
    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown date';
        try {
            return format(new Date(dateString), 'MMM dd, yyyy'); // e.g., Sep 21, 2023
        } catch {
            return 'Invalid date';
        }
    };

    // --- Render Logic ---

    const renderLoading = () => (
        <div className="flex flex-col justify-center items-center py-24 text-center">
            <FiLoader className="animate-spin text-4xl text-indigo-600 mb-4" />
            <p className="text-lg text-gray-600">Loading Posts...</p>
        </div>
    );

    const renderError = () => error && (
         <div className="mb-8 flex items-start gap-x-3 bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm" role="alert">
            <FiAlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
                <h3 className="text-base font-semibold text-red-800">Error Loading Posts</h3>
                <p className="text-sm text-red-700">{error}</p>
            </div>
        </div>
    );

    const renderEmptyState = () => (
        <div className="text-center py-24 bg-white rounded-xl shadow-sm border border-gray-100">
            <FiInbox className="mx-auto h-16 w-16 text-gray-400" />
            <h3 className="mt-4 text-xl font-semibold text-gray-900">No Posts Yet</h3>
            <p className="mt-2 text-base text-gray-500">There are currently no published posts to display.</p>
            {isLoggedIn() && (
                 <Link
                    to="new" // Relative path
                    className="mt-6 inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
                >
                    <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                    Create Your First Post
                </Link>
            )}
        </div>
    );

    const renderPostList = () => (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <ul className="divide-y divide-gray-200">
                {posts.map((post) => (
                    <li key={post.id} className="hover:bg-gray-50/70 transition-colors duration-150">
                        <Link
                            to={post.slug} // Assumes slug exists and is unique for the detail route
                            className="block px-6 py-5" // Make the whole item area clickable
                        >
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-indigo-700 hover:text-indigo-900 truncate pr-4">
                                    {post.title || 'Untitled Post'}
                                </h2>
                                <FiExternalLink className="h-5 w-5 text-gray-400 flex-shrink-0" />
                            </div>
                            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                                <div className="flex items-center">
                                    <FiUser className="mr-1.5 h-4 w-4 text-gray-400" />
                                    <span>{post.author || 'Unknown Author'}</span>
                                </div>
                                <div className="flex items-center">
                                    <FiCalendar className="mr-1.5 h-4 w-4 text-gray-400" />
                                    <span>{formatDate(post.created_at)}</span>
                                </div>
                            </div>
                             {/* Optional: Add a snippet/excerpt if available */}
                             {/* {post.excerpt && <p className="mt-2 text-sm text-gray-600 line-clamp-2">{post.excerpt}</p>} */}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );

    // --- Main Component Return ---
    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">

                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-10">
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight mb-4 sm:mb-0">
                        Blog Posts
                    </h1>
                    {isLoggedIn() && (
                        <Link
                            to="new" // Relative path
                            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            <FiPlus size={18} /> Create New Post
                        </Link>
                    )}
                </div>

                {renderError()}

                {loading
                    ? renderLoading()
                    : posts.length === 0
                        ? renderEmptyState()
                        : renderPostList()
                }
            </div>
        </div>
    );
};

// Remove the old inline styles object
// const styles = { ... };

export default PostList;