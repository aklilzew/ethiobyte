import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../../api/api';

// Import Icons
import { FiEdit, FiLoader, FiAlertCircle, FiSave, FiXCircle, FiArrowLeft, FiFileText, FiType, FiTag } from 'react-icons/fi';

const PostEditPage = () => {
  // --- LOGIC (Unchanged) ---
  const { id: postId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('draft');
  const [currentSlug, setCurrentSlug] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  // *** Remove Simulation Function (Placeholder - Use actual API) ***
  const simulateFetchById = async (id) => {
    console.warn("SIMULATING fetch by ID. Replace with actual API call.")
    try {
      const allPostsResponse = await api.posts.getAll(); // Inefficient/potentially wrong
      const post = allPostsResponse.data.find(p => p.id === parseInt(id));
      if (post) return { data: { ...post, content: post.content || `Content for post ${id}` } };
      else throw new Error("Post not found via simulation");
    } catch (e) { throw e; }
  }
  // *** End Simulation Function ***

  useEffect(() => {
    if (!postId) { navigate('/admin/posts'); return; }
    setLoading(true); setFetchError(null);
    const fetchPostById = async (id) => {
      try {
        // !!! Replace simulateFetchById with actual API call !!!
        const response = await simulateFetchById(postId);
        setTitle(response.data.title);
        setContent(response.data.content);
        setStatus(response.data.status);
        setCurrentSlug(response.data.slug);
      } catch (err) {
        console.error("Failed to fetch post for editing:", err);
        setFetchError(err.response?.data?.error || 'Failed to load post data.');
      } finally { setLoading(false); }
    };
    fetchPostById(postId);
  }, [postId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setError(null);
    if (!title.trim()) { setError('Title cannot be empty.'); setSaving(false); return; }
    const postData = { title, content, status };
    try {
      await api.posts.update(postId, postData);
      navigate('/admin/posts'); // Go back to list
    } catch (err) {
      console.error("Failed to update post:", err);
      setError(err.response?.data?.error || 'Failed to update post.');
      setSaving(false);
    }
  };
  // --- END OF LOGIC ---


  // --- UI Rendering (Redesigned with Standard Font Sizes - text-base) ---

  // Loading State
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-10rem)] text-center p-10 bg-gray-50">
        <FiLoader className="animate-spin text-5xl text-blue-500 mb-4" />
        {/* Using text-xl for loading/error messages */}
        <p className="text-xl text-gray-600">Loading post data...</p>
      </div>
    );
  }

  // Fetch Error State
  if (fetchError) {
    return (
       <div className="bg-gray-50 min-h-screen p-6 lg:p-10">
         <div className="mb-6 flex flex-col items-center gap-4 bg-red-100 border border-red-300 text-red-800 p-6 rounded-lg shadow-md max-w-lg mx-auto text-center" role="alert">
           <FiAlertCircle className="h-10 w-10 text-red-600" />
           <div>
             <h3 className="text-xl font-semibold mb-2">Error Loading Post</h3>
             {/* Using text-base for error detail */}
             <p className="text-base">{fetchError}</p>
              <Link
                to="/admin/posts"
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500" // text-base for button
              >
                <FiArrowLeft size={18}/> {/* Slightly larger icon */}
                Back to Posts List
              </Link>
           </div>
         </div>
       </div>
    );
  }

  // --- Main Form Display ---
  return (
    <div className="bg-gray-100 min-h-screen p-6 lg:p-10">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 border-b border-gray-200">
           <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
             <FiEdit className="text-indigo-600" />
             Edit Post
           </h1>
           {currentSlug && <p className="text-base text-gray-500 mt-1">Slug: {currentSlug}</p>} {/* text-base */}
           {!currentSlug && postId && <p className="text-base text-gray-500 mt-1">Post ID: {postId}</p>} {/* text-base */}
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          {/* Update Error Display */}
          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 p-4 rounded-md text-base" role="alert"> {/* text-base */}
              <FiXCircle className="h-5 w-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title Field */}
          <div>
            {/* Label uses text-base */}
            <label htmlFor="title" className="block text-base font-medium text-gray-700 mb-1.5">
              Title
            </label>
            <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                    <FiType className="h-5 w-5 text-gray-400" />
                </div>
                {/* Input uses text-base */}
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  disabled={saving}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-3 py-2.5 text-base border-gray-300 rounded-md disabled:bg-gray-50" // Changed to text-base, adjusted padding py-2.5
                  placeholder="Enter post title"
                />
            </div>
          </div>

          {/* Content Field */}
          <div>
             {/* Label uses text-base */}
            <label htmlFor="content" className="block text-base font-medium text-gray-700 mb-1.5">
              Content
            </label>
            {/* Textarea uses text-base */}
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="12"
              disabled={saving}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full text-base border border-gray-300 rounded-md disabled:bg-gray-50 p-3" // Changed to text-base, added p-3
              placeholder="Write your post content here..."
            />
          </div>

          {/* Status Field */}
          <div>
             {/* Label uses text-base */}
            <label htmlFor="status" className="block text-base font-medium text-gray-700 mb-1.5">
              Status
            </label>
             <div className="relative rounded-md shadow-sm w-full sm:w-1/2 md:w-1/3">
                <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                    <FiTag className="h-5 w-5 text-gray-400" />
                </div>
                 {/* Select uses text-base */}
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  disabled={saving}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-8 py-2.5 text-base border-gray-300 rounded-md disabled:bg-gray-50 appearance-none bg-white" // Changed to text-base, adjusted padding py-2.5
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
                {/* Optional dropdown arrow */}
             </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 border-t border-gray-200"> {/* Increased pt-6 */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate(currentSlug ? `/admin/posts/view/${currentSlug}` : '/admin/posts')}
                disabled={saving}
                // Button uses text-base, adjusted padding/icon size
                className="inline-flex items-center justify-center px-5 py-2.5 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                <FiArrowLeft size={18} className="-ml-1 mr-2" /> {/* Slightly larger icon */}
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                 // Button uses text-base, adjusted padding/icon size
                className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {saving ? (
                    <>
                      <FiLoader className="animate-spin -ml-1 mr-3 h-5 w-5" /> {/* Adjusted margin/size */}
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave size={18} className="-ml-1 mr-2" /> {/* Slightly larger icon */}
                      Update Post
                    </>
                  )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostEditPage;