import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../../api/api';

// Import Icons
import { FiFileText, FiUser, FiClock, FiEdit, FiTrash2, FiLoader, FiAlertCircle, FiMessageSquare, FiSend, FiSave, FiXCircle, FiArrowLeft, FiCheckCircle, FiInfo } from 'react-icons/fi';
// Optional: Import date-fns for more formatting options
// import { format } from 'date-fns';

const PostDetailPage = () => {
  // --- LOGIC (Unchanged) ---
  const { slug } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [loadingPost, setLoadingPost] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);
  const [error, setError] = useState(null); // For post fetch/delete errors
  const [commentError, setCommentError] = useState(null); // For comment fetch/add/update/delete errors
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isUpdatingComment, setIsUpdatingComment] = useState(false);

  const fetchComments = useCallback(async (postId) => {
    setLoadingComments(true);
    setCommentError(null);
    try {
      const response = await api.posts.comments.get(postId);
      setComments(response.data);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
      setCommentError('Failed to load comments.');
    } finally {
      setLoadingComments(false);
    }
  }, []); // Memoized fetchComments

  const fetchPost = useCallback(async () => {
    setLoadingPost(true);
    setError(null);
    try {
      const response = await api.posts.getBySlug(slug);
      setPost(response.data);
      if (response.data && response.data.id) {
        fetchComments(response.data.id);
      } else {
        setLoadingComments(false);
      }
    } catch (err) {
      console.error("Failed to fetch post details:", err);
      setError(err.response?.status === 404 ? 'Post not found.' : 'Failed to load post details.');
      setLoadingComments(false);
    } finally {
      setLoadingPost(false);
    }
  }, [slug, fetchComments]); // Added fetchComments dependency

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !post?.id) return;
    setIsSubmittingComment(true);
    setCommentError(null);
    try {
      await api.posts.comments.create(post.id, { content: newComment });
      setNewComment('');
      fetchComments(post.id);
    } catch (err) {
      console.error("Failed to add comment:", err);
      setCommentError(err.response?.data?.error || 'Failed to add comment.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleCommentDelete = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
       setCommentError(null);
      try {
        await api.posts.comments.delete(commentId);
        fetchComments(post.id);
      } catch (err) {
        console.error("Failed to delete comment:", err);
        setCommentError(err.response?.data?.error || 'Failed to delete comment.');
      }
    }
  };

   const handleEditClick = (comment) => {
       setEditingComment({ id: comment.id, content: comment.content });
       setCommentError(null);
   };

   const handleCommentUpdate = async (e) => {
       e.preventDefault();
       if (!editingComment || !editingComment.content.trim()) return;
       setIsUpdatingComment(true);
       setCommentError(null);
       try {
           await api.posts.comments.update(editingComment.id, { content: editingComment.content });
           setEditingComment(null);
           fetchComments(post.id);
       } catch (err) {
           console.error("Failed to update comment:", err);
           setCommentError(err.response?.data?.error || 'Failed to update comment.');
       } finally {
           setIsUpdatingComment(false);
       }
   };

  const handlePostDelete = async () => {
    if (post && window.confirm(`Are you sure you want to delete the post "${post.title}"?`)) {
      // Add loading state for post deletion if needed
      try {
        await api.posts.delete(post.id);
        navigate('/admin/posts');
      } catch (err) {
        console.error("Failed to delete post:", err);
        // Display this error more prominently if needed
        setError(err.response?.data?.error || 'Failed to delete post.');
      }
      // Reset loading state if added
    }
  };

  // Simple date formatting helper (using original logic)
  const formatDate = (dateString, includeTime = false) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return includeTime ? date.toLocaleString() : date.toLocaleDateString();
    } catch (e) {
      return 'Invalid Date';
    }
  };

  // Status badge helper
  const getStatusBadge = (status) => {
     const lowerStatus = status?.toLowerCase();
     switch (lowerStatus) {
       case 'published': return { icon: <FiCheckCircle className="mr-1.5" />, classes: 'bg-green-100 text-green-800' };
       case 'draft': return { icon: <FiEdit className="mr-1.5" />, classes: 'bg-yellow-100 text-yellow-800' };
       default: return { icon: <FiInfo className="mr-1.5" />, classes: 'bg-gray-100 text-gray-700' };
     }
  };
  // --- END OF LOGIC ---


  // --- UI Rendering (Redesigned with Tailwind, text-base focus) ---

  // Loading State
  if (loadingPost) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-10rem)] text-center p-10 bg-gray-50">
        <FiLoader className="animate-spin text-5xl text-blue-500 mb-4" />
        <p className="text-xl text-gray-600">Loading post...</p> {/* text-xl */}
      </div>
    );
  }

  // Error State (Post Fetch Failed)
  if (error) {
    return (
       <div className="bg-gray-50 min-h-screen p-6 lg:p-10">
         <div className="mb-6 flex flex-col items-center gap-4 bg-red-100 border border-red-300 text-red-800 p-6 rounded-lg shadow-md max-w-lg mx-auto text-center" role="alert">
           <FiAlertCircle className="h-10 w-10 text-red-600" />
           <div>
             <h3 className="text-xl font-semibold mb-2">Error</h3> {/* text-xl */}
             <p className="text-base">{error}</p> {/* text-base */}
              <Link
                to="/admin/posts"
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500" // text-base
              >
                <FiArrowLeft size={18}/>
                Back to Posts List
              </Link>
           </div>
         </div>
       </div>
    );
  }

   // Fallback if somehow post is null after loading and no error (shouldn't happen often)
   if (!post) {
     return (
       <div className="text-center p-10 text-base text-gray-600">Post data could not be loaded.</div>
     );
   }


  // --- Main Content Display ---
   const statusInfo = getStatusBadge(post.status);

  return (
    <div className="bg-gray-100 min-h-screen p-6 lg:p-10">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">

        {/* Post Header & Meta */}
        <div className="p-6 md:p-8 border-b border-gray-200">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-base text-gray-500"> {/* text-base */}
            <span className="inline-flex items-center gap-1.5">
              <FiUser size={16} />
              By {post.author || 'Unknown Author'}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <FiClock size={16} />
              {formatDate(post.created_at)}
            </span>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium capitalize ${statusInfo.classes}`} // Status badge can use text-sm
              title={`Status: ${post.status || 'unknown'}`}
            >
              {statusInfo.icon}
              {post.status || 'unknown'}
            </span>
          </div>
        </div>

        {/* Post Content */}
        <div className="p-6 md:p-8">
           {/* Use Tailwind Typography plugin for nice rendering of HTML content */}
           <div
             className="prose prose-lg max-w-none text-base" // text-base forced here
             dangerouslySetInnerHTML={{ __html: post.content }}
           />
           {/* Fallback basic styling if not using prose plugin:
             <div
               className="text-base leading-relaxed text-gray-700" // Ensure text-base
               dangerouslySetInnerHTML={{ __html: post.content }}
             />
           */}
        </div>

        {/* Admin Actions */}
        <div className="p-6 bg-gray-50 border-t border-gray-200 flex flex-wrap justify-start items-center gap-4">
            <Link
              to={`/admin/posts/edit/${post.id}`}
              className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" // text-base
            >
              <FiEdit size={18} />
              Edit Post
            </Link>
            <button
              onClick={handlePostDelete}
              className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500" // text-base
            >
              <FiTrash2 size={18} />
              Delete Post
            </button>
             <Link
              to="/admin/posts"
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" // text-base
            >
              <FiArrowLeft size={18} />
              Back to List
            </Link>
        </div>

        {/* Comments Section */}
        <div className="p-6 md:p-8 border-t border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
             <FiMessageSquare /> Comments ({comments.length})
          </h2>

          {/* Add New Comment Form */}
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <label htmlFor="new-comment" className="sr-only">Add a comment</label> {/* Screen reader label */}
            {/* Textarea uses text-base */}
            <textarea
              id="new-comment"
              rows="4"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
              disabled={isSubmittingComment}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-base border border-gray-300 rounded-md p-3 disabled:bg-gray-50 mb-3" // text-base, p-3
            />
            <div className="flex justify-between items-center">
                <button
                  type="submit"
                  disabled={isSubmittingComment || !newComment.trim()}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50" // text-base
                >
                  {isSubmittingComment ? (
                      <>
                        <FiLoader className="animate-spin -ml-1 mr-2 h-5 w-5" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <FiSend size={18} className="-ml-1 mr-2" />
                        Add Comment
                      </>
                    )}
                </button>
                 {/* Comment submission error */}
                 {commentError && !editingComment && ( // Only show general submit error if not editing
                    <p className="text-base text-red-600 flex items-center gap-1"> <FiXCircle size={16}/> {commentError}</p> // text-base
                 )}
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-6">
            {loadingComments ? (
              <div className="flex items-center justify-center py-6 text-base text-gray-500"> {/* text-base */}
                  <FiLoader className="animate-spin mr-3 text-xl" /> Loading comments...
              </div>
            ) : comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="flex items-start space-x-3">
                  {/* Placeholder for User Avatar */}
                  <div className="flex-shrink-0">
                     <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-gray-400">
                       <span className="text-lg font-medium leading-none text-white">
                         {comment.author ? comment.author.charAt(0).toUpperCase() : 'U'}
                       </span>
                     </span>
                  </div>
                  {/* Comment Content and Actions */}
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-medium text-gray-800 mb-1"> {/* text-base */}
                      {comment.author || 'User'}
                       <span className="text-base font-normal text-gray-500 ml-2"> {/* text-base */}
                          {formatDate(comment.created_at, true)}
                       </span>
                    </p>

                    {editingComment && editingComment.id === comment.id ? (
                       // Edit Comment Form
                       <form onSubmit={handleCommentUpdate} className="mt-1">
                         {/* text-base */}
                         <textarea
                           rows="3"
                           value={editingComment.content}
                           onChange={(e) => setEditingComment({...editingComment, content: e.target.value})}
                           required
                           disabled={isUpdatingComment}
                           className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-base border border-gray-300 rounded-md p-2 disabled:bg-gray-50 mb-2" // text-base
                         />
                         <div className="flex items-center gap-2">
                           <button
                             type="submit"
                             disabled={isUpdatingComment || !editingComment.content.trim()}
                             className="inline-flex items-center justify-center px-3 py-1 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50" // text-base
                           >
                              {isUpdatingComment ? <FiLoader className="animate-spin h-4 w-4" /> : <FiSave size={16} />}
                              <span className="ml-1.5">{isUpdatingComment ? 'Saving' : 'Save'}</span>
                           </button>
                           <button
                             type="button"
                             onClick={() => setEditingComment(null)}
                             disabled={isUpdatingComment}
                              className="inline-flex items-center justify-center px-3 py-1 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50" // text-base
                           >
                             Cancel
                           </button>
                         </div>
                          {/* Edit-specific error */}
                         {commentError && editingComment?.id === comment.id && (
                            <p className="text-base text-red-600 mt-2 flex items-center gap-1"> <FiXCircle size={16}/> {commentError}</p> // text-base
                         )}
                       </form>
                    ) : (
                       // Display Comment
                       <>
                         <p className="text-base text-gray-700 mb-2">{comment.content}</p> {/* text-base */}
                         {/* Comment Actions - Assuming admin can edit/delete all */}
                         <div className="flex items-center gap-3">
                            <button
                               onClick={() => handleEditClick(comment)}
                               className="inline-flex items-center gap-1 text-base text-indigo-600 hover:text-indigo-800 transition-colors" // text-base
                            >
                                <FiEdit size={16}/> Edit
                            </button>
                            <button
                               onClick={() => handleCommentDelete(comment.id)}
                               className="inline-flex items-center gap-1 text-base text-red-600 hover:text-red-800 transition-colors" // text-base
                            >
                               <FiTrash2 size={16}/> Delete
                            </button>
                         </div>
                       </>
                    )}
                  </div>
                </div>
              ))
            ) : (
              // No comments state
              <div className="text-center py-8 px-4 border border-dashed border-gray-300 rounded-md">
                 <FiMessageSquare className="mx-auto h-10 w-10 text-gray-400"/>
                <p className="mt-3 text-base text-gray-500">No comments yet.</p> {/* text-base */}
              </div>
            )}
            {/* General comment fetch error if comments existed but failed to load */}
             {!loadingComments && commentError && comments.length > 0 && (
                <p className="text-base text-red-600 mt-4 flex items-center gap-1"> <FiAlertCircle size={16}/> {commentError}</p> // text-base
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;