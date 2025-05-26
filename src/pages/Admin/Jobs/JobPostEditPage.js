import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../../api/api';

const JobPostEditPage = () => {
  // Get 'id' from URL params. If it's 'new', we're creating.
  const { id } = useParams();
  const navigate = useNavigate();
  const isCreating = id === 'new'; // Check if we are creating a new post

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    job_type: 'Full-time', // Default value
    salary_range: '',
    application_deadline: '',
    categories: [], // Store selected category IDs
  });
  const [allCategories, setAllCategories] = useState([]); // List of available categories
  const [loading, setLoading] = useState(!isCreating); // Only load if editing
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pageTitle, setPageTitle] = useState('');

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.jobs.getCategories();
        setAllCategories(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError('Failed to load job categories.');
      }
    };
    fetchCategories();
  }, []); // Run only once on mount

  // Fetch job data if editing
  const fetchJobData = useCallback(async () => {
    if (isCreating || !id) return; // Don't fetch if creating or id is invalid

    setLoading(true);
    setError('');
    try {
      // Use the NEWLY ADDED api.jobs.getById
      const response = await api.jobs.getById(id);
      const jobData = response.data;

      // Prepare form data (handle potential null values and date format)
      setFormData({
        title: jobData.title || '',
        description: jobData.description || '',
        location: jobData.location || '',
        job_type: jobData.job_type || 'Full-time',
        salary_range: jobData.salary_range || '',
        // Input type="date" expects 'YYYY-MM-DD' format
        application_deadline: jobData.application_deadline
          ? new Date(jobData.application_deadline).toISOString().split('T')[0]
          : '',
        // Assuming backend returns category IDs associated with the job
        categories: jobData.category_ids || [], // Adjust if backend sends category names/objects
      });
    } catch (err) {
      console.error(`Error fetching job post ${id}:`, err);
      setError(err.response?.data?.error || `Failed to load job post ${id}.`);
    } finally {
      setLoading(false);
    }
  }, [id, isCreating]); // Depend on id and isCreating

  useEffect(() => {
    setPageTitle(isCreating ? 'Create New Job Post' : 'Edit Job Post');
    if (!isCreating) {
      fetchJobData();
    } else {
      // Reset form if navigating from edit to create
      setFormData({
        title: '', description: '', location: '', job_type: 'Full-time',
        salary_range: '', application_deadline: '', categories: [],
      });
      setLoading(false);
    }
  }, [id, isCreating, fetchJobData]); // Rerun if ID changes (e.g., navigation)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const categoryId = parseInt(e.target.value, 10); // Ensure it's a number
    const isChecked = e.target.checked;

    setFormData(prev => {
      const currentCategories = prev.categories || [];
      if (isChecked) {
        // Add category ID if not already present
        return { ...prev, categories: [...new Set([...currentCategories, categoryId])] };
      } else {
        // Remove category ID
        return { ...prev, categories: currentCategories.filter(cId => cId !== categoryId) };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    // Simple validation example
    if (!formData.title || !formData.description) {
      setError('Title and Description are required.');
      setSaving(false);
      return;
    }

    // Prepare payload, ensure categories is an array of IDs
    const payload = {
      ...formData,
      categories: formData.categories || [], // Ensure it's always an array
      // Convert empty deadline string to null if necessary for backend
      application_deadline: formData.application_deadline || null,
    };

    try {
      if (isCreating) {
        const response = await api.jobs.create(payload);
        setSuccess(`Job post "${response.data.title || payload.title}" created successfully!`);
        // Redirect to the list page or the new job's edit page after creation
        // Using navigate('/admin/jobs') is common after creation
        setTimeout(() => navigate('/admin/jobs'), 1500);
      } else {
        await api.jobs.update(id, payload);
        setSuccess('Job post updated successfully!');
        // Optionally stay on page or redirect
        setTimeout(() => navigate('/admin/jobs'), 1500); // Redirect back to list
      }
    } catch (err) {
      console.error("Error saving job post:", err);
      setError(err.response?.data?.error || 'Failed to save job post.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading-message">Loading job data...</div>;
  }

  return (
    <div className="admin-job-edit-page">
      <h1>{pageTitle}</h1>
      <Link to="/admin/jobs" className="back-link">← Back to Job List</Link>

      {error && <div className="error-message message">{error}</div>}
      {success && <div className="success-message message">{success}</div>}

      <form onSubmit={handleSubmit} className="job-form">
        <div className="form-group">
          <label htmlFor="title">Job Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="6"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="job_type">Job Type</label>
          <select
            id="job_type"
            name="job_type"
            value={formData.job_type}
            onChange={handleChange}
          >
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
            <option value="Temporary">Temporary</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="salary_range">Salary Range (e.g., $50k - $70k)</label>
          <input
            type="text"
            id="salary_range"
            name="salary_range"
            value={formData.salary_range}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="application_deadline">Application Deadline</label>
          <input
            type="date"
            id="application_deadline"
            name="application_deadline"
            value={formData.application_deadline}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Categories</label>
          <div className="category-checkboxes">
            {allCategories.length > 0 ? allCategories.map(category => (
              <div key={category.id} className="checkbox-item">
                <input
                  type="checkbox"
                  id={`category-${category.id}`}
                  value={category.id}
                  checked={formData.categories.includes(category.id)}
                  onChange={handleCategoryChange}
                />
                <label htmlFor={`category-${category.id}`}>{category.name}</label>
              </div>
            )) : <p>No categories available.</p>}
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn btn-primary">
          {saving ? 'Saving...' : (isCreating ? 'Create Job Post' : 'Update Job Post')}
        </button>
      </form>

      {/* Basic styling example */}
      <style jsx>{`
        .admin-job-edit-page { padding: 20px; max-width: 800px; margin: auto; }
        .back-link { display: inline-block; margin-bottom: 20px; color: #007bff; text-decoration: none; }
        .message { margin-bottom: 15px; padding: 10px; border-radius: 4px; }
        .error-message { color: #721c24; background-color: #f8d7da; border: 1px solid #f5c6cb;}
        .success-message { color: #155724; background-color: #d4edda; border: 1px solid #c3e6cb;}
        .job-form { margin-top: 20px; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; margin-bottom: 8px; font-weight: bold; }
        .form-group input[type="text"],
        .form-group input[type="date"],
        .form-group textarea,
        .form-group select {
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 1em;
          box-sizing: border-box; /* Include padding in width */
        }
        .form-group textarea { resize: vertical; }
        .category-checkboxes { border: 1px solid #eee; padding: 15px; border-radius: 4px; max-height: 200px; overflow-y: auto;}
        .checkbox-item { display: flex; align-items: center; margin-bottom: 10px; }
        .checkbox-item input[type="checkbox"] { margin-right: 10px; width: auto; } /* Adjust checkbox style */
        .checkbox-item label { margin-bottom: 0; font-weight: normal;} /* Align label with checkbox */
        .btn { padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; font-size: 1em; }
        .btn-primary { background-color: #007bff; color: white; }
        .btn:disabled { background-color: #6c757d; cursor: not-allowed; }
        .loading-message { margin-top: 20px; font-weight: bold; text-align: center; }
      `}</style>
    </div>
  );
};

export default JobPostEditPage;