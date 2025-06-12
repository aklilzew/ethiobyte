import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Removed unused Link
import api from "../../../api/api"; // Adjust path if needed

// Import Icons
import {
  FiBriefcase,
  FiLoader,
  FiAlertCircle,
  FiCheckCircle,
  FiSave,
  FiArrowLeft,
  FiType,
  FiMapPin,
  FiTag,
  FiDollarSign,
  FiCalendar,
} from "react-icons/fi";

const JobCreatePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    job_type: "Full-time",
    salary_range: "",
    application_deadline: "",
    categories: [],
  });
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.jobs.getCategories();
        if (Array.isArray(response.data)) {
          setAllCategories(response.data);
        } else {
          console.error(
            "Received non-array data for categories:",
            response.data
          );
          setError("Failed to load categories properly.");
          setAllCategories([]);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError(err.response?.data?.error || "Failed to load job categories.");
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCategoryChange = (e) => {
    const selectedIds = Array.from(e.target.selectedOptions, (option) =>
      parseInt(option.value, 10)
    );
    setFormData((prevData) => ({
      ...prevData,
      categories: selectedIds,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (
      !formData.title ||
      !formData.description ||
      !formData.application_deadline
    ) {
      setError("Please fill in Title, Description, and Application Deadline.");
      setLoading(false);
      return;
    }

    const payload = {
      ...formData,
      categories: formData.categories.map((id) => Number(id)),
    };

    try {
      const response = await api.jobs.create(payload);
      setSuccess(
        `Job post "${formData.title}" created successfully! ID: ${response.data.jobId}`
      );
      setLoading(false);
      setFormData({
        title: "",
        description: "",
        location: "",
        job_type: "Full-time",
        salary_range: "",
        application_deadline: "",
        categories: [],
      });
      setTimeout(() => {
        navigate("/admin/jobs");
      }, 2500);
    } catch (err) {
      console.error("Error creating job post:", err);
      setError(err.response?.data?.error || "Failed to create job post.");
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6 lg:p-10">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 border-b border-gray-200 relative">
          <button
            onClick={handleGoBack}
            className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white 
            hover:bg-indigo-100 hover:border-indigo-400 hover:text-indigo-700 
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
            title="Go back"
          >
            <FiArrowLeft size={18} />
            Back
          </button>
          <div className="text-center pt-8 sm:pt-0">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center justify-center gap-3">
              <FiBriefcase className="text-indigo-600" />
              Create New Job Post
            </h1>
            <p className="text-lg text-gray-500 mt-1">
              Enter the details for the new job opening.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          {success && (
            <div
              className="flex items-start gap-3 bg-green-50 border border-green-200 text-green-700 p-4 rounded-md text-lg"
              role="alert"
              aria-live="polite"
            >
              <FiCheckCircle className="h-6 w-6 flex-shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}
          {error && (
            <div
              className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 p-4 rounded-md text-lg"
              role="alert"
              aria-live="polite"
            >
              <FiAlertCircle className="h-6 w-6 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Title Field */}
          <div>
            <label
              htmlFor="title"
              className="block text-lg font-medium text-gray-700 mb-1.5"
            >
              Job Title <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                <FiType className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="e.g., Senior Software Engineer"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-3 py-3 text-lg border border-gray-300 rounded-md disabled:bg-gray-50
                  hover:border-indigo-400 hover:ring-1 hover:ring-indigo-400 transition"
              />
            </div>
          </div>

          {/* Description Field */}
          <div>
            <label
              htmlFor="description"
              className="block text-lg font-medium text-gray-700 mb-1.5"
            >
              Description <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="8"
              required
              disabled={loading}
              placeholder="Provide details about the role, responsibilities, qualifications..."
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full text-lg border border-gray-300 rounded-md disabled:bg-gray-50 p-3
                hover:border-indigo-400 hover:ring-1 hover:ring-indigo-400 transition"
            />
          </div>

          {/* Location Field */}
          <div>
            <label
              htmlFor="location"
              className="block text-lg font-medium text-gray-700 mb-1.5"
            >
              Location
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                <FiMapPin className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                disabled={loading}
                placeholder="e.g., New York, NY or Remote"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-3 py-3 text-lg border border-gray-300 rounded-md disabled:bg-gray-50
                  hover:border-indigo-400 hover:ring-1 hover:ring-indigo-400 transition"
              />
            </div>
          </div>

          {/* Job Type Field */}
          <div>
            <label
              htmlFor="job_type"
              className="block text-lg font-medium text-gray-700 mb-1.5"
            >
              Job Type
            </label>
            <div className="relative rounded-md shadow-sm w-full sm:w-1/2 md:w-1/3">
              <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                <FiTag className="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="job_type"
                name="job_type"
                value={formData.job_type}
                onChange={handleChange}
                disabled={loading}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-8 py-3 text-lg border border-gray-300 rounded-md disabled:bg-gray-50 appearance-none bg-white
                  hover:border-indigo-400 hover:ring-1 hover:ring-indigo-400 transition"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Temporary">Temporary</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
          </div>

          {/* Salary Range Field */}
          <div>
            <label
              htmlFor="salary_range"
              className="block text-lg font-medium text-gray-700 mb-1.5"
            >
              Salary Range (Optional)
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                <FiDollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="salary_range"
                name="salary_range"
                value={formData.salary_range}
                onChange={handleChange}
                disabled={loading}
                placeholder="e.g., $80,000 - $100,000 per year"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-3 py-3 text-lg border border-gray-300 rounded-md disabled:bg-gray-50
                  hover:border-indigo-400 hover:ring-1 hover:ring-indigo-400 transition"
              />
            </div>
          </div>

          {/* Application Deadline Field */}
          <div>
            <label
              htmlFor="application_deadline"
              className="block text-lg font-medium text-gray-700 mb-1.5"
            >
              Application Deadline <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative rounded-md shadow-sm w-full sm:w-1/2 md:w-1/3">
              <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                <FiCalendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                id="application_deadline"
                name="application_deadline"
                value={formData.application_deadline}
                onChange={handleChange}
                required
                disabled={loading}
                min={new Date().toISOString().split("T")[0]}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-3 py-3 text-lg border border-gray-300 rounded-md disabled:bg-gray-50
                  hover:border-indigo-400 hover:ring-1 hover:ring-indigo-400 transition"
              />
            </div>
          </div>

          {/* Categories Field */}
          <div>
            <label
              htmlFor="categories"
              className="block text-lg font-medium text-gray-700 mb-1.5"
            >
              Categories (Optional)
            </label>
            {allCategories.length > 0 ? (
              <>
                <select
                  id="categories"
                  name="categories"
                  multiple
                  value={formData.categories}
                  onChange={handleCategoryChange}
                  disabled={loading}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full text-lg border border-gray-300 rounded-md disabled:bg-gray-50 p-3 h-32
                    hover:border-indigo-400 hover:ring-1 hover:ring-indigo-400 transition"
                >
                  {allCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <small className="block mt-2 text-base text-gray-500">
                  Hold Ctrl (or Cmd on Mac) to select multiple categories.
                </small>
              </>
            ) : (
              <p className="text-lg text-gray-500 italic mt-2">
                Loading categories or none available...
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={handleGoBack}
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-md text-lg font-medium text-gray-700 bg-white
                hover:bg-gray-100 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-3 border border-transparent rounded-md text-lg font-semibold text-white bg-indigo-600
                hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin h-5 w-5" />
                  Saving...
                </>
              ) : (
                <>
                  <FiSave />
                  Save Job
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobCreatePage;
