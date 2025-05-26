// src/pages/admin/Gallery/GalleryDetailPage.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// Import both the default export (service methods) and the named export (axios instance)
import api, { axiosJsonInstance } from '../../../api/api';
import { format } from 'date-fns';

import {
  FiImage, FiArrowLeft, FiLoader, FiAlertCircle, FiCheckCircle,
  FiTrash2, FiVideo, FiFileText, FiUpload, FiPaperclip,
  FiXCircle, FiCamera, FiLayers, FiPlayCircle
} from 'react-icons/fi';

const VideoThumbnailDisplay = ({ src, alt, caption }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (hasError || !src) {
    return (
      <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-gray-700 text-white p-2">
        <FiVideo size={40} />
        <span className="text-xs mt-2 text-center line-clamp-1">
          {caption || "Video thumbnail unavailable"}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="absolute inset-0 w-full h-full object-cover"
      loading="lazy"
      onError={() => setHasError(true)}
    />
  );
};

const GalleryDetailPage = () => {
  const { id: galleryId } = useParams();
  const navigate = useNavigate();
  const [gallery, setGallery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const getMediaUrl = useCallback((path) => {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }

    let serverRootUrl;
    const apiBaseUrlString = axiosJsonInstance.defaults.baseURL;

    if (apiBaseUrlString) {
      try {
        const apiUrlObject = new URL(apiBaseUrlString);
        serverRootUrl = `${apiUrlObject.protocol}//${apiUrlObject.host}`;
      } catch (e) {
        console.warn(
          "Could not parse apiBaseUrlString to determine server root for media. Using fallback. Error:",
          e
        );
      }
    }

    if (!serverRootUrl) {
      serverRootUrl = process.env.REACT_APP_MEDIA_BASE_URL || process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
    }
    
    const cleanedPath = path.replace(/\\/g, '/').replace(/^\//, '');
    return `${serverRootUrl}/${cleanedPath}`;
  }, []);

  const fetchGalleryData = useCallback(async (showMediaLoading = false) => {
    if (showMediaLoading) {
      setMediaLoading(true);
    } else {
      setLoading(true);
    }
    setError('');
    try {
      const response = await api.gallery.getById(galleryId);
      setGallery(response.data);
    } catch (err) {
      console.error("Error fetching gallery details:", err);
      setError(err.response?.data?.error || 'Failed to load gallery details.');
      setGallery(null);
    } finally {
      setLoading(false);
      setMediaLoading(false);
    }
  }, [galleryId]);

  useEffect(() => {
    fetchGalleryData();
  }, [fetchGalleryData]);

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
    setUploadError('');
    setUploadSuccess('');
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setUploadError('Please select files to upload.');
      return;
    }
    setUploading(true);
    setUploadError('');
    setUploadSuccess('');

    const formData = new FormData();
    selectedFiles.forEach(file => formData.append('media', file)); // 'media' should match backend expectation

    try {
      const response = await api.gallery.addMedia(galleryId, formData);
      setUploadSuccess(`${response.data.count || selectedFiles.length} media item(s) added successfully!`);
      setSelectedFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
      await fetchGalleryData(true);
    } catch (err) {
      console.error("Error uploading media:", err); // Keep detailed console log for debugging
      let errorMessage = 'Failed to upload media.'; // Default message

      if (err.response) {
        // Error from server response (e.g., 4xx, 5xx)
        errorMessage = err.response.data?.error || err.response.data?.message || `Server error: ${err.response.status}`;
      } else if (err.request) {
        // Request was made but no response received
        // This includes network errors like ERR_CONNECTION_REFUSED
        if (err.message && (err.message.toLowerCase().includes("network error") || err.code === "ERR_NETWORK")) {
             errorMessage = "Network Error: Could not connect to the server. Please ensure the server is running and accessible.";
        } else {
            errorMessage = `No response from server. Check network or server status. (${err.message || 'Unknown request error'})`;
        }
      } else {
        // Something happened in setting up the request that triggered an Error
        errorMessage = `Upload setup error: ${err.message}`;
      }
      setUploadError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteMedia = async (mediaId, caption) => {
    const mediaCaption = caption || 'this item';
    if (window.confirm(`Are you sure you want to delete the media item "${mediaCaption}"?`)) {
      setError('');
      try {
        await api.gallery.removeMedia(galleryId, mediaId);
        setUploadSuccess('');
        await fetchGalleryData(true);
      } catch (err) {
        console.error("Error removing media:", err);
        setError(err.response?.data?.error || 'Failed to remove media.');
      }
    }
  };

  const handleGoBack = () => {
    navigate('/admin/galleries');
  };

  const formatBytes = (bytes, decimals = 2) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  if (loading && !gallery) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-10rem)] text-center p-10 bg-gray-50">
        <FiLoader className="animate-spin text-5xl text-purple-500 mb-4" />
        <p className="text-2xl text-gray-600">Loading gallery details...</p>
      </div>
    );
  }

  if (error && !gallery && !uploadError && !uploadSuccess) {
    return (
       <div className="bg-gray-100 min-h-screen p-6 lg:p-10">
         <div className="mb-6 flex flex-col items-center gap-4 bg-red-100 border border-red-300 text-red-800 p-6 rounded-lg shadow-md max-w-lg mx-auto text-center" role="alert">
           <FiAlertCircle className="h-10 w-10 text-red-600" />
           <div>
             <h3 className="text-xl font-semibold mb-2">Error Loading Gallery</h3>
             <p className="text-lg">{error}</p>
              <button
                onClick={handleGoBack}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 border border-transparent text-lg font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <FiArrowLeft size={20}/>
                Back to Galleries
              </button>
           </div>
         </div>
       </div>
    );
  }

  if (!gallery) {
    return (
      <div className="bg-gray-100 min-h-screen p-6 lg:p-10 text-center">
        <p className="text-lg text-gray-600">Gallery data could not be loaded or gallery not found.</p>
        <button onClick={handleGoBack} className="mt-4 inline-block text-lg text-blue-600 hover:underline">Back to Galleries</button>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6 lg:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            <FiImage className="text-purple-600" />
            {gallery.name || 'Gallery Details'}
          </h1>
          <button
            onClick={handleGoBack}
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-300 text-lg font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
            title="Go back to gallery list"
          >
            <FiArrowLeft size={20} />
            Back
          </button>
        </div>

        <div className="mb-8 p-5 bg-white rounded-lg border border-gray-200 shadow-sm">
          <p className="text-lg text-gray-700 leading-relaxed">
            {gallery.description || <span className="italic text-gray-500">No description provided for this gallery.</span>}
          </p>
          {gallery.owner && (
            <p className="text-base text-gray-500 mt-3">
              Owner: <span className="font-medium">{gallery.owner}</span>
            </p>
          )}
          {gallery.created_at && (
            <p className="text-sm text-gray-400 mt-2">
                Created: {format(new Date(gallery.created_at), 'PPpp')}
            </p>
          )}
        </div>

        {error && !uploadError && (
          <div className="mb-6 flex items-start gap-3 bg-red-100 border border-red-300 text-red-800 p-5 rounded-lg shadow-sm" role="alert">
            <FiAlertCircle className="h-6 w-6 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold">Action Error</h3>
              <p className="text-lg mt-1">{error}</p>
            </div>
          </div>
        )}

        <div className="mb-10 p-6 md:p-8 bg-white rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-800 mb-5 flex items-center gap-2">
            <FiUpload /> Add Media to Gallery
          </h2>
          <div className="mb-4">
            <label
              htmlFor="media-upload-input"
              className={`inline-flex items-center gap-2 px-5 py-3 border border-gray-300 rounded-lg shadow-sm text-lg font-medium cursor-pointer hover:bg-gray-50 ${uploading ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700'}`}
            >
              <FiPaperclip size={20}/>
              <span>{selectedFiles.length > 0 ? `${selectedFiles.length} file(s) selected` : 'Choose Files'}</span>
            </label>
            <input
              type="file"
              id="media-upload-input"
              multiple
              onChange={handleFileChange}
              accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt" // Match these with backend upload.js fileFilter
              disabled={uploading}
              ref={fileInputRef}
              className="sr-only"
            />
            {selectedFiles.length > 0 && (
              <button
                onClick={handleUpload}
                disabled={uploading || selectedFiles.length === 0}
                className="ml-4 inline-flex items-center justify-center px-5 py-3 border border-transparent shadow-sm text-lg font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <><FiLoader className="animate-spin -ml-1 mr-3 h-5 w-5" /> Uploading...</>
                ) : (
                  <><FiUpload size={20} className="-ml-1 mr-2" /> Upload</>
                )}
              </button>
            )}
          </div>
          {selectedFiles.length > 0 && !uploading && (
            <div className="mt-4 p-4 border border-dashed border-gray-300 rounded-md bg-gray-50 max-h-40 overflow-y-auto">
              <p className="text-base font-medium text-gray-600 mb-2">Selected files:</p>
              <ul className="list-disc list-inside space-y-1">
                {selectedFiles.map((file, index) => (
                  <li key={index} className="text-base text-gray-700 truncate" title={file.name}>
                    {file.name} <span className="text-gray-500">({formatBytes(file.size)})</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="mt-4 text-lg">
            {uploadError && (
              <p className="text-red-600 bg-red-50 p-3 rounded-md flex items-center gap-2">
                <FiXCircle size={20}/> {uploadError}
              </p>
            )}
            {uploadSuccess && (
              <p className="text-green-600 bg-green-50 p-3 rounded-md flex items-center gap-2">
                <FiCheckCircle size={20}/> {uploadSuccess}
              </p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center justify-between">
            <span className="inline-flex items-center gap-2"><FiLayers/> Gallery Media</span>
            <span className="text-lg font-normal text-gray-500">({gallery.media?.length || 0} items)</span>
          </h2>

          {mediaLoading && !loading ? (
            <div className="flex justify-center items-center py-10">
              <FiLoader className="animate-spin text-3xl text-blue-500 mr-3" />
              <span className="text-lg text-gray-500">Refreshing media list...</span>
            </div>
          ) : gallery.media && gallery.media.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {gallery.media.map((item) => {
                const mainMediaUrl = getMediaUrl(item.file_url);
                const videoDisplayThumbnailUrl = item.media_type === 'video' ? getMediaUrl(item.thumbnail_url) : null;
                const mediaItemCaption = item.caption || item.file_url?.split(/[\\/]/).pop() || 'Media Item';

                return (
                  <div
                    key={item.id || item.file_url}
                    className="relative group/card border border-gray-200 rounded-lg overflow-hidden aspect-square bg-gray-100"
                  >
                    <div className="absolute inset-0 w-full h-full z-0">
                      {item.media_type === 'image' && mainMediaUrl ? (
                        <img
                          src={mainMediaUrl}
                          alt={item.alt_text || mediaItemCaption}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover/card:scale-105"
                          loading="lazy"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/300/E2E8F0/9CA3AF?text=Image%20Error';
                            e.target.alt = 'Error loading image';
                          }}
                        />
                      ) : item.media_type === 'video' ? (
                        <VideoThumbnailDisplay
                          src={videoDisplayThumbnailUrl}
                          alt={`Thumbnail for ${mediaItemCaption}`}
                          caption={mediaItemCaption}
                        />
                      ) : mainMediaUrl ? (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200 text-gray-600 group-hover/card:bg-gray-300 p-2 transition-colors">
                          <FiFileText size={40} />
                          <span className="text-xs mt-2 text-center line-clamp-2 break-all" title={mediaItemCaption}>{mediaItemCaption}</span>
                        </div>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-300 text-gray-500 p-2">
                          <FiAlertCircle size={40} />
                          <span className="text-xs mt-2 text-center">Media unavailable</span>
                        </div>
                      )}
                    </div>

                    {item.media_type === 'video' && mainMediaUrl && (
                      <a 
                        href={mainMediaUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity duration-300 z-10 opacity-0 group-hover/card:opacity-100"
                        title={`Play video: ${mediaItemCaption}`}
                      >
                        <FiPlayCircle size={48} className="text-white" />
                      </a>
                    )}

                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-3 flex justify-between items-end z-20 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                      <p
                        className="text-sm text-white font-medium truncate mr-2"
                        title={mediaItemCaption}
                      >
                        {mediaItemCaption}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteMedia(item.id, mediaItemCaption);
                        }}
                        className="flex-shrink-0 p-1.5 rounded-full bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black/50 focus:ring-red-500"
                        title="Delete Media"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 px-4 border border-dashed border-gray-300 rounded-lg">
              <FiCamera className="mx-auto h-14 w-14 text-gray-400"/>
              <p className="mt-4 text-lg text-gray-500">This gallery is empty.</p>
              <p className="mt-1 text-base text-gray-500">Use the upload section above to add your first media item.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GalleryDetailPage;