import React, { useState, useEffect, useCallback } from 'react';
import api from '../../../api/api'; // Adjust path as needed
import { format } from 'date-fns';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    FiPlus, FiTrash2, FiEdit2, FiEye, FiX, FiChevronLeft, FiChevronRight,
    FiCalendar, FiFileText, FiInfo, FiRefreshCw, FiSearch, FiLoader,
    FiAlertCircle, FiCheckCircle, FiPackage, FiClock, FiHash, FiTag, FiPaperclip
} from 'react-icons/fi';

// --- Initial State ---
const initialFormData = {
    title: '',
    description: '',
    due_date: '',
    items: [{ name: '', description: '', quantity: '', unit: '' }]
};

// --- Custom Confirmation Toast Component ---
const ConfirmationToast = ({ closeToast, message, onConfirm, title = "Confirm Action" }) => {
    const handleConfirm = () => {
        onConfirm();
        closeToast();
    };
    const handleCancel = () => {
        closeToast();
    };
    return (
        <div className="p-3 max-w-sm">
            <div className="text-lg font-semibold text-gray-900 mb-2">{title}</div>
            <p className="text-sm text-gray-600 mb-4">{message}</p>
            <div className="flex justify-end space-x-3">
                <button onClick={handleCancel} className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 transition duration-150">Cancel</button>
                <button onClick={handleConfirm} className="px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition duration-150">Confirm</button>
            </div>
        </div>
    );
};


// --- Main Component ---
export const RFQManagement = () => {
    // --- State Variables ---
    const [rfqs, setRfqs] = useState([]);
    const [selectedRfq, setSelectedRfq] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false); // For form submissions
    const [error, setError] = useState(null); // For persistent/critical errors
    const [viewMode, setViewMode] = useState('list'); // 'list', 'detail', 'create', 'edit'
    const [formData, setFormData] = useState(initialFormData);
    const [searchTerm, setSearchTerm] = useState('');

    // --- Toast Config & Helpers ---
    const toastConfig = { position: "bottom-right", autoClose: 4000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, theme: "colored" };
    const notifySuccess = (message) => toast.success( <div className="flex items-center"><FiCheckCircle className="mr-2" />{message}</div>, toastConfig);
    const notifyError = (message) => toast.error( <div className="flex items-center"><FiAlertCircle className="mr-2" />{message}</div>, toastConfig);
    const confirmAction = (message, onConfirm, title = "Confirm Action") => {
        toast(({ closeToast }) => (
            <ConfirmationToast closeToast={closeToast} message={message} onConfirm={onConfirm} title={title} />
        ), { ...toastConfig, autoClose: false, closeOnClick: false, draggable: false, position: "top-center", theme: 'light' });
    };

    // --- Data Fetching ---
    const fetchRfqs = useCallback(async () => {
        setIsLoading(true);
        setError(null); // Clear persistent error
        try {
            const response = await api.rfqs.getAll();
            setRfqs(response.data || []);
        } catch (err) {
            console.error("Error fetching RFQs:", err);
            const errorMsg = err.response?.data?.error || err.message || 'Failed to fetch RFQs.';
            notifyError(errorMsg); // Use toast for fetch errors
            setRfqs([]);
        } finally {
            setIsLoading(false);
        }
    }, []); // Removed notifyError from deps

    useEffect(() => {
        fetchRfqs();
    }, [fetchRfqs]);

    // Filtering Logic
    const filteredRfqs = rfqs.filter(rfq =>
        (rfq.title && rfq.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (rfq.description && rfq.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (rfq.rfq_number && rfq.rfq_number.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Fetch Detail
    const fetchRfqDetail = async (id) => {
        setIsLoading(true);
        setError(null);
        setSelectedRfq(null);
        setViewMode('detail');
        try {
            const response = await api.rfqs.getDetails(id);
            setSelectedRfq(response.data);
        } catch (err) {
            console.error(`Error fetching RFQ ${id}:`, err);
            const errorMsg = err.response?.data?.error || err.message || `Failed to fetch RFQ ${id}.`;
            if (err.response?.status === 404) {
                setError(`RFQ with ID ${id} not found.`); // Set persistent error for not found
            } else {
                notifyError(errorMsg); // Toast for other errors
            }
            setViewMode('list'); // Go back to list on error
        } finally {
            setIsLoading(false);
        }
    };

    // --- CRUD Operations ---
    const handleCreate = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        if (!formData.title || !formData.due_date) {
            notifyError("Title and Due Date are required.");
            setIsSubmitting(false);
            return;
        }
        const validItems = formData.items.filter(item => item.name && item.quantity && !isNaN(item.quantity) && Number(item.quantity) > 0);
        const payload = { title: formData.title, description: formData.description, due_date: formData.due_date, items: validItems };

        try {
            await api.rfqs.create(payload);
            notifySuccess('RFQ created successfully!');
            setViewMode('list');
            setFormData(initialFormData);
            await fetchRfqs(); // Refresh list
        } catch (err) {
            console.error("Error creating RFQ:", err);
            const errorMsg = err.response?.data?.error || err.message || 'Failed to create RFQ.';
            notifyError(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!selectedRfq?.id) return notifyError('No RFQ selected for update.');
        setIsSubmitting(true);
        setError(null);

        const validItems = formData.items.filter(item => item.name && item.quantity && !isNaN(item.quantity) && Number(item.quantity) > 0);
        const payload = { title: formData.title, description: formData.description, due_date: formData.due_date, items: validItems };

        try {
            await api.rfqs.update(selectedRfq.id, payload);
            notifySuccess('RFQ updated successfully!');
            setViewMode('list');
            setSelectedRfq(null);
            setFormData(initialFormData);
            await fetchRfqs(); // Refresh list
        } catch (err) {
            console.error(`Error updating RFQ ${selectedRfq.id}:`, err);
            const errorMsg = err.response?.data?.error || err.message || `Failed to update RFQ.`;
            notifyError(errorMsg);
            if (err.response?.status === 404) {
                setError(`RFQ with ID ${selectedRfq.id} not found for update.`);
                setViewMode('list');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = (id, title) => {
        confirmAction(
            `Are you sure you want to delete RFQ "${title || id}"? This action cannot be undone.`,
            async () => {
                // Actual delete logic
                setIsLoading(true); // Use main loading indicator for delete
                setError(null);
                try {
                    await api.rfqs.delete(id);
                    notifySuccess(`RFQ "${title || id}" deleted successfully.`);
                    if (selectedRfq?.id === id) {
                        setSelectedRfq(null);
                        setViewMode('list');
                    }
                    await fetchRfqs(); // Refresh list
                } catch (err) {
                    console.error(`Error deleting RFQ ${id}:`, err);
                    const errorMsg = err.response?.data?.error || err.message || `Failed to delete RFQ.`;
                    notifyError(errorMsg);
                    if (err.response?.status === 404) {
                         setError(`RFQ with ID ${id} not found for deletion.`); // Persistent error
                    }
                } finally {
                    setIsLoading(false);
                }
            },
            "Confirm Deletion"
        );
    };


    // --- Form Handlers ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const handleItemChange = (index, e) => {
        const { name, value } = e.target;
        const newItems = [...formData.items];
        newItems[index] = { ...newItems[index], [name]: value };
        setFormData(prev => ({ ...prev, items: newItems }));
    };
    const handleAddItem = () => setFormData(prev => ({ ...prev, items: [...prev.items, { name: '', description: '', quantity: '', unit: '' }] }));
    const handleRemoveItem = (index) => {
        const newItems = formData.items.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, items: newItems.length === 0 ? [{ name: '', description: '', quantity: '', unit: '' }] : newItems }));
    };

    // --- View Management ---
    const showCreateForm = () => { setSelectedRfq(null); setFormData(initialFormData); setError(null); setViewMode('create'); };
    const showEditForm = (rfq) => {
        setSelectedRfq(rfq);
        const itemsToEdit = (rfq.items && Array.isArray(rfq.items) ? rfq.items : []).map(item => ({
            name: item.item_name || item.name || '', description: item.description || '', quantity: item.quantity || '', unit: item.unit || ''
        }));
        setFormData({
            title: rfq.title || '', description: rfq.description || '',
            due_date: rfq.due_date ? new Date(rfq.due_date).toISOString().split('T')[0] : '',
            items: itemsToEdit.length > 0 ? itemsToEdit : [{ name: '', description: '', quantity: '', unit: '' }],
        });
        setError(null); setViewMode('edit');
    };
    const cancelForm = () => { setError(null); setSelectedRfq(null); setFormData(initialFormData); setViewMode('list'); };
    const closeDetailView = () => { setSelectedRfq(null); setError(null); setViewMode('list'); };

    // --- Date Formatting ---
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try { return format(new Date(dateString), 'MMM dd, yyyy'); }
        catch { return 'Invalid Date'; }
    };
    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        try { return format(new Date(dateString), 'MMM dd, yyyy, h:mm a'); }
        catch { return 'Invalid Date'; }
    };

    // --- Helper for Status ---
    const getStatus = (dueDate) => {
        if (!dueDate) return { text: 'Unknown', color: 'gray' };
        const now = new Date();
        const due = new Date(dueDate);
        // Set time to end of day for comparison to avoid issues with timezones
        due.setHours(23, 59, 59, 999);
        now.setHours(0, 0, 0, 0); // Compare against start of today

        if (due < now) return { text: 'Expired', color: 'red' };
        // Optional: Add 'Due Soon' status
        // const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
        // if (diffDays <= 7) return { text: 'Due Soon', color: 'yellow' };
        return { text: 'Active', color: 'green' };
    };

    const statusBadgeClass = (color) => ({
        red: 'bg-red-100 text-red-800 border-red-200',
        green: 'bg-green-100 text-green-800 border-green-200',
        yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        gray: 'bg-gray-100 text-gray-800 border-gray-200',
    }[color] || 'bg-gray-100 text-gray-800 border-gray-200');


    // --- Component Renders ---

    const renderLoading = () => (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-40">
            <FiLoader className="animate-spin text-4xl text-indigo-600" />
        </div>
    );

    const renderError = () => error && (
        <div className="mb-6 flex items-start gap-x-3 bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm" role="alert">
            <FiAlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
                <h3 className="text-base font-semibold text-red-800">Error</h3>
                <p className="text-sm text-red-700">{error}</p>
            </div>
        </div>
    );

    const renderListView = () => (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden relative">
            {isLoading && renderLoading()}
            {/* List Header */}
            <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-b from-gray-50 to-white border-b border-gray-200">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">RFQ Dashboard</h1>
                    <p className="text-gray-600 mt-1 text-sm">Overview of all Requests for Quotations.</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    {/* Search Input */}
                    <div className="relative flex-grow md:flex-grow-0 md:w-72">
                        <FiSearch className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18}/>
                        <input
                            type="text"
                            placeholder="Search by title, number..."
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-150"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {/* New RFQ Button */}
                    <button
                        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow-sm hover:shadow-md transition duration-150 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        onClick={showCreateForm}
                        disabled={isLoading}
                    >
                        <FiPlus size={18} /> New RFQ
                    </button>
                </div>
            </div>

            {/* RFQ Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Number</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Due Date</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredRfqs.length === 0 && !isLoading ? (
                             <tr>
                                <td colSpan="5" className="px-6 py-16 text-center">
                                    <FiPackage className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-lg font-medium text-gray-900">No RFQs Found</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {searchTerm ? 'No results match your search.' : 'Get started by creating a new RFQ.'}
                                    </p>
                                    {!searchTerm && (
                                        <button
                                            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            onClick={showCreateForm} >
                                            <FiPlus className="-ml-1 mr-2 h-5 w-5" /> Create New RFQ
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ) : filteredRfqs.map(rfq => {
                             const status = getStatus(rfq.due_date);
                             return (
                                <tr key={rfq.id} className="hover:bg-indigo-50/50 transition-colors duration-100">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                                        <FiHash className="inline mr-1 h-4 w-4 text-gray-400"/>{rfq.rfq_number || rfq.id}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <div className="font-semibold text-gray-900">{rfq.title}</div>
                                        <div className="text-gray-500 line-clamp-1 text-xs mt-0.5">{rfq.description || 'No description'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center text-sm text-gray-700">
                                            <FiClock className="mr-1.5 h-4 w-4 text-gray-400" />
                                            <span className={status.color === 'red' ? 'font-semibold text-red-600' : ''}>{formatDate(rfq.due_date)}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full border ${statusBadgeClass(status.color)}`}>
                                            {status.text}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                        <div className="flex items-center justify-center gap-x-4">
                                             <button onClick={() => fetchRfqDetail(rfq.id)} className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-100 transition duration-150" title="View Details"><FiEye size={18} /></button>
                                             <button onClick={() => showEditForm(rfq)} className="text-yellow-600 hover:text-yellow-800 p-1 rounded-full hover:bg-yellow-100 transition duration-150" title="Edit RFQ"><FiEdit2 size={18} /></button>
                                             <button onClick={() => handleDelete(rfq.id, rfq.title)} className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition duration-150" title="Delete RFQ"><FiTrash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                             );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderDetailView = () => selectedRfq && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden relative">
             {isLoading && renderLoading()}
            {/* Detail Header */}
            <div className="p-6 bg-gray-50 border-b border-gray-200">
                 <button onClick={closeDetailView} className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4 font-medium transition-colors">
                    <FiChevronLeft className="mr-1 h-4 w-4" /> Back to RFQ List
                 </button>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center">
                            <FiFileText className="mr-2 text-indigo-600"/> RFQ: {selectedRfq.title}
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Number: <span className="font-medium text-gray-700">{selectedRfq.rfq_number || 'N/A'}</span>
                             <span className="mx-2 text-gray-300">|</span>
                             Status: <span className={`font-medium ${getStatus(selectedRfq.due_date).color === 'red' ? 'text-red-600' : 'text-green-600'}`}>{getStatus(selectedRfq.due_date).text}</span>
                        </p>
                    </div>
                    <div className="flex gap-3 flex-shrink-0">
                         <button onClick={() => showEditForm(selectedRfq)} className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:shadow transition duration-150">
                            <FiEdit2 size={16} /> Edit
                        </button>
                        <button onClick={() => handleDelete(selectedRfq.id, selectedRfq.title)} className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:shadow transition duration-150">
                             <FiTrash2 size={16} /> Delete
                        </button>
                    </div>
                </div>
            </div>

            {/* Detail Body */}
            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-6">
                {/* Main Details */}
                 <div className="lg:col-span-2 space-y-5">
                     <div>
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Description</h3>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedRfq.description || <span className="italic text-gray-400">No description provided.</span>}</p>
                    </div>
                     <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center"><FiPaperclip className="mr-2 text-indigo-600"/> Items Requested</h3>
                         {selectedRfq.items && selectedRfq.items.length > 0 ? (
                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200 text-sm">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left font-medium text-gray-600">Name</th>
                                            <th className="px-4 py-2 text-left font-medium text-gray-600">Description</th>
                                            <th className="px-4 py-2 text-right font-medium text-gray-600">Quantity</th>
                                            <th className="px-4 py-2 text-left font-medium text-gray-600">Unit</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-100">
                                        {selectedRfq.items.map((item, index) => (
                                            <tr key={index}>
                                                <td className="px-4 py-2 font-medium text-gray-900">{item.item_name || item.name || '-'}</td>
                                                <td className="px-4 py-2 text-gray-600">{item.description || '-'}</td>
                                                <td className="px-4 py-2 text-right font-medium text-gray-800">{item.quantity}</td>
                                                <td className="px-4 py-2 text-gray-700">{item.unit || '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
                                <FiPackage className="mx-auto h-8 w-8 text-gray-400" />
                                <p className="mt-2 text-sm text-gray-600">No items listed for this RFQ.</p>
                            </div>
                        )}
                    </div>
                 </div>
                 {/* Sidebar Details */}
                <div className="lg:col-span-1 space-y-5 border-t lg:border-t-0 lg:border-l border-gray-200 lg:pl-8 pt-6 lg:pt-0">
                    <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center"><FiInfo className="mr-2 text-indigo-600"/> Information</h3>
                    <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Due Date</h4>
                        <div className="flex items-center text-sm">
                            <FiCalendar className="mr-1.5 h-4 w-4 text-gray-400 flex-shrink-0" />
                            <span className={`font-medium ${getStatus(selectedRfq.due_date).color === 'red' ? 'text-red-600' : 'text-gray-800'}`}>{formatDate(selectedRfq.due_date)}</span>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Created</h4>
                        <p className="text-sm text-gray-600">{formatDateTime(selectedRfq.created_at)}</p>
                    </div>
                    <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Last Updated</h4>
                        <p className="text-sm text-gray-600">{formatDateTime(selectedRfq.updated_at)}</p>
                    </div>
                    {/* Add more fields if needed */}
                </div>
            </div>
        </div>
    );


    const renderFormView = () => (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden relative">
             {(isLoading || isSubmitting) && renderLoading()}
             {/* Form Header */}
            <div className="p-6 bg-gray-50 border-b border-gray-200">
                <button onClick={cancelForm} className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4 font-medium transition-colors">
                    <FiChevronLeft className="mr-1 h-4 w-4" /> Back to RFQ List
                </button>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                    {viewMode === 'create' ? 'Create New Request for Quotation' : `Edit RFQ: ${selectedRfq?.rfq_number || selectedRfq?.title || ''}`}
                </h2>
                 <p className="text-sm text-gray-500 mt-1">Fill in the details below.</p>
            </div>

            {/* Form Body */}
            <form onSubmit={viewMode === 'create' ? handleCreate : handleUpdate} className="p-6">
                 {/* Main Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
                        <input type="text" id="title" name="title" value={formData.title} onChange={handleInputChange} required disabled={isSubmitting}
                               className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150" />
                    </div>
                    <div>
                        <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 mb-1">Due Date <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18}/>
                            <input type="date" id="due_date" name="due_date" value={formData.due_date} onChange={handleInputChange} required disabled={isSubmitting}
                                   className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150" />
                        </div>
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} rows={4} disabled={isSubmitting}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150" />
                    </div>
                </div>

                {/* Items Section */}
                 <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center"><FiPackage className="mr-2 text-indigo-600"/> Items</h3>
                <div className="space-y-5 mb-6">
                     {formData.items.map((item, index) => (
                        <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50/50 relative">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                 {/* Item Fields */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Name <span className="text-red-500">*</span></label>
                                    <input type="text" name="name" placeholder="Item name" value={item.name} onChange={(e) => handleItemChange(index, e)} required disabled={isSubmitting}
                                           className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500" />
                                </div>
                                 <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                                    <input type="text" name="description" placeholder="Optional details" value={item.description} onChange={(e) => handleItemChange(index, e)} disabled={isSubmitting}
                                           className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Quantity <span className="text-red-500">*</span></label>
                                    <input type="number" name="quantity" placeholder="e.g., 10" value={item.quantity} onChange={(e) => handleItemChange(index, e)} min="1" required disabled={isSubmitting}
                                           className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Unit</label>
                                    <input type="text" name="unit" placeholder="e.g., pcs, kg" value={item.unit} onChange={(e) => handleItemChange(index, e)} disabled={isSubmitting}
                                           className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500" />
                                </div>
                            </div>
                             {/* Remove Button */}
                             {formData.items.length > 1 && (
                                <button type="button" onClick={() => handleRemoveItem(index)} disabled={isSubmitting} title="Remove Item"
                                        className="absolute -top-2 -right-2 p-1 bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-800 rounded-full transition duration-150">
                                    <FiX size={16}/>
                                </button>
                             )}
                        </div>
                    ))}
                </div>

                {/* Add Item Button */}
                <button type="button" onClick={handleAddItem} disabled={isSubmitting}
                        className="inline-flex items-center px-4 py-2 border border-dashed border-gray-400 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 hover:border-indigo-500 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 mb-8">
                     <FiPlus className="mr-2 h-4 w-4" /> Add Another Item
                </button>

                {/* Form Actions */}
                <div className="flex justify-end items-center gap-4 pt-5 border-t border-gray-200">
                    <button type="button" onClick={cancelForm} disabled={isSubmitting}
                            className="px-6 py-2 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition duration-150">
                        Cancel
                    </button>
                    <button type="submit" disabled={isSubmitting}
                            className={`inline-flex items-center justify-center px-6 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}>
                         {isSubmitting ? (
                            <> <FiLoader className="animate-spin -ml-1 mr-2 h-4 w-4" /> Processing... </>
                         ) : (
                             viewMode === 'create' ? 'Create RFQ' : 'Save Changes'
                         )}
                    </button>
                </div>
            </form>
        </div>
    );


    // --- Main Return ---
    return (
        <div className="bg-gray-100 min-h-screen">
            <ToastContainer newestOnTop />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative"> {/* Added relative for loader positioning */}
                {renderError()}

                {viewMode === 'list' && renderListView()}
                {viewMode === 'detail' && renderDetailView()}
                {(viewMode === 'create' || viewMode === 'edit') && renderFormView()}
            </div>
        </div>
    );
};