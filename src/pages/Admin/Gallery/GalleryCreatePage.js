import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/api";
import {
  FiImage,
  FiLoader,
  FiAlertCircle,
  FiCheckCircle,
  FiSave,
  FiArrowLeft,
  FiType,
} from "react-icons/fi";

const GalleryCreatePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!formData.name.trim()) {
      setError("Gallery name is required.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.gallery.create(formData);
      setSuccess(
        `Gallery "${formData.name}" created successfully! ID: ${response.data.galleryId}`
      );
      setFormData({ name: "", description: "" });

      setTimeout(() => {
        navigate(`/admin/galleries/${response.data.galleryId}`);
      }, 2000);
    } catch (err) {
      console.error("Error creating gallery:", err);
      setError(err.response?.data?.error || "Failed to create gallery.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6 lg:p-10">
      <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 border-b border-gray-200 relative">
          <button
            onClick={handleGoBack}
            className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-lg font-medium rounded-lg text-gray-700 bg-white
              hover:bg-gray-50 hover:border-purple-500 hover:text-purple-700
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
              transition duration-300 ease-in-out"
            title="Go back"
          >
            <FiArrowLeft size={20} />
            Back
          </button>
          <div className="text-center pt-8 sm:pt-0">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center justify-center gap-3 transition-colors duration-300 hover:text-purple-600 cursor-default">
              <FiImage className="text-purple-600" />
              Create New Gallery
            </h1>
            <p className="text-lg text-gray-500 mt-1">
              Provide a name and optional description.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
          {success && (
            <div
              className="flex items-start gap-3 bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg text-lg shadow-md"
              role="alert"
            >
              <FiCheckCircle className="h-6 w-6 flex-shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}
          {error && (
            <div
              className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-lg shadow-md"
              role="alert"
            >
              <FiAlertCircle className="h-6 w-6 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label
              htmlFor="name"
              className="block text-lg font-medium text-gray-700 mb-2 transition-colors duration-300 hover:text-purple-600 cursor-pointer"
            >
              Gallery Name <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative rounded-lg shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 pl-3.5 flex items-center">
                <FiType className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="e.g., Summer Vacation 2024"
                className="focus:ring-purple-500 focus:border-purple-500 block w-full pl-12 pr-3 py-3 text-lg border border-gray-300 rounded-lg
                  disabled:bg-gray-50
                  transition duration-300
                  hover:shadow-lg hover:border-purple-600
                  focus:shadow-lg"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-lg font-medium text-gray-700 mb-2 transition-colors duration-300 hover:text-purple-600 cursor-pointer"
            >
              Description (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              disabled={loading}
              placeholder="Add a brief description about this gallery..."
              className="shadow-sm focus:ring-purple-500 focus:border-purple-500 mt-1 block w-full text-lg border border-gray-300 rounded-lg disabled:bg-gray-50 p-3.5
                transition duration-300
                hover:shadow-lg hover:border-purple-600
                focus:shadow-lg"
            />
          </div>

          <div className="pt-8 border-t border-gray-200">
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={handleGoBack}
                disabled={loading}
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 shadow-sm text-lg font-medium rounded-lg text-gray-700 bg-white
                  hover:bg-gray-50 hover:border-purple-500 hover:text-purple-700
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500
                  transition duration-300 ease-in-out disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent shadow-sm text-lg font-medium rounded-lg text-white bg-purple-600
                  hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500
                  transition duration-300 ease-in-out disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <FiLoader className="animate-spin -ml-1 mr-3 h-5 w-5" />
                    Creating...
                  </>
                ) : (
                  <>
                    <FiSave size={20} className="-ml-1 mr-2" />
                    Create Gallery
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

export default GalleryCreatePage;
