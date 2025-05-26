import React, { useState, useEffect, useCallback } from 'react';
import { FaCalendarAlt, FaUser, FaChevronLeft, FaChevronRight, FaPlay, FaTimes, FaImage, FaVideo } from 'react-icons/fa';
import { FiLoader, FiAlertCircle } from 'react-icons/fi';
import api from '../../api/api';
import { format } from 'date-fns';

const ITEMS_PER_PAGE = 3;

const getMediaUrl = (pathFromApi) => {
  console.log("[getMediaUrl] Original path:", pathFromApi);
  
  if (!pathFromApi) {
    console.log("[getMediaUrl] No path provided");
    return null;
  }

  // If it's already a full URL, return as-is
  if (pathFromApi.startsWith('http://') || pathFromApi.startsWith('https://')) {
    console.log("[getMediaUrl] Already a full URL");
    return pathFromApi;
  }

  // For production (using your server.fabe.ethiopbytes.com)
  const baseUrl = 'https://server.fabe.ethiopbytes.com';
  
  // Clean the path (remove leading slashes and normalize)
  const cleanPath = pathFromApi.replace(/^[\\/]+/, '').replace(/\\/g, '/');
  
  const fullUrl = `${baseUrl}/${cleanPath}`;
  console.log("[getMediaUrl] Constructed URL:", fullUrl);
  
  return fullUrl;
};

const GalleryCard = ({ item, onOpenModal }) => {
  const { thumbnailUrl, date, author, title, type } = item;
  
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full transition-shadow duration-300 hover:shadow-xl group">
      <div className="relative w-full h-52">
        <img
          src={thumbnailUrl || 'https://via.placeholder.com/400x300/E2E8F0/9CA3AF?text=No+Image'}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            console.error(`Image load error for: ${e.target.src}`);
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/400x300/E2E8F0/9CA3AF?text=Image+Error';
          }}
        />
        {type === 'video' && (
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <FaPlay className="text-white text-5xl" />
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
          <span className="flex items-center space-x-1.5">
            <FaCalendarAlt className="text-indigo-600" />
            <span>{date}</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <FaUser className="text-indigo-600" />
            <span>{author}</span>
          </span>
        </div>
        <h3 className="font-semibold text-lg text-gray-800 mb-4 flex-grow min-h-[3.5rem]">
          {title}
        </h3>
        <div className="mt-auto pt-2">
          <button
            onClick={() => onOpenModal(item)}
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-60 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            {type === 'video' ? 'Play Video' : 'View More'}
          </button>
        </div>
      </div>
    </div>
  );
};

const LightboxModal = ({ isOpen, onClose, item }) => {
  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !item) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white rounded-lg shadow-xl overflow-hidden max-w-3xl w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-6 flex justify-between items-center border-b">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center">
            {item.type === 'video' ? <FaVideo className="mr-2 text-indigo-600" /> : <FaImage className="mr-2 text-indigo-600" />}
            {item.title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <FaTimes size="1.2em" />
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto flex-grow">
          {item.type === 'image' && (
            <img
              src={item.fullUrl || item.thumbnailUrl || 'https://via.placeholder.com/800x600'}
              alt={item.title}
              className="w-full h-auto max-h-[70vh] object-contain rounded"
              onError={(e) => {
                console.error('Lightbox image failed to load:', e.target.src);
                e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Found';
              }}
            />
          )}
          {item.type === 'video' && (
            <div className="aspect-w-16 aspect-h-9 bg-black rounded flex items-center justify-center">
              {item.videoUrl ? (
                <video 
                  controls 
                  src={item.videoUrl} 
                  className="w-full h-full rounded"
                  onError={(e) => console.error('Video load error:', e.target.src)}
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <p className="text-white text-center p-8">
                  Video source not available
                </p>
              )}
            </div>
          )}
          <div className="mt-4 text-sm text-gray-600">
            <p><FaCalendarAlt className="inline mr-1 text-indigo-500" /> {item.date}</p>
            <p><FaUser className="inline mr-1 text-indigo-500" /> By {item.author}</p>
            {item.description && <p className="mt-2 text-gray-700">{item.description}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

const Gallery = () => {
  const [allImageData, setAllImageData] = useState([]);
  const [allVideoData, setAllVideoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImagePage, setCurrentImagePage] = useState(0);
  const [currentVideoPage, setCurrentVideoPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchAndProcessGalleryItems = useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      const galleriesResponse = await api.gallery.getAll();
      const galleryCollections = Array.isArray(galleriesResponse.data) ? galleriesResponse.data : [];

      if (galleryCollections.length === 0) {
        setLoading(false);
        return;
      }

      const mediaPromises = galleryCollections.map(gallery =>
        api.gallery.getById(gallery.id)
          .then(response => response.data.media || [])
          .catch(err => {
            console.warn(`Failed to fetch media for gallery ${gallery.id}:`, err);
            return [];
          })
      );

      const results = await Promise.all(mediaPromises);
      const allRawMediaItems = results.flat();

      const processedImages = [];
      const processedVideos = [];

      allRawMediaItems.forEach(item => {
        const commonData = {
          id: item.id,
          title: item.caption || 'Untitled Item',
          description: item.alt_text || '',
          author: item.user_id ? `User ${item.user_id}` : 'Admin',
          date: item.created_at ? format(new Date(item.created_at), 'PP') : 'N/A'
        };

        if (item.media_type === 'image') {
          processedImages.push({
            ...commonData,
            type: 'image',
            thumbnailUrl: getMediaUrl(item.file_url),
            fullUrl: getMediaUrl(item.file_url),
          });
        } else if (item.media_type === 'video') {
          processedVideos.push({
            ...commonData,
            type: 'video',
            thumbnailUrl: getMediaUrl(item.thumbnail_url || item.file_url),
            videoUrl: getMediaUrl(item.file_url),
          });
        }
      });

      setAllImageData(processedImages);
      setAllVideoData(processedVideos);

    } catch (err) {
      console.error("Error fetching gallery items:", err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch gallery items');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAndProcessGalleryItems();
  }, [fetchAndProcessGalleryItems]);

  const openModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handlePaginate = (type, direction) => {
    if (type === 'images') {
      setCurrentImagePage(prev => {
        const newPage = prev + direction;
        const totalPages = Math.ceil(allImageData.length / ITEMS_PER_PAGE);
        return newPage >= 0 && newPage < totalPages ? newPage : prev;
      });
    } else if (type === 'videos') {
      setCurrentVideoPage(prev => {
        const newPage = prev + direction;
        const totalPages = Math.ceil(allVideoData.length / ITEMS_PER_PAGE);
        return newPage >= 0 && newPage < totalPages ? newPage : prev;
      });
    }
  };

  const displayedImageData = allImageData.slice(
    currentImagePage * ITEMS_PER_PAGE,
    (currentImagePage + 1) * ITEMS_PER_PAGE
  );

  const displayedVideoData = allVideoData.slice(
    currentVideoPage * ITEMS_PER_PAGE,
    (currentVideoPage + 1) * ITEMS_PER_PAGE
  );

  const NavigationButtons = ({ onPrev, onNext, currentPage, totalPages, itemType }) => (
    <div className="flex space-x-3 justify-center">
      <button
        onClick={onPrev}
        disabled={currentPage === 0}
        className="bg-white text-indigo-600 p-3 rounded-full shadow-md hover:bg-indigo-50 transition-all disabled:opacity-50"
      >
        <FaChevronLeft size="1.1em" />
      </button>
      <button
        onClick={onNext}
        disabled={currentPage >= totalPages - 1}
        className="bg-white text-indigo-600 p-3 rounded-full shadow-md hover:bg-indigo-50 transition-all disabled:opacity-50"
      >
        <FaChevronRight size="1.1em" />
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center p-10 bg-gray-50">
        <FiLoader className="animate-spin text-5xl text-indigo-600 mb-4" />
        <p className="text-xl text-gray-700">Loading Gallery...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center p-10 bg-red-50">
        <FiAlertCircle className="text-5xl text-red-500 mb-4" />
        <p className="text-xl font-semibold text-red-700">Oops! Something went wrong.</p>
        <p className="text-md text-red-600 mt-2 mb-6">{error}</p>
        <button
          onClick={fetchAndProcessGalleryItems}
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-indigo-600 font-semibold uppercase mb-2">
              Image Gallery
            </p>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Our Previous Works
            </h2>
            {allImageData.length > ITEMS_PER_PAGE && (
              <NavigationButtons
                onPrev={() => handlePaginate('images', -1)}
                onNext={() => handlePaginate('images', 1)}
                currentPage={currentImagePage}
                totalPages={Math.ceil(allImageData.length / ITEMS_PER_PAGE)}
                itemType="Images"
              />
            )}
          </div>

          {displayedImageData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedImageData.map((item) => (
                <GalleryCard
                  key={`img-${item.id}`}
                  item={item}
                  onOpenModal={openModal}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No images to display.</p>
          )}
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-indigo-600 font-semibold uppercase mb-2">
              Video Showcase
            </p>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Featured Videos
            </h2>
            {allVideoData.length > ITEMS_PER_PAGE && (
              <NavigationButtons
                onPrev={() => handlePaginate('videos', -1)}
                onNext={() => handlePaginate('videos', 1)}
                currentPage={currentVideoPage}
                totalPages={Math.ceil(allVideoData.length / ITEMS_PER_PAGE)}
                itemType="Videos"
              />
            )}
          </div>

          {displayedVideoData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedVideoData.map((item) => (
                <GalleryCard
                  key={`vid-${item.id}`}
                  item={item}
                  onOpenModal={openModal}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No videos to display.</p>
          )}
        </div>
      </section>

      <LightboxModal isOpen={isModalOpen} onClose={closeModal} item={selectedItem} />
    </>
  );
};

export default Gallery;