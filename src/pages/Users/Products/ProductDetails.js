import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // Import useParams to get ID, Link for navigation
import api from '../../../api/api'; // Adjust the import path to your api service file

// Placeholder component for image loading or missing image
const ImagePlaceholder = () => (
    <div className="w-full h-64 md:h-96 bg-gray-200 flex items-center justify-center rounded-lg shadow-inner">
        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
    </div>
);

function ProductDetail() {
    // Get the dynamic 'id' parameter from the URL
    // This relies on your Route being defined like: <Route path="products/:id" element={<ProductDetail />} />
    const { id } = useParams();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Function to fetch product data
        const fetchProduct = async () => {
            // Ensure we have an ID before trying to fetch
            if (!id) {
                setError("Product ID is missing from URL.");
                setLoading(false);
                return;
            }

            setLoading(true); // Start loading state
            setError(null);   // Clear previous errors
            setProduct(null); // Clear previous product data

            try {
                // Call the API using the extracted ID
                const response = await api.products.getById(id);
                setProduct(response.data); // Set the fetched product data to state
            } catch (err) {
                console.error(`Error fetching product ${id}:`, err);
                // Handle specific errors (like Not Found) or general errors
                if (err.response?.status === 404) {
                    setError("Product not found.");
                } else {
                    setError("Failed to load product details. Please try again later.");
                }
                setProduct(null); // Ensure product is null on error
            } finally {
                // Always stop loading state, whether success or error
                setLoading(false);
            }
        };

        fetchProduct(); // Execute the fetch function

    }, [id]); // Dependency array: Re-run this effect if the 'id' from the URL changes

    // --- Render Loading State ---
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-200px)]"> {/* Adjust min-height as needed */}
                <div className="text-center text-gray-500">
                    <svg className="animate-spin h-8 w-8 text-indigo-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading product details...
                </div>
            </div>
        );
    }

    // --- Render Error State ---
    if (error) {
        return (
            <div className="text-center py-16 px-4">
                 <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-lg mx-auto mb-6" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                 </div>
                 {/* Provide a link back to the product list */}
                 <Link
                    to="/userdashboard/products" // Adjust this path if your product list is nested differently (e.g., /dashboard/products)
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                 >
                    <svg className="w-5 h-5 mr-2 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    Back to Products
                </Link>
            </div>
        );
    }

    // --- Render Product Not Found (or data unavailable) ---
    // This might be redundant if the error state catches 404, but acts as a safety net
    if (!product) {
        return <div className="text-center py-20 text-gray-600">Product data is unavailable.</div>;
    }

    // --- Render Product Details (Success State) ---

    // Determine status badge styling based on product status
    const statusBadgeClass = product.status === 'active'
        ? 'bg-green-100 text-green-800' // Active: Green badge
        : 'bg-yellow-100 text-yellow-800'; // Archived/Other: Yellow badge (adjust as needed)

    return (
        <div className="bg-white py-10 md:py-16"> {/* Added padding */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"> {/* Slightly wider max-width */}
                 <Link
                    to="/userdashboard/products" // Adjust this path if needed
                    className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 mb-6 group"
                 >
                    <svg className="w-5 h-5 mr-2 text-indigo-500 group-hover:text-indigo-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    Back to Products
                </Link>

                {/* Product Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    {/* Image Section */}
                    <div className="w-full">
                        {product.image_url ? (
                            <img
                                src={product.image_url} // Use the actual image URL from the product data
                                alt={product.name}
                                className="w-full h-auto object-contain rounded-lg shadow-md border border-gray-200 max-h-[500px]" // Use object-contain, add max-height
                            />
                        ) : (
                            <ImagePlaceholder /> // Show placeholder if no image URL
                        )}
                    </div>

                    {/* Details Section */}
                    <div className="flex flex-col justify-start"> {/* Align content top */}
                        {/* Product Name */}
                        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 mb-2">{product.name}</h1>

                        {/* SKU and Status */}
                        <div className="flex items-center space-x-3 mb-4">
                            <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                            <span className={`inline-block text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full ${statusBadgeClass}`}>
                                {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                            </span>
                        </div>

                        {/* Price */}
                        <p className="text-3xl font-semibold text-indigo-600 my-4">
                            ${parseFloat(product.price).toFixed(2)} {/* Format price */}
                        </p>

                        {/* Description */}
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-2 border-b pb-1">Description</h2>
                            <p className="text-gray-700 leading-relaxed prose prose-sm max-w-none"> {/* Added prose for better text formatting */}
                                {product.description || 'No description available.'}
                            </p>
                        </div>

                        {/* Availability */}
                        <div className="mb-6">
                             <h2 className="text-xl font-semibold text-gray-800 mb-2 border-b pb-1">Availability</h2>
                             <p className={`text-base ${product.stock_quantity > 0 ? 'text-green-600 font-medium' : 'text-red-600 font-semibold'}`}>
                                {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : 'Out of Stock'}
                            </p>
                        </div>

                        {/* Action Button (e.g., Add to Cart) */}
                        {/* Only show button if product is active and in stock */}
                        {product.status === 'active' && product.stock_quantity > 0 && (
                             <button className="mt-auto w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm text-lg">
                                Add to Cart {/* Placeholder action */}
                            </button>
                        )}
                        {/* Message if not available for purchase */}
                         {(product.status !== 'active' || product.stock_quantity <= 0) && (
                             <p className="mt-auto pt-4 text-sm text-center text-gray-500 italic">This product is currently not available for purchase.</p>
                         )}

                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;