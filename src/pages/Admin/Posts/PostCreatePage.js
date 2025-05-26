import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Added Link for potential header back button
import api from '../../../api/api';

// Import Icons
import { FiPlusSquare, FiLoader, FiAlertCircle, FiSave, FiXCircle, FiArrowLeft, FiType, FiFileText, FiTag } from 'react-icons/fi';

const PostCreatePage = () => {
  // --- LOGIC (Unchanged) ---
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('draft');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    if (!title.trim()) {
      setError('Title is required.');
      setSaving(false);
      return;
    }

    const postData = { title, content, status };

    try {
      const response = await api.posts.create(postData);
      console.log('Post created:', response.data);

      // Navigation logic remains the same
      if (response.data.slug) {
         navigate(`/admin/posts/view/${response.data.slug}`);
      } else {
         navigate('/admin/posts');
      }

    } catch (err) {
      console.error("Failed to create post:", err);
      if (err.response?.data?.error === 'Slug already exists') {
         setError('A post with a similar title already exists (resulting in the same slug). Please choose a different title.');
      } else {
         setError(err.response?.data?.error || 'Failed to create post. Please try again.');
      }
      setSaving(false);
    }
    // Note: setSaving(false) is intentionally omitted on success because we navigate away
  };
  // --- END OF LOGIC ---


  // --- UI Rendering (Redesigned with Tailwind, text-base focus) ---
  return (
    <div className="bg-gray-100 min-h-screen p-6 lg:p-10">
      {/* Form Card Container */}
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        {/* Form Header */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 border-b border-gray-200">
           <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
             <FiPlusSquare className="text-blue-600" />
             Create New Post
           </h1>
           <p className="text-base text-gray-500 mt-1">Fill in the details below to create a new post.</p> {/* text-base */}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          {/* Error Display */}
          {error && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 p-4 rounded-md text-base" role="alert"> {/* text-base */}
              <FiAlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
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
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2.5 text-base border-gray-300 rounded-md disabled:bg-gray-50" // text-base, adjusted padding
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
              rows="15" // Kept original rows
              disabled={saving}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full text-base border border-gray-300 rounded-md disabled:bg-gray-50 p-3" // text-base, p-3
              placeholder="Write your post content here... (Markdown or plain text)"
            />
            {/* Suggestion for Rich Text Editor */}
            <p className="mt-2 text-sm text-gray-500">Consider using a more advanced editor for formatting.</p>
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
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-8 py-2.5 text-base border-gray-300 rounded-md disabled:bg-gray-50 appearance-none bg-white" // text-base, adjusted padding
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  {/* Add other relevant statuses */}
                </select>
             </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 border-t border-gray-200">
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate('/admin/posts')} // Go back button
                disabled={saving}
                 // Button uses text-base
                className="inline-flex items-center justify-center px-5 py-2.5 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <FiArrowLeft size={18} className="-ml-1 mr-2" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                 // Button uses text-base
                className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {saving ? (
                    <>
                      <FiLoader className="animate-spin -ml-1 mr-3 h-5 w-5" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <FiSave size={18} className="-ml-1 mr-2" />
                      Create Post
                    </>
                  )}
              </button>
            </div>
          </div>
        </form>
      </div> {/* End Form Card Container */}
    </div>
  );
};

export default PostCreatePage;