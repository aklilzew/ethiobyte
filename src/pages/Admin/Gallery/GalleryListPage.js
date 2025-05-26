import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../api/api'; // Adjust path if needed
import { format } from 'date-fns';
import { FiImage, FiPlus, FiLoader, FiAlertCircle, FiInbox, FiClock, FiEye, FiLayers } from 'react-icons/fi';

const GalleryListPage = () => {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchGalleries = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.gallery.getAll(); // This fetches data from your backend
      // The 'thumbnail' property in response.data should now be like "uploads/image.png"
      setGalleries(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Error fetching galleries:", err);
      setError(err.response?.data?.error || 'Failed to fetch galleries.');
      setGalleries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleries();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return <span className="text-gray-500 italic">N/A</span>;
    try {
      return format(new Date(dateString), 'PPp');
    } catch (e) {
      console.error("Date formatting error:", e);
      return <span className="text-red-500 italic">Invalid Date</span>;
    }
  };

  // This function constructs the full image URL
  const getMediaUrl = (pathFromApi) => { // pathFromApi is gallery.thumbnail
    if (!pathFromApi) return null;
    // If it's already a full URL (e.g., from an external source), use it directly
    if (pathFromApi.startsWith('http://') || pathFromApi.startsWith('https://')) {
      return pathFromApi;
    }
    // Otherwise, construct it using your API base URL
    const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
    
    // These console logs are very important for debugging:
    console.log('Using API Base URL:', baseUrl);
    console.log('Received path for media (gallery.thumbnail):', pathFromApi);
    
    // pathFromApi should ideally be like "uploads/your-image.jpg"
    const finalUrl = pathFromApi ? `${baseUrl}/${pathFromApi.replace(/\\/g, '/')}` : null;
    
    console.log('Constructed Media URL for <img> src:', finalUrl);
    return finalUrl;
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-10rem)] text-center p-10 bg-gray-50">
        <FiLoader className="animate-spin text-5xl text-purple-500 mb-4" />
        <p className="text-2xl text-gray-600">Loading galleries...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6 lg:p-10">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-4xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
          <FiImage className="text-purple-600" />
          Manage Galleries
        </h1>
        <Link
          to="/admin/galleries/new"
          className="inline-flex items-center gap-2 px-5 py-3 bg-purple-600 text-white text-lg font-medium rounded-lg shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition"
          title="Create a new gallery"
        >
          <FiPlus size={22} />
          Create New Gallery
        </Link>
      </div>

      {error && (
        <div
          className="mb-6 flex items-start gap-3 bg-red-100 border border-red-300 text-red-800 p-5 rounded-lg shadow-sm"
          role="alert"
        >
          <FiAlertCircle className="h-6 w-6 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold">Error</h3>
            <p className="text-lg mt-1">{error}</p>
          </div>
        </div>
      )}

      {galleries.length === 0 && !loading && !error ? (
        <div className="text-center py-24 px-6 bg-white rounded-lg shadow border border-gray-200">
          <FiInbox className="mx-auto h-16 w-16 text-gray-400" />
          <h3 className="mt-4 text-2xl font-semibold text-gray-800">No Galleries Found</h3>
          <p className="mt-2 text-lg text-gray-500">You haven't created any galleries yet.</p>
          <Link
            to="/admin/galleries/new"
            className="mt-6 inline-flex items-center gap-2 px-5 py-3 bg-purple-600 text-white text-lg font-medium rounded-lg shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <FiPlus size={22} />
            Create Your First Gallery
          </Link>
        </div>
      ) : (
        galleries.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {galleries.map((gallery) => {
              // gallery.thumbnail is the path received from the backend API
              // e.g., "uploads/image123.jpg"
              const thumbnailUrl = gallery.thumbnail ? getMediaUrl(gallery.thumbnail) : null;
              
              return (
                <div
                  key={gallery.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200/80 hover:shadow-2xl transition-shadow duration-300 flex flex-col group"
                >
                  <div className="relative h-52 w-full bg-gray-200">
                    {thumbnailUrl ? (
                      <img
                        src={thumbnailUrl} // This will be like "http://localhost:5000/uploads/image123.jpg"
                        alt={`${gallery.name || 'Gallery'} thumbnail`}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                          // This runs if the 'src' (thumbnailUrl) fails to load
                          console.error(`Error loading image: ${thumbnailUrl}`, e);
                          e.target.src = 'https://via.placeholder.com/400x300/E2E8F0/9CA3AF?text=No+Image';
                          e.target.alt = 'Error loading image';
                        }}
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-400">
                        <FiImage size={48} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300"></div>
                  </div>

                  <div className="p-5 flex flex-col flex-grow">
                    <h2
                      className="text-xl font-semibold text-gray-800 mb-2 truncate"
                      title={gallery.name}
                    >
                      {gallery.name || 'Untitled Gallery'}
                    </h2>
                    <p className="text-base text-gray-600 mb-4 flex-grow line-clamp-3">
                      {gallery.description || (
                        <span className="italic text-gray-400">No description provided.</span>
                      )}
                    </p>
                    <div className="text-base text-gray-500 border-t pt-3 mt-auto">
                      <div className="flex justify-between items-center gap-4">
                        <span
                          className="inline-flex items-center gap-1.5 whitespace-nowrap"
                          title="Media Items"
                        >
                          <FiLayers size={16} className="text-gray-500" />
                          <span>{gallery.media_count ?? 0} Items</span>
                        </span>
                        <span
                          className="inline-flex items-center gap-1.5 whitespace-nowrap"
                          title="Date Created"
                        >
                          <FiClock size={16} className="text-gray-500" />
                          <span>{formatDate(gallery.created_at)}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 border-t border-gray-200">
                    <Link
                      to={`/admin/galleries/${gallery.id}`}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-transparent text-lg font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition"
                      title="View and manage media in this gallery"
                    >
                      <FiEye size={20} />
                      View & Manage
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
};

export default GalleryListPage;