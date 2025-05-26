import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import api from '../../../api/api';
// Placeholder component for image loading or missing image
const ImagePlaceholder = () => (
    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
    </div>
);

function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await api.products.getAll();
                // Check if the backend returned an error object structure
                if (response.data && response.data.err) {
                     setError(response.data.err);
                     setProducts([]);
                } else if (Array.isArray(response.data)) {
                    // Filter out archived products if you only want active ones
                    const activeProducts = response.data.filter(p => p.status === 'active');
                    setProducts(activeProducts);
                    if (activeProducts.length === 0 && response.data.length > 0) {
                        // Optional: Inform user if only archived products exist
                        // setError("No active products found.");
                    }
                } else {
                    // Handle unexpected response format
                    setError("Received invalid data format from server.");
                    setProducts([]);
                }
            } catch (err) {
                console.error("Error fetching products:", err);
                setError("Failed to load products. Please try again later.");
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []); // Empty dependency array means run only once on mount

    if (loading) {
        return <div className="text-center py-10">Loading products...</div>;
    }

    // Display error if one occurred, but not the "no products found" error yet
    if (error && error !== 'no products found') {
        return <div className="text-center py-10 text-red-600 bg-red-100 border border-red-400 rounded p-4 max-w-md mx-auto">Error: {error}</div>;
    }

    // Handle the specific "no products found" case or empty array after filtering
     if (products.length === 0) {
        return <div className="text-center py-10 text-gray-600">No products found.</div>;
    }


    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Products</h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <Link
                        key={product.id}
                        to={`/userdashboard/products/${product.id}`} // Link to the detail page
                            className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 ease-in-out flex flex-col"
                        >
                            {product.image_url ? (
                                <img
                                    src={product.image_url}
                                    alt={product.name}
                                    className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity"
                                />
                            ) : (
                                <ImagePlaceholder />
                            )}
                            <div className="p-4 flex-grow flex flex-col justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-800 mb-1 truncate group-hover:text-indigo-600 transition-colors">
                                        {product.name}
                                    </h2>
                                    <p className="text-sm text-gray-500 mb-2">SKU: {product.sku}</p>
                                    {/* Optional: Short description */}
                                    {/* <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p> */}
                                </div>
                                <p className="text-xl font-bold text-indigo-600 mt-2">
                                    ${parseFloat(product.price).toFixed(2)}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ProductList;