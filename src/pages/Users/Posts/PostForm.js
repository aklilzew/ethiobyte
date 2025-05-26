import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../../api/api'; // Adjust path if needed
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    FiSave, FiX, FiLoader, FiAlertCircle, FiCheckCircle, FiType,
    FiFileText, FiToggleLeft, FiToggleRight, FiChevronLeft, FiInfo
} from 'react-icons/fi'; // Import icons

// --- Main PostForm Component ---
const PostForm = () => {
    const { slug } = useParams(); // Get slug for editing
    const navigate = useNavigate();
    const isEditing = Boolean(slug);

    // --- State ---
    const [postId, setPostId] = useState(null); // Crucial for updates
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [status, setStatus] = useState('draft'); // 'draft' or 'published'
    const [isFetchingData, setIsFetchingData] = useState(false); // Loading state for initial fetch (edit mode)
    const [isSubmitting, setIsSubmitting] = useState(false); // Loading state for form submission
    const [fetchError, setFetchError] = useState(null); // Error fetching data for edit (blocks form render)

    // --- Authentication Check ---
    // Replace with your actual auth context/logic if available
    const isLoggedIn = useCallback(() => !!localStorage.getItem('token'), []);

    // --- Toast Config & Helpers ---
    const toastConfig = { position: "bottom-right", autoClose: 4000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, theme: "colored" };
    const notifySuccess = (message) => toast.success(<div className="flex items-center"><FiCheckCircle className="mr-2" />{message}</div>, toastConfig);
    const notifyError = (message, toastId = 'error-toast') => toast.error(<div className="flex items-center"><FiAlertCircle className="mr-2" />{message}</div>, { ...toastConfig, toastId });

    // --- Effects ---

    // Redirect if not logged in
    useEffect(() => {
        if (!isLoggedIn()) {
            notifyError("Authentication required.", "auth-error");
            navigate('/login', { replace: true }); // Redirect to login
        }
    }, [isLoggedIn, navigate]);

    // Fetch post data when editing
    useEffect(() => {
        // Only run if in edit mode and slug is present
        if (!isEditing || !slug) {
            // Reset form for 'create' mode
            setPostId(null); setTitle(''); setContent(''); setStatus('draft');
            setFetchError(null); // Clear any previous fetch errors
            return;
        }

        const fetchPostForEdit = async () => {
            console.log(`PostForm: Editing mode. Fetching post with slug: ${slug}`);
            setIsFetchingData(true);
            setFetchError(null);
            // Reset form fields while fetching
            setPostId(null); setTitle(''); setContent(''); setStatus('draft');

            try {
                const response = await api.posts.getBySlug(slug);
                const post = response.data;
                console.log("PostForm: Fetched post data:", post);
                if (post && post.id) {
                    setPostId(post.id); // *** STORE THE POST ID ***
                    setTitle(post.title || '');
                    setContent(post.content || '');
                    setStatus(post.status || 'draft');
                } else {
                    console.error("PostForm: Fetched data missing ID or invalid.", post);
                    setFetchError(`Post data not found or invalid for slug "${slug}".`);
                }
            } catch (err) {
                console.error("PostForm: Error fetching post for editing:", err);
                let errorMsg = err.response?.data?.error || err.message || 'Failed to load post data.';
                if (err.response?.status === 404) {
                    errorMsg = `Post with slug "${slug}" not found.`;
                }
                setFetchError(errorMsg); // Set error to block form rendering
            } finally {
                setIsFetchingData(false);
            }
        };

        fetchPostForEdit();

    }, [isEditing, slug]); // Rerun only if isEditing or slug changes


    // --- Form Submission ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isLoggedIn()) return notifyError("Authentication error. Please log in again.", "auth-error");

        setIsSubmitting(true); // Use submission loading state

        const postData = { title, content, status };
        console.log(`PostForm: Submitting. Editing: ${isEditing}. Post ID: ${postId}`, postData);

        try {
            let response;
            let targetSlug; // Slug to navigate to after success

            if (isEditing) {
                // --- UPDATE ---
                if (!postId) {
                    console.error("PostForm: Cannot update, Post ID missing!");
                    notifyError("Cannot update post: Critical data missing. Please refresh.", "update-missing-id");
                    setIsSubmitting(false);
                    return;
                }
                response = await api.posts.update(postId, postData);
                notifySuccess(response.data?.message || 'Post updated successfully!');
                targetSlug = slug; // Use the current slug for navigation after update

            } else {
                // --- CREATE ---
                response = await api.posts.create(postData);
                notifySuccess(response.data?.message || 'Post created successfully!');
                targetSlug = response.data?.slug; // Get slug from response
                if (!targetSlug) {
                    console.warn('PostForm: Create response missing slug, navigating to posts list.');
                    navigate('/dashboard/posts', { replace: true }); // Fallback navigation
                    setIsSubmitting(false);
                    return;
                }
            }

            console.log("PostForm: Submission successful, navigating to:", `/dashboard/posts/${targetSlug}`);
            // Navigate to the detail page using absolute path within dashboard context
            navigate(`/dashboard/posts/${targetSlug}`, { replace: true });

        } catch (err) {
            console.error(`PostForm: Error ${isEditing ? 'updating' : 'creating'} post:`, err);
            const errorMsg = err.response?.data?.error || `Failed to ${isEditing ? 'update' : 'create'} post.`;
            notifyError(errorMsg, `submit-error-${isEditing ? postId : 'new'}`);
        } finally {
             setIsSubmitting(false); // Stop submission loading state
        }
    };


    // --- Render Logic ---

    // Display loading state ONLY during initial data fetch for edit mode
    if (isEditing && isFetchingData) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)] text-center p-10">
                <FiLoader className="animate-spin text-5xl text-indigo-600 mb-5" />
                <h2 className="text-xl font-semibold text-gray-700">Loading Post Data...</h2>
            </div>
        );
    }

    // Display BLOCKING error if fetching data failed in edit mode
    if (isEditing && fetchError) {
         return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                 <div className="mb-6 flex items-start gap-x-3 bg-red-50 border-l-4 border-red-500 p-5 rounded-md shadow-sm" role="alert">
                    <FiAlertCircle className="h-7 w-7 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="text-lg font-semibold text-red-800">Error Loading Post</h3>
                        <p className="text-base text-red-700">{fetchError}</p>
                         <Link to="/dashboard/posts" className="mt-3 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800">
                             <FiChevronLeft className="mr-1 h-4 w-4"/> Back to Posts List
                         </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Render nothing useful until login check passes (useEffect handles redirect)
    if (!isLoggedIn()) {
        return null; // Or a minimal loading/redirecting message
    }


    // --- Main Form Render ---
    return (
        <div className="bg-gray-50 min-h-screen">
            <ToastContainer newestOnTop />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">

                {/* Form Card */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden max-w-4xl mx-auto">
                    {/* Form Header */}
                    <div className="p-6 bg-gradient-to-b from-gray-50 to-white border-b border-gray-200">
                         <button onClick={() => navigate(-1)} className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4 font-medium transition-colors disabled:opacity-50" disabled={isSubmitting}>
                            <FiChevronLeft className="mr-1 h-4 w-4" /> Back
                         </button>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                            {isEditing ? 'Edit Post' : 'Create New Post'}
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                             {isEditing ? `Editing post ID: ${postId || '...'}` : 'Fill in the details for your new blog post.'}
                        </p>
                    </div>

                    {/* Form Body */}
                    <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
                        {/* Title Field */}
                        <div>
                            <label htmlFor="postTitle" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                <FiType className="mr-2 h-4 w-4 text-gray-400"/> Title <span className="text-red-500 ml-1">*</span>
                            </label>
                            <input
                                type="text"
                                id="postTitle"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 disabled:bg-gray-50"
                                disabled={isSubmitting}
                                placeholder="Enter a catchy title"
                            />
                        </div>

                        {/* Content Field */}
                        <div>
                             <label htmlFor="postContent" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                <FiFileText className="mr-2 h-4 w-4 text-gray-400"/> Content <span className="text-red-500 ml-1">*</span>
                            </label>
                            <textarea
                                id="postContent"
                                rows="15" // Adjust rows as needed
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 disabled:bg-gray-50 leading-relaxed" // Added leading-relaxed
                                disabled={isSubmitting}
                                placeholder="Write your post content here... (Markdown might be supported depending on display)"
                            />
                            {/* Optional: Add Markdown hint */}
                            {/* <p className="mt-1 text-xs text-gray-500">Markdown syntax is supported.</p> */}
                        </div>

                        {/* Status Field */}
                        <div>
                             <label htmlFor="postStatus" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                {status === 'published' ? <FiToggleRight className="mr-2 h-5 w-5 text-green-500"/> : <FiToggleLeft className="mr-2 h-5 w-5 text-gray-400"/>}
                                Status <span className="text-red-500 ml-1">*</span>
                            </label>
                            <select
                                id="postStatus"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 disabled:bg-gray-50 bg-white" // Added bg-white explicitly
                                disabled={isSubmitting}
                            >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                            </select>
                             <p className="mt-1 text-xs text-gray-500">
                                {status === 'draft' ? 'Saved as draft. Not visible publicly.' : 'Will be visible on the blog.'}
                             </p>
                        </div>

                        {/* Form Actions / Submit Button */}
                        <div className="flex justify-end items-center gap-4 pt-5 border-t border-gray-200 mt-8">
                            <button
                                type="button"
                                onClick={() => navigate(-1)} // Go back
                                disabled={isSubmitting}
                                className="px-6 py-2 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition duration-150 disabled:opacity-70"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`inline-flex items-center justify-center px-6 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isSubmitting ? (
                                    <> <FiLoader className="animate-spin -ml-1 mr-2 h-4 w-4" /> Processing... </>
                                ) : (
                                    <> <FiSave className="-ml-1 mr-2 h-4 w-4" /> {isEditing ? 'Update Post' : 'Create Post'} </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PostForm;