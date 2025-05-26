import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../api/api';
import { format } from 'date-fns';
import { FiBriefcase, FiPlus, FiEdit, FiTrash2, FiLoader, FiAlertCircle, FiInbox, FiUser, FiMapPin, FiClock, FiCalendar, FiTag } from 'react-icons/fi';

const JobPostListPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.jobs.getAll();
      setJobs(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Error fetching job posts:", err);
      setError(err.response?.data?.error || 'Failed to fetch job posts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete the job post "${title}"?`)) {
      try {
        await api.jobs.delete(id);
        setJobs(prevJobs => prevJobs.filter(job => job.id !== id));
        alert('Job post deleted successfully.');
      } catch (err) {
        console.error("Error deleting job post:", err);
        setError(err.response?.data?.error || 'Failed to delete job post.');
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return <span className="text-gray-500 italic">N/A</span>;
    try {
      return format(new Date(dateString), 'PP');
    } catch (e) {
      return <span className="text-red-500 italic">Invalid Date</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-10rem)] text-center p-10 bg-gray-50">
        <FiLoader className="animate-spin text-5xl text-blue-500 mb-4" />
        <p className="text-2xl text-gray-600">Loading job posts...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6 lg:p-10">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-4xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
          <FiBriefcase className="text-indigo-600" />
          Manage Job Posts
        </h1>
        <Link
          to="/admin/jobs/new"
          className="inline-flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white text-lg font-medium rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
          title="Create a new job post"
        >
          <FiPlus size={22} />
          Create New Job Post
        </Link>
      </div>

      {error && (
        <div className="mb-6 flex items-start gap-3 bg-red-100 border border-red-300 text-red-800 p-5 rounded-lg shadow-sm" role="alert">
          <FiAlertCircle className="h-6 w-6 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold">Error</h3>
            <p className="text-lg mt-1">{error}</p>
          </div>
        </div>
      )}

      <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full table-fixed divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th scope="col" className="w-[8%] px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  ID
                </th>
                <th scope="col" className="w-[20%] px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" className="w-[15%] px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <FiUser size={16} />
                    Employer
                  </div>
                </th>
                <th scope="col" className="w-[15%] px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <FiMapPin size={16} />
                    Location
                  </div>
                </th>
                <th scope="col" className="w-[10%] px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <FiTag size={16} />
                    Type
                  </div>
                </th>
                <th scope="col" className="w-[12%] px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <FiClock size={16} />
                    Created
                  </div>
                </th>
                <th scope="col" className="w-[12%] px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <FiCalendar size={16} />
                    Deadline
                  </div>
                </th>
                <th scope="col" className="w-[8%] px-6 py-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {jobs.length === 0 && !loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-24 text-center text-xl text-gray-500">
                    <FiInbox className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    No job posts found.
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-indigo-50/30 transition-colors duration-200 ease-in-out">
                    <td className="px-6 py-5 whitespace-nowrap text-lg font-medium text-gray-500">{job.id}</td>
                    <td className="px-6 py-5 text-lg font-semibold text-gray-900">{job.title}</td>
                    <td className="px-6 py-5 text-lg text-gray-700">
                      {job.employer || <span className="text-gray-400 italic">N/A</span>}
                    </td>
                    <td className="px-6 py-5 text-lg text-gray-700">
                      {job.location || <span className="text-gray-400 italic">N/A</span>}
                    </td>
                    <td className="px-6 py-5 text-lg text-gray-700">
                      {job.job_type || <span className="text-gray-400 italic">N/A</span>}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-lg text-gray-500">
                      {formatDate(job.created_at)}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-lg text-gray-500">
                      {formatDate(job.application_deadline)}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-center text-lg">
                      <div className="flex items-center justify-center gap-x-4">
                        <Link
                          to={`/admin/jobs/${job.id}/edit`}
                          className="inline-flex items-center gap-1.5 text-indigo-700 hover:text-indigo-900 transition duration-150 ease-in-out px-3 py-2 rounded-md hover:bg-indigo-100 text-lg font-medium"
                          title="Edit this job post"
                        >
                          <FiEdit size={20} />
                          <span>Edit</span>
                        </Link>
                        <button
                          onClick={() => handleDelete(job.id, job.title)}
                          className="inline-flex items-center gap-1.5 text-red-600 hover:text-red-900 transition duration-150 ease-in-out px-3 py-2 rounded-md hover:bg-red-100 text-lg font-medium"
                          title="Delete this job post"
                        >
                          <FiTrash2 size={20} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default JobPostListPage;