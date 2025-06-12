import React, { useState, useEffect } from "react";
import {
  FaMapMarkerAlt,
  FaBriefcase,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import heroBgImage from "../../image/fabe2.png";
import API from "../../api/api"; // Import your API configuration

const JobPost = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchJobs = async (page = 1) => {
    try {
      setLoading(true);
      const response = await API.jobs.getAll(); // Update this if your API supports pagination
      setJobs(response.data);
      // If backend supports pagination, update totalPages accordingly:
      // setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch jobs. Please try again later.");
      setLoading(false);
      console.error("Error fetching jobs:", err);
    }
  };

  useEffect(() => {
    fetchJobs(currentPage);
  }, [currentPage]);

  const handlePrevClick = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center py-24 md:py-32 text-center text-white mt-16"
        style={{ backgroundImage: `url(${heroBgImage})` }}
      >
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="relative z-10 container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold transition duration-300 hover:text-orange-600 cursor-pointer">
            Job Post
          </h1>
        </div>
      </div>

      {/* Job Listings Section */}
      <div className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 md:mb-16">
            <div className="text-center md:text-left mb-6 md:mb-0">
              <p className="text-orange-600 font-semibold uppercase tracking-wider mb-2 text-sm md:text-base transition duration-300 hover:text-orange-700 cursor-pointer">
                Career Opportunities
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 transition duration-300 hover:text-orange-600 cursor-pointer">
                Our Latest Job Post
              </h2>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handlePrevClick}
                disabled={currentPage === 1}
                aria-label="Previous Job Posts"
                className={`p-2 border-2 border-red-500 text-red-500 rounded-sm hover:bg-red-500 hover:text-white transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-300 ${
                  currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={handleNextClick}
                disabled={currentPage === totalPages}
                aria-label="Next Job Posts"
                className={`p-2 border-2 border-red-500 text-red-500 rounded-sm hover:bg-red-500 hover:text-white transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-300 ${
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                <FaChevronRight />
              </button>
            </div>
          </div>

          {jobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  tabIndex={0}
                  aria-label={`Job Post: ${job.title}`}
                  className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col cursor-pointer
                             transform transition duration-300
                             hover:-translate-y-2 hover:bg-orange-600 hover:text-white"
                >
                  <div className="p-6 flex flex-col flex-grow">
                    <div
                      className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm mb-5
                                 transition-colors duration-300
                                 text-gray-600"
                    >
                      <span className="flex items-center">
                        <FaMapMarkerAlt className="mr-2 text-orange-600 transition-colors duration-300" />
                        {job.location}
                      </span>
                      <span className="flex items-center">
                        <FaBriefcase className="mr-2 text-orange-600 transition-colors duration-300" />
                        {job.job_type}
                      </span>
                    </div>

                    <h3
                      className="text-xl font-semibold mb-6 flex-grow transition-all duration-300"
                      style={{
                        transitionProperty: "color, font-weight, font-size",
                      }}
                    >
                      {job.title}
                    </h3>

                    <div className="text-sm mb-3 text-gray-600 transition-colors duration-300">
                      <strong>Salary:</strong>{" "}
                      {job.salary_range || "Negotiable"}
                    </div>

                    <div className="text-sm mb-6 text-gray-600 transition-colors duration-300">
                      <strong>Deadline:</strong>{" "}
                      {new Date(job.application_deadline).toLocaleDateString()}
                    </div>

                    {job.categories &&
                      Array.isArray(job.categories) &&
                      job.categories.length > 0 && (
                        <div className="mt-auto">
                          <div className="flex flex-wrap gap-2">
                            {job.categories.map((category, index) => (
                              <span
                                key={index}
                                className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded transition-colors duration-300 cursor-default"
                              >
                                {category}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                No job openings available at the moment.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobPost;
