import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Added Link
import api from '../../../api/api'; // Adjust path if needed

// Import Icons
import { FiBriefcase, FiPlusSquare, FiLoader, FiAlertCircle, FiCheckCircle, FiSave, FiXCircle, FiArrowLeft, FiType, FiMapPin, FiTag, FiDollarSign, FiCalendar, FiList } from 'react-icons/fi';

const JobCreatePage = () => {
  // --- LOGIC (Unchanged) ---
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    job_type: 'Full-time',
    salary_range: '',
    application_deadline: '',
    categories: [], // Expecting array of category IDs
  });
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(false); // Renamed saving to loading for consistency
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      // Add loading state for categories if needed
      try {
        const response = await api.jobs.getCategories();
        if (Array.isArray(response.data)) {
          setAllCategories(response.data);
        } else {
          console.error("Received non-array data for categories:", response.data);
          setError('Failed to load categories properly.');
          setAllCategories([]);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError(err.response?.data?.error || 'Failed to load job categories.');
      }
      // Reset category loading state if added
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
      parseInt(option.value, 10) // Ensure IDs are numbers
    );
    setFormData((prevData) => ({
      ...prevData,
      categories: selectedIds,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!formData.title || !formData.description || !formData.application_deadline) {
        setError('Please fill in Title, Description, and Application Deadline.');
        setLoading(false);
        return;
    }

    // Ensure categories is an array of numbers if API expects that
    const payload = {
        ...formData,
        categories: formData.categories.map(id => Number(id))
    };

    try {
      const response = await api.jobs.create(payload); // Send processed payload
      setSuccess(`Job post "${formData.title}" created successfully! ID: ${response.data.jobId}`);
      setLoading(false);
      setFormData({ // Reset form
        title: '', description: '', location: '', job_type: 'Full-time',
        salary_range: '', application_deadline: '', categories: [],
      });
      setTimeout(() => {
        navigate('/admin/jobs'); // Navigate after success
      }, 2500); // Increased delay slightly
    } catch (err) {
      console.error("Error creating job post:", err);
      setError(err.response?.data?.error || 'Failed to create job post.');
      setLoading(false);
    }
  };

  // Using navigate(-1) for back button
  const handleGoBack = () => {
    navigate(-1);
  };
  // --- END OF LOGIC ---


  // --- UI Rendering (Enhanced with Tailwind, text-lg focus) ---
  return (
    <div className="bg-gray-100 min-h-screen p-6 lg:p-10">
      {/* Form Card Container */}
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        {/* Form Header */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 border-b border-gray-200 relative">
           {/* Back Button - Positioned top-left */}
           <button
                onClick={handleGoBack}
                className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition" // text-base
                title="Go back"
            >
                <FiArrowLeft size={18} />
                Back
           </button>
           <div className="text-center pt-8 sm:pt-0"> {/* Add padding top on small screens if back button pushes title */}
               <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center justify-center gap-3">
                 <FiBriefcase className="text-indigo-600" />
                 Create New Job Post
               </h1>
               <p className="text-lg text-gray-500 mt-1">Enter the details for the new job opening.</p> {/* text-lg */}
           </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          {/* Success Message */}
          {success && (
            <div className="flex items-start gap-3 bg-green-50 border border-green-200 text-green-700 p-4 rounded-md text-lg" role="alert"> {/* text-lg */}
              <FiCheckCircle className="h-6 w-6 flex-shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}
          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 p-4 rounded-md text-lg" role="alert"> {/* text-lg */}
              <FiAlertCircle className="h-6 w-6 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Title Field */}
          <div>
             {/* Label uses text-lg */}
            <label htmlFor="title" className="block text-lg font-medium text-gray-700 mb-1.5">
              Job Title <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                    <FiType className="h-5 w-5 text-gray-400" />
                </div>
                 {/* Input uses text-lg */}
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-3 py-3 text-lg border-gray-300 rounded-md disabled:bg-gray-50" // text-lg, adjusted padding py-3
                  placeholder="e.g., Senior Software Engineer"
                />
            </div>
          </div>

          {/* Description Field */}
          <div>
             {/* Label uses text-lg */}
            <label htmlFor="description" className="block text-lg font-medium text-gray-700 mb-1.5">
              Description <span className="text-red-500 ml-1">*</span>
            </label>
             {/* Textarea uses text-lg */}
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="8" // Adjusted rows
              required
              disabled={loading}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full text-lg border border-gray-300 rounded-md disabled:bg-gray-50 p-3" // text-lg, p-3
              placeholder="Provide details about the role, responsibilities, qualifications..."
            />
          </div>

          {/* Location Field */}
          <div>
             {/* Label uses text-lg */}
            <label htmlFor="location" className="block text-lg font-medium text-gray-700 mb-1.5">
              Location
            </label>
            <div className="relative rounded-md shadow-sm">
                 <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                    <FiMapPin className="h-5 w-5 text-gray-400" />
                 </div>
                 {/* Input uses text-lg */}
                 <input
                   type="text"
                   id="location"
                   name="location"
                   value={formData.location}
                   onChange={handleChange}
                   disabled={loading}
                   className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-3 py-3 text-lg border-gray-300 rounded-md disabled:bg-gray-50" // text-lg, py-3
                   placeholder="e.g., New York, NY or Remote"
                 />
            </div>
          </div>

          {/* Job Type Field */}
          <div>
             {/* Label uses text-lg */}
            <label htmlFor="job_type" className="block text-lg font-medium text-gray-700 mb-1.5">
              Job Type
            </label>
             <div className="relative rounded-md shadow-sm w-full sm:w-1/2 md:w-1/3">
                 <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                    <FiTag className="h-5 w-5 text-gray-400" />
                 </div>
                 {/* Select uses text-lg */}
                 <select
                   id="job_type"
                   name="job_type"
                   value={formData.job_type}
                   onChange={handleChange}
                   disabled={loading}
                   className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-8 py-3 text-lg border-gray-300 rounded-md disabled:bg-gray-50 appearance-none bg-white" // text-lg, py-3
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
             {/* Label uses text-lg */}
            <label htmlFor="salary_range" className="block text-lg font-medium text-gray-700 mb-1.5">
              Salary Range (Optional)
            </label>
            <div className="relative rounded-md shadow-sm">
                 <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                    <FiDollarSign className="h-5 w-5 text-gray-400" />
                 </div>
                 {/* Input uses text-lg */}
                 <input
                   type="text"
                   id="salary_range"
                   name="salary_range"
                   value={formData.salary_range}
                   onChange={handleChange}
                   disabled={loading}
                   className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-3 py-3 text-lg border-gray-300 rounded-md disabled:bg-gray-50" // text-lg, py-3
                   placeholder="e.g., $80,000 - $100,000 per year"
                 />
            </div>
          </div>

          {/* Application Deadline Field */}
          <div>
             {/* Label uses text-lg */}
            <label htmlFor="application_deadline" className="block text-lg font-medium text-gray-700 mb-1.5">
              Application Deadline <span className="text-red-500 ml-1">*</span>
            </label>
             <div className="relative rounded-md shadow-sm w-full sm:w-1/2 md:w-1/3">
                 <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                    <FiCalendar className="h-5 w-5 text-gray-400" />
                 </div>
                  {/* Input uses text-lg */}
                 <input
                   type="date"
                   id="application_deadline"
                   name="application_deadline"
                   value={formData.application_deadline}
                   onChange={handleChange}
                   required
                   disabled={loading}
                   className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-3 py-3 text-lg border-gray-300 rounded-md disabled:bg-gray-50" // text-lg, py-3
                 />
            </div>
          </div>

          {/* Categories Field */}
          <div>
             {/* Label uses text-lg */}
            <label htmlFor="categories" className="block text-lg font-medium text-gray-700 mb-1.5">
              Categories (Optional)
            </label>
            {allCategories.length > 0 ? (
              <>
                {/* Select uses text-lg */}
                <select
                  id="categories"
                  name="categories"
                  multiple
                  value={formData.categories} // Value should be array of selected IDs
                  onChange={handleCategoryChange}
                  disabled={loading}
                   // Adjusted styling for multi-select
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full text-lg border border-gray-300 rounded-md disabled:bg-gray-50 p-3 h-32" // text-lg, p-3, h-32
                >
                  {allCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <small className="block mt-2 text-base text-gray-500"> {/* text-base */}
                  Hold Ctrl (or Cmd on Mac) to select multiple categories.
                </small>
              </>
            ) : (
              <p className="text-lg text-gray-500 italic mt-2">Loading categories or none available...</p> // text-lg
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-6 border-t border-gray-200">
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={handleGoBack} // Use the back handler
                disabled={loading}
                 // Button uses text-lg
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 shadow-sm text-lg font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50" // text-lg, py-3
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                 // Button uses text-lg
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent shadow-sm text-lg font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50" // text-lg, py-3
              >
                {loading ? (
                    <>
                      <FiLoader className="animate-spin -ml-1 mr-3 h-5 w-5" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <FiSave size={20} className="-ml-1 mr-2" /> {/* Increased icon size */}
                      Create Job Post
                    </>
                  )}
              </button>
            </div>
          </div>
        </form>
      </div> {/* End Form Card Container */}
      {/* Removed the <style jsx> block */}
    </div>
  );
};

export default JobCreatePage;