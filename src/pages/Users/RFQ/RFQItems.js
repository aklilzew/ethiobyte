// src/pages/RFQManager.jsx
import React, { useState, useEffect } from 'react';
import api from '../../../api/api';
import { FiCalendar, FiFileText, FiInfo, FiPlus, FiRefreshCw, FiSearch } from 'react-icons/fi';

const RFQItems = () => {
  const [rfqs, setRFQs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchRFQs = async () => {
    try {
      setLoading(true);
      const { data } = await api.rfqs.getAll();
      setRFQs(data);
    } catch (error) {
      console.error('Error fetching RFQs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRFQs();
  }, []);

  const filteredRFQs = rfqs.filter(rfq => 
    rfq.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rfq.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">RFQ Manager</h2>
          <p className="text-gray-600 mt-1">Manage all your Request for Quotations in one place</p>
        </div>
        <button 
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          onClick={() => console.log('Add new RFQ')}
        >
          <FiPlus /> New RFQ
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50 border-b">
          <div className="relative w-full sm:w-64">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search RFQs..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={fetchRFQs}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
            disabled={loading}
          >
            <FiRefreshCw className={`${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Loading RFQs...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRFQs.length > 0 ? (
                  filteredRFQs.map((rfq) => (
                    <tr key={rfq.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FiFileText className="text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{rfq.title}</div>
                            <div className="text-sm text-gray-500">#{rfq.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 line-clamp-2">{rfq.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FiCalendar className="text-gray-400 mr-2" />
                          <span className={`text-sm ${new Date(rfq.due_date) < new Date() ? 'text-red-500' : 'text-gray-600'}`}>
                            {formatDate(rfq.due_date)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${new Date(rfq.due_date) < new Date() ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                          {new Date(rfq.due_date) < new Date() ? 'Expired' : 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                        <button className="text-gray-600 hover:text-gray-900">Edit</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <FiInfo className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No RFQs found</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {searchTerm ? 'Try a different search term' : 'Create a new RFQ to get started'}
                      </p>
                      {!searchTerm && (
                        <button 
                          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                          onClick={() => console.log('Add new RFQ')}
                        >
                          <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                          New RFQ
                        </button>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!loading && filteredRFQs.length > 0 && (
        <div className="flex justify-between items-center text-sm text-gray-500">
          <div>Showing {filteredRFQs.length} of {rfqs.length} RFQs</div>
          <div className="flex gap-2">
            <button className="px-3 py-1 border rounded-md bg-white">Previous</button>
            <button className="px-3 py-1 border rounded-md bg-blue-600 text-white">1</button>
            <button className="px-3 py-1 border rounded-md bg-white">2</button>
            <button className="px-3 py-1 border rounded-md bg-white">Next</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RFQItems;