import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { format, formatDistanceToNow } from 'date-fns'; // Import date-fns functions
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../../api/api'; // Adjust path if needed
import {
    FiEdit, FiTrash2, FiMessageSquare, FiSend, FiX, FiLoader, FiUser, FiCalendar,
    FiAlertCircle, FiCheckCircle, FiEdit2, FiSave, FiCornerUpLeft, FiChevronLeft,
    FiUserCheck
} from 'react-icons/fi';

// --- Custom Confirmation Toast Component --- (Re-use from previous examples)
const ConfirmationToast = ({ closeToast, message, onConfirm, title = "Confirm Action" }) => {
    const handleConfirm = () => { onConfirm(); closeToast(); };
    const handleCancel = () => { closeToast(); };
    return (
        <div className="p-3 max-w-sm">
            <div className="text-lg font-semibold text-gray-900 mb-2">{title}</div>
            <p className="text-sm text-gray-600 mb-4">{message}</p>
            <div className="flex justify-end space-x-3">
                <button onClick={handleCancel} className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 transition duration-150">Cancel</button>
                <button onClick={handleConfirm} className="px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition duration-150">Confirm</button>
            </div>
        </div>
    );
};

// --- Main PostDetails Component ---
const PostDetails = () => {
    const { slug } = useParams();
    const navigate = useNavigate();

    // --- State ---
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [currentUserProfile, setCurrentUserProfile] = useState(null);

    // Loading States
    const [isLoadingPost, setIsLoadingPost] = useState(true);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true); // Separate loading for profile
    const [isLoadingComments, setIsLoadingComments] = useState(false);
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [isProcessingCommentAction, setIsProcessingCommentAction] = useState(false); // For edit/delete
    const [isDeletingPost, setIsDeletingPost] = useState(false);

    // Error States
    const [postError, setPostError] = useState(null); // Critical post fetch error
    const [profileError, setProfileError] = useState(null); // Critical profile fetch error
    const [commentError, setCommentError] = useState(null); // Error submitting new comment

    // Comment Editing State
    const [editingComment, setEditingComment] = useState({ id: null, currentContent: '' });

    // --- Auth Check ---
    const hasAuthToken = useCallback(() => !!localStorage.getItem('token'), []);

    // --- Toast Config & Helpers ---
    const toastConfig = { position: "bottom-right", autoClose: 4000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, theme: "colored" };
    const notifySuccess = (message) => toast.success(<div className="flex items-center"><FiCheckCircle className="mr-2" />{message}</div>, toastConfig);
    const notifyError = (message, toastId) => toast.error(<div className="flex items-center"><FiAlertCircle className="mr-2" />{message}</div>, { ...toastConfig, toastId });
    const confirmAction = (message, onConfirm, title) => toast(({ closeToast }) => (
        <ConfirmationToast closeToast={closeToast} message={message} onConfirm={onConfirm} title={title} />
    ), { ...toastConfig, autoClose: false, closeOnClick: false, draggable: false, position: "top-center", theme: 'light' });

    // --- Fetch User Profile ---
    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!hasAuthToken()) {
                setIsLoadingProfile(false);
                setCurrentUserProfile(null);
                return;
            }
            setIsLoadingProfile(true);
            setProfileError(null);
            try {
                const response = await api.auth.getProfile();
                setCurrentUserProfile(response.data);
            } catch (err) {
                console.error("Error fetching user profile:", err);
                 // If profile is critical for viewing comments/actions, set a persistent error
                 // Otherwise, just log it or show a non-blocking toast
                setProfileError("Could not load your user profile. Some actions may be disabled.");
                 setCurrentUserProfile(null); // Clear profile on error
                 if (err.response?.status === 401) {
                    setProfileError("Session expired or invalid. Please log in again.");
                 }
            } finally {
                setIsLoadingProfile(false);
            }
        };
        fetchUserProfile();
    }, [hasAuthToken]);

    // --- Fetch Post & Comments ---
    useEffect(() => {
        if (!slug) {
            setPostError("No post specified.");
            setIsLoadingPost(false);
            return;
        }

        const fetchPostAndComments = async () => {
            setIsLoadingPost(true);
            setPostError(null);
            setPost(null);
            setComments([]);

            try {
                // Fetch Post
                const postResponse = await api.posts.getBySlug(slug);
                const fetchedPost = postResponse.data;
                if (!fetchedPost || !fetchedPost.id) {
                    throw new Error("Post not found or invalid data received.");
                }
                setPost(fetchedPost);

                // Fetch Comments (only after post is fetched)
                setIsLoadingComments(true);
                try {
                    const commentsResponse = await api.posts.comments.get(fetchedPost.id);
                    setComments(commentsResponse.data || []);
                } catch (commentErr) {
                    console.error("Error fetching comments:", commentErr);
                    notifyError("Could not load comments for this post.", "fetch-comments-error");
                } finally {
                    setIsLoadingComments(false);
                }

            } catch (err) {
                console.error("Error fetching post:", err);
                let errorMsg = err.response?.data?.error || err.message || 'Failed to load the post.';
                 if (err.message === "Post not found or invalid data received." || err.response?.status === 404) {
                    errorMsg = `Post with slug "${slug}" not found.`;
                }
                setPostError(errorMsg); // Set critical error
            } finally {
                setIsLoadingPost(false);
            }
        };

        fetchPostAndComments();
    }, [slug]); // Dependency: slug

    // --- Post Actions ---
    const handleDeletePost = () => {
        if (!post?.id || !currentUserProfile) return notifyError("Cannot perform action. Data missing or not logged in.");

        confirmAction(
            `Are you sure you want to delete the post "${post.title}"? This cannot be undone.`,
            async () => {
                setIsDeletingPost(true);
                try {
                    await api.posts.delete(post.id);
                    notifySuccess('Post deleted successfully!');
                     // Navigate back to the posts list (adjust path if needed)
                    navigate('/dashboard/posts', { replace: true });
                } catch (err) {
                    console.error("Error deleting post:", err);
                    notifyError(err.response?.data?.error || 'Failed to delete post.', `delete-post-error-${post.id}`);
                    setIsDeletingPost(false);
                }
                // No finally needed here as navigate removes the component
            },
            "Confirm Post Deletion"
        );
    };

    // --- Comment Actions ---
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || !post?.id || !currentUserProfile) return;

        setIsSubmittingComment(true);
        setCommentError(null);
        try {
            const response = await api.posts.comments.create(post.id, { content: newComment });
             // Add the new comment to the start of the list for immediate feedback
            setComments(prev => [response.data, ...prev]);
            setNewComment(''); // Clear input
            notifySuccess("Comment added!");
        } catch (err) {
            console.error("Error submitting comment:", err);
             const errorMsg = err.response?.data?.error || 'Failed to post comment.';
             setCommentError(errorMsg); // Show error near the form
             notifyError(errorMsg, "comment-submit-error");
        } finally {
            setIsSubmittingComment(false);
        }
    };

    const handleEditClick = (comment) => setEditingComment({ id: comment.id, currentContent: comment.content });
    const handleCancelEdit = () => setEditingComment({ id: null, currentContent: '' });
    const handleEditContentChange = (e) => setEditingComment(prev => ({ ...prev, currentContent: e.target.value }));

    const handleSaveEdit = async (commentId) => {
        if (!editingComment.currentContent.trim() || !currentUserProfile) return;

        setIsProcessingCommentAction(true);
        try {
            await api.posts.comments.update(commentId, { content: editingComment.currentContent });
            setComments(prev => prev.map(c => c.id === commentId ? { ...c, content: editingComment.currentContent, updated_at: new Date().toISOString() } : c)); // Update content and timestamp locally
            handleCancelEdit(); // Close edit form
            notifySuccess("Comment updated!");
        } catch (err) {
            console.error("Error updating comment:", err);
            notifyError(err.response?.data?.error || 'Failed to update comment.', `update-comment-${commentId}`);
        } finally {
            setIsProcessingCommentAction(false);
        }
    };

    const handleDeleteComment = (commentId) => {
         if (!currentUserProfile) return notifyError("Cannot verify user. Please refresh or log in.");

        confirmAction(
            "Are you sure you want to delete this comment?",
            async () => {
                setIsProcessingCommentAction(true);
                try {
                    await api.posts.comments.delete(commentId);
                    setComments(prev => prev.filter(c => c.id !== commentId));
                    notifySuccess("Comment deleted.");
                } catch (err) {
                    console.error("Error deleting comment:", err);
                    notifyError(err.response?.data?.error || 'Failed to delete comment.', `delete-comment-${commentId}`);
                } finally {
                    setIsProcessingCommentAction(false);
                }
            },
            "Confirm Comment Deletion"
        );
    };


    // --- Render Logic ---

    // Combined Initial Loading State
    if (isLoadingPost || isLoadingProfile) {
        return (
             <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)] text-center p-10">
                <FiLoader className="animate-spin text-5xl text-indigo-600 mb-5" />
                <h2 className="text-xl font-semibold text-gray-700">Loading Details...</h2>
            </div>
        );
    }

    // Critical Error States
    if (postError) {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                 <div className="mb-6 flex items-start gap-x-3 bg-red-50 border-l-4 border-red-500 p-5 rounded-md shadow-sm" role="alert">
                    <FiAlertCircle className="h-7 w-7 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="text-lg font-semibold text-red-800">Error Loading Post</h3>
                        <p className="text-base text-red-700">{postError}</p>
                        <Link to="/dashboard/posts" className="mt-3 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800">
                            <FiChevronLeft className="mr-1 h-4 w-4"/> Back to Posts List
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
     if (!post) { // Should be caught by postError, but as a fallback
        return <div className="container mx-auto p-10 text-center text-gray-500">Post not found.</div>;
     }
     if (profileError && !currentUserProfile && hasAuthToken()) {
         // Show profile error if user IS logged in but profile failed
          return (
             <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                 <div className="mb-6 flex items-start gap-x-3 bg-yellow-50 border-l-4 border-yellow-500 p-5 rounded-md shadow-sm" role="alert">
                    <FiAlertCircle className="h-7 w-7 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="text-lg font-semibold text-yellow-800">User Profile Issue</h3>
                        <p className="text-base text-yellow-700">{profileError}</p>
                         <p className="text-sm text-yellow-600 mt-1">You can still view the post, but commenting/actions might be limited.</p>
                    </div>
                </div>
                 {/* Still render the post below the error */}
            </div>
        );
     }

    // Get current user ID safely AFTER profile loading/error checks
    const loggedInUserId = currentUserProfile?.id;

    // --- Helper Functions ---
    const formatDate = (dateString) => {
        if (!dateString) return '';
        try { return format(new Date(dateString), 'MMM dd, yyyy'); }
        catch { return 'Invalid Date'; }
    };
    const formatRelativeTime = (dateString) => {
        if (!dateString) return '';
        try { return formatDistanceToNow(new Date(dateString), { addSuffix: true }); }
        catch { return ''; }
    };


    return (
        <div className="bg-gray-50 min-h-screen">
             <ToastContainer newestOnTop />
             <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-4xl"> {/* Max width for readability */}

                {/* Back Button */}
                 <Link to="/dashboard/posts" className="inline-flex items-center text-sm text-gray-600 hover:text-indigo-700 mb-6 font-medium transition-colors">
                    <FiChevronLeft className="mr-1 h-4 w-4" /> Back to All Posts
                </Link>

                {/* Post Content Card */}
                <article className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    {/* Post Header */}
                    <div className="p-6 sm:p-8 border-b border-gray-200">
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
                            {post.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                            <div className="flex items-center">
                                <FiUser className="mr-1.5 h-4 w-4 text-gray-400"/>
                                <span>By {post.author || 'Unknown'}</span>
                            </div>
                            <div className="flex items-center">
                                <FiCalendar className="mr-1.5 h-4 w-4 text-gray-400"/>
                                <span>Published on {formatDate(post.created_at)}</span>
                            </div>
                            {/* Optionally show updated time if significantly different */}
                            {post.updated_at && new Date(post.updated_at) > new Date(post.created_at).setMinutes(new Date(post.created_at).getMinutes() + 5) && (
                                <div className="flex items-center">
                                    <FiEdit2 className="mr-1.5 h-4 w-4 text-gray-400"/>
                                    <span>Updated {formatRelativeTime(post.updated_at)}</span>
                                </div>
                            )}
                        </div>

                        {/* Edit/Delete Buttons for Authorized User */}
                         {/* Render only if logged in, profile loaded, AND user owns post (or is admin - backend check) */}
                         {/* Basic check: show if logged in. Backend MUST verify rights */}
                        {hasAuthToken() && currentUserProfile && (
                             <div className="mt-5 flex gap-3">
                                <Link
                                    to="edit" // Relative path for edit
                                    className="inline-flex items-center gap-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-4 py-1.5 rounded-md text-xs font-semibold shadow-sm transition duration-150"
                                >
                                    <FiEdit2 size={14} /> Edit Post
                                </Link>
                                <button
                                    onClick={handleDeletePost}
                                    disabled={isDeletingPost}
                                    className={`inline-flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-1.5 rounded-md text-xs font-semibold shadow-sm transition duration-150 ${isDeletingPost ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                     {isDeletingPost ? <FiLoader className="animate-spin h-4 w-4 mr-1" /> : <FiTrash2 size={14} />}
                                     {isDeletingPost ? 'Deleting...' : 'Delete Post'}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Post Body */}
                    {/* Using Tailwind's prose plugin is ideal here, but needs setup. */}
                    {/* Basic styling fallback: */}
                    <div
                        className="prose prose-indigo lg:prose-lg max-w-none p-6 sm:p-8 text-gray-700 leading-relaxed" // Basic styling
                        dangerouslySetInnerHTML={{ __html: post.content || '' }}
                    />
                </article>

                {/* Comments Section Card */}
                <section className="mt-12 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="p-6 sm:p-8 border-b border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                           <FiMessageSquare className="mr-3 text-indigo-600"/> Comments ({comments.length})
                        </h2>
                    </div>

                    <div className="p-6 sm:p-8 space-y-8">
                         {/* New Comment Form */}
                         {hasAuthToken() && currentUserProfile ? (
                             <form onSubmit={handleCommentSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="newComment" className="sr-only">Add a comment</label>
                                    <textarea
                                        id="newComment"
                                        rows="4"
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 disabled:bg-gray-50"
                                        placeholder={`Commenting as ${currentUserProfile.username || 'User'}...`}
                                        required
                                        disabled={isSubmittingComment}
                                    />
                                     {commentError && <p className="mt-1 text-xs text-red-600">{commentError}</p>}
                                </div>
                                <div className="flex justify-end">
                                     <button
                                        type="submit"
                                        disabled={isSubmittingComment || !newComment.trim()}
                                        className={`inline-flex items-center justify-center px-5 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ${isSubmittingComment || !newComment.trim() ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    >
                                         {isSubmittingComment ? (
                                            <> <FiLoader className="animate-spin -ml-1 mr-2 h-4 w-4" /> Sending... </>
                                         ) : (
                                            <> <FiSend className="-ml-1 mr-2 h-4 w-4" /> Post Comment </>
                                         )}
                                    </button>
                                </div>
                            </form>
                         ) : (
                             <div className="text-center py-6 bg-gray-50 rounded-lg border border-gray-200">
                                 <p className="text-gray-600">
                                     <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-800 underline">Log in</Link> or <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-800 underline">sign up</Link> to leave a comment.
                                 </p>
                             </div>
                         )}

                         {/* Comments List */}
                         {isLoadingComments ? (
                             <div className="text-center py-8"><FiLoader className="animate-spin text-3xl text-indigo-500 mx-auto"/></div>
                         ) : comments.length === 0 ? (
                             <p className="text-center text-gray-500 py-6">Be the first to comment!</p>
                         ) : (
                             <ul className="space-y-6 divide-y divide-gray-100">
                                 {comments.map(comment => {
                                     // Determine ownership safely using the fetched profile ID
                                     const isOwner = loggedInUserId !== null && comment.user_id !== null && Number(loggedInUserId) === Number(comment.user_id);
                                     const isEditingThisComment = editingComment.id === comment.id;

                                     return (
                                         <li key={comment.id} className={`pt-6 ${isEditingThisComment ? 'bg-indigo-50/50 p-4 -m-4 rounded-lg' : ''}`}>
                                             <div className="flex space-x-3">
                                                  {/* Avatar Placeholder */}
                                                  <div className="flex-shrink-0">
                                                      <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-gray-200">
                                                          <FiUser className="h-5 w-5 text-gray-500" />
                                                      </span>
                                                  </div>
                                                  <div className="flex-1 space-y-1">
                                                      <div className="flex items-center justify-between">
                                                          <h3 className="text-sm font-semibold text-gray-900">
                                                              {comment.author || 'Anonymous'}
                                                              {isOwner && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"><FiUserCheck className="mr-1"/>You</span>}
                                                          </h3>
                                                          <p className="text-xs text-gray-500" title={format(new Date(comment.created_at), 'PPpp')}>
                                                              {formatRelativeTime(comment.created_at)}
                                                          </p>
                                                      </div>

                                                      {/* Comment Edit Form / Display */}
                                                      {isEditingThisComment ? (
                                                          <div className="mt-2 space-y-2">
                                                              <textarea
                                                                  rows="3"
                                                                  value={editingComment.currentContent}
                                                                  onChange={handleEditContentChange}
                                                                  className="w-full px-3 py-2 border border-indigo-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
                                                                  disabled={isProcessingCommentAction}
                                                              />
                                                              <div className="flex justify-end gap-2">
                                                                   <button onClick={handleCancelEdit} disabled={isProcessingCommentAction} className="px-3 py-1 rounded text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition">Cancel</button>
                                                                   <button onClick={() => handleSaveEdit(comment.id)} disabled={isProcessingCommentAction || !editingComment.currentContent.trim()} className={`inline-flex items-center px-3 py-1 rounded text-xs font-medium text-white bg-green-600 hover:bg-green-700 transition ${isProcessingCommentAction || !editingComment.currentContent.trim() ? 'opacity-70 cursor-not-allowed' : ''}`}>
                                                                       {isProcessingCommentAction ? <FiLoader className="animate-spin h-4 w-4 mr-1"/> : <FiSave size={14} className="mr-1"/>} Save
                                                                    </button>
                                                              </div>
                                                          </div>
                                                      ) : (
                                                          <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                                                      )}

                                                       {/* Comment Action Buttons */}
                                                       {isOwner && !isEditingThisComment && currentUserProfile && (
                                                           <div className="mt-2 flex items-center gap-x-3">
                                                              <button onClick={() => handleEditClick(comment)} disabled={isProcessingCommentAction} className="flex items-center text-xs text-gray-500 hover:text-indigo-600 font-medium transition">
                                                                  <FiEdit2 size={14} className="mr-1"/> Edit
                                                               </button>
                                                              <button onClick={() => handleDeleteComment(comment.id)} disabled={isProcessingCommentAction} className="flex items-center text-xs text-red-500 hover:text-red-700 font-medium transition">
                                                                   <FiTrash2 size={14} className="mr-1"/> Delete
                                                                </button>
                                                           </div>
                                                        )}
                                                  </div>
                                              </div>
                                         </li>
                                     );
                                 })}
                             </ul>
                         )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default PostDetails;