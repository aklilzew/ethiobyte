import React, { useState, useEffect } from 'react';
import api from '../../../api/api'; // Adjust the import path as needed

function RFQResponse() {
    // State for the list of RFQs
    const [rfqs, setRfqs] = useState([]);
    const [loadingRfqs, setLoadingRfqs] = useState(true);
    const [rfqError, setRfqError] = useState(null);

    // State for the selected RFQ and its responses
    const [selectedRfqId, setSelectedRfqId] = useState('');
    const [selectedRfqDetails, setSelectedRfqDetails] = useState(null);
    const [responses, setResponses] = useState([]);
    const [loadingResponses, setLoadingResponses] = useState(false);
    const [responseError, setResponseError] = useState(null);

    useEffect(() => {
        const fetchRfqs = async () => {
            setLoadingRfqs(true);
            setRfqError(null);
            try {
                const res = await api.rfqs.getAll();
                setRfqs(res.data || []);
            } catch (err) {
                console.error("Error fetching RFQs:", err);
                setRfqError("Failed to load your RFQs. Please try refreshing.");
                setRfqs([]);
            } finally {
                setLoadingRfqs(false);
            }
        };

        fetchRfqs();
    }, []);

    useEffect(() => {
        const fetchResponsesForSelectedRfq = async () => {
            if (!selectedRfqId) {
                setResponses([]);
                setSelectedRfqDetails(null);
                setResponseError(null);
                return;
            }

            setLoadingResponses(true);
            setResponseError(null);
            setResponses([]);
            setSelectedRfqDetails(null);

            try {
                const rfqDetailsRes = await api.rfqs.getDetails(selectedRfqId);
                setSelectedRfqDetails(rfqDetailsRes.data);

                const responseRes = await api.rfqs.responses.get(selectedRfqId);
                const parsedResponses = responseRes.data.map(resp => ({
                    ...resp,
                    items: typeof resp.items === 'string' ? JSON.parse(resp.items) : resp.items || []
                }));
                setResponses(parsedResponses);

            } catch (err) {
                console.error(`Error fetching responses for RFQ ID ${selectedRfqId}:`, err);
                if (err.response?.status === 403) {
                    setResponseError("You are not authorized to view responses for this RFQ.");
                } else if (err.response?.status === 404) {
                    setResponseError("The selected RFQ was not found (it might have been deleted).");
                }
                else {
                    setResponseError("Failed to load responses for the selected RFQ.");
                }
                setResponses([]);
                setSelectedRfqDetails(null);
            } finally {
                setLoadingResponses(false);
            }
        };

        fetchResponsesForSelectedRfq();
    }, [selectedRfqId]);

    const handleRfqSelect = (event) => {
        setSelectedRfqId(event.target.value);
    };

    const getOriginalItemName = (itemId) => {
        if (!selectedRfqDetails || !selectedRfqDetails.items) return `Item ID: ${itemId}`;
        const originalItem = selectedRfqDetails.items.find(item => item.id === itemId);
        return originalItem ? originalItem.item_name : `Unknown Item (ID: ${itemId})`;
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">View RFQ Responses</h1>

            {/* RFQ Selection Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <label htmlFor="rfqSelect" className="block text-lg font-medium text-gray-700 mb-2">
                    Select an RFQ to view responses:
                </label>
                {loadingRfqs ? (
                    <div className="flex items-center justify-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        <span className="ml-3 text-gray-600">Loading your RFQs...</span>
                    </div>
                ) : rfqError ? (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{rfqError}</p>
                            </div>
                        </div>
                    </div>
                ) : rfqs.length === 0 ? (
                    <p className="text-gray-600 italic">You haven't created any RFQs yet.</p>
                ) : (
                    <select
                        id="rfqSelect"
                        value={selectedRfqId}
                        onChange={handleRfqSelect}
                        disabled={loadingRfqs}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
                    >
                        <option value="" disabled>-- Choose an RFQ --</option>
                        {rfqs.map((rfq) => (
                            <option key={rfq.id} value={rfq.id}>
                                {rfq.title} ({rfq.rfq_number || `ID: ${rfq.id}`}) - {rfq.responses_count || 0} responses
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {/* Divider */}
            {selectedRfqId && <hr className="my-8 border-t border-gray-200" />}

            {/* Response Display Section */}
            {selectedRfqId && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    {loadingResponses ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                            <span className="ml-3 text-gray-600">Loading responses...</span>
                        </div>
                    ) : responseError ? (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">{responseError}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            {selectedRfqDetails ? (
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                                    Responses for: {selectedRfqDetails.title} (#{selectedRfqDetails.rfq_number})
                                </h2>
                            ) : (
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                                    Responses for RFQ ID: {selectedRfqId}
                                </h2>
                            )}

                            {responses.length === 0 ? (
                                <p className="text-gray-600 italic py-4">No responses have been submitted for this RFQ yet.</p>
                            ) : (
                                <div className="space-y-6">
                                    {responses.map((response) => (
                                        <div key={response.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                                            <h3 className="text-xl font-medium text-blue-600 mb-2">Supplier: {response.company_name || 'N/A'}</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                                <div>
                                                    <p className="text-sm text-gray-500">Response ID</p>
                                                    <p className="font-medium">{response.id}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Submitted On</p>
                                                    <p className="font-medium">{new Date(response.created_at).toLocaleString()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Total Quoted Price</p>
                                                    <p className="font-medium text-green-600">${parseFloat(response.total_price).toFixed(2)}</p>
                                                </div>
                                            </div>
                                            
                                            {response.validity_days && (
                                                <div className="mb-2">
                                                    <p className="text-sm text-gray-500">Quote Validity</p>
                                                    <p className="font-medium">{response.validity_days} days</p>
                                                </div>
                                            )}
                                            
                                            {response.status && (
                                                <div className="mb-2">
                                                    <p className="text-sm text-gray-500">Status</p>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        response.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                                        response.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {response.status}
                                                    </span>
                                                </div>
                                            )}
                                            
                                            {response.notes && (
                                                <div className="mb-4">
                                                    <p className="text-sm text-gray-500">Notes</p>
                                                    <p className="font-medium">{response.notes}</p>
                                                </div>
                                            )}

                                            <h4 className="text-lg font-medium text-gray-800 mt-4 mb-2">Quoted Items:</h4>
                                            {response.items && response.items.length > 0 ? (
                                                <ul className="divide-y divide-gray-200 border border-gray-200 rounded-md">
                                                    {response.items.map((item, index) => (
                                                        <li key={`${response.id}-${item.item_id}-${index}`} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                                                            <div className="w-0 flex-1 flex items-center">
                                                                <span className="ml-2 flex-1 w-0 truncate font-medium">
                                                                    {getOriginalItemName(item.item_id)}
                                                                </span>
                                                            </div>
                                                            <div className="ml-4 flex-shrink-0 space-x-4">
                                                                <span className="text-gray-500">Qty: {item.quantity}</span>
                                                                <span className="text-gray-500">@</span>
                                                                <span className="font-medium text-green-600">${parseFloat(item.unit_price).toFixed(2)}</span>
                                                                <span className="text-gray-500">each</span>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="text-gray-600 italic">No specific item details provided.</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default RFQResponse;