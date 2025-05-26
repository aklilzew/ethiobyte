import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Adjust the path to your api.js file if needed
import api from '../../../api/api';

// Helper for formatting currency
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

// Check if user is logged in (replace with your auth context if available)
const isLoggedIn = () => !!localStorage.getItem('token');

const OrderForm = () => {
    const navigate = useNavigate();
    const [availableProducts, setAvailableProducts] = useState([]);
    const [orderItems, setOrderItems] = useState([]); // Holds items added to the current order [{product_id, name, quantity, unit_price}]
    const [productsLoading, setProductsLoading] = useState(true);
    const [productsError, setProductsError] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    // --- Fetch Available Products ---
    useEffect(() => {
        if (!isLoggedIn()) {
            alert("Please log in to create an order.");
            navigate('/login'); // Redirect if not logged in
            return;
        }

        const fetchProducts = async () => {
            setProductsLoading(true);
            setProductsError(null);
            try {
                const response = await api.products.getAll();
                // Filter for active products only
                const activeProducts = response.data.filter(p => p.status === 'active');
                setAvailableProducts(activeProducts);
            } catch (err) {
                console.error("Error fetching products:", err);
                setProductsError(err.response?.data?.error || "Failed to load products.");
            } finally {
                setProductsLoading(false);
            }
        };

        fetchProducts();
    }, [navigate]);

    // --- Order Item Management ---

    const addProductToOrder = (product) => {
        setSubmitError(null); // Clear previous submission errors when modifying order
        setOrderItems(prevItems => {
            const existingItemIndex = prevItems.findIndex(item => item.product_id === product.id);

            if (existingItemIndex > -1) {
                // If item already exists, increase quantity by 1
                const updatedItems = [...prevItems];
                updatedItems[existingItemIndex].quantity += 1;
                return updatedItems;
            } else {
                // If item is new, add it with quantity 1
                return [
                    ...prevItems,
                    {
                        product_id: product.id,
                        name: product.name,
                        quantity: 1,
                        unit_price: parseFloat(product.price) // Use the fetched price
                    }
                ];
            }
        });
    };

    const updateItemQuantity = (productId, newQuantity) => {
       setSubmitError(null);
       const quantity = parseInt(newQuantity, 10);
       if (isNaN(quantity) || quantity < 1) return; // Prevent invalid quantities

        setOrderItems(prevItems =>
            prevItems.map(item =>
                item.product_id === productId ? { ...item, quantity: quantity } : item
            )
        );
    };

    const removeItemFromOrder = (productId) => {
        setSubmitError(null);
        setOrderItems(prevItems => prevItems.filter(item => item.product_id !== productId));
    };

    // --- Calculation ---

    const calculateSubtotal = (item) => {
        return (item.quantity || 0) * (item.unit_price || 0);
    };

    const calculateGrandTotal = () => {
        return orderItems.reduce((total, item) => total + calculateSubtotal(item), 0);
    };

    // --- Form Submission ---

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (orderItems.length === 0) {
            setSubmitError("Cannot place an empty order. Please add products.");
            return;
        }
        if (!isLoggedIn()){
            setSubmitError("Authentication error. Please log in again.");
            return;
        }

        setSubmitLoading(true);
        setSubmitError(null);

        // Prepare data for the API: needs product_id, quantity, unit_price
        const orderData = {
            items: orderItems.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity,
                unit_price: item.unit_price // The price fetched from the product list
            }))
        };

        try {
            const response = await api.orders.create(orderData);
            alert(`Order placed successfully! Order ID: ${response.data?.orderId}`);
            // Navigate to the new order's details page
            if (response.data?.orderId) {
                navigate(`/dashboard/orders/${response.data.orderId}`, { replace: true });
            } else {
                navigate('/dashboard/orders', { replace: true }); // Fallback
            }
        } catch (err) {
            console.error("Error creating order:", err);
            setSubmitError(err.response?.data?.error || "Failed to place order.");
            setSubmitLoading(false); // Only stop loading on error
        }
    };

    // --- Render Logic ---

    return (
        <div>
            <h1>Create New Order</h1>

            {/* Section 1: Available Products */}
            <div style={styles.section}>
                <h2>Available Products</h2>
                {productsLoading && <p>Loading products...</p>}
                {productsError && <p style={styles.error}>Error: {productsError}</p>}
                {!productsLoading && !productsError && availableProducts.length === 0 && <p>No products available to order.</p>}
                {!productsLoading && !productsError && availableProducts.length > 0 && (
                    <ul style={styles.productList}>
                        {availableProducts.map(product => (
                            <li key={product.id} style={styles.productListItem}>
                                <div>
                                    <strong>{product.name}</strong> ({product.sku})
                                    <br />
                                    <span style={styles.productPrice}>{formatCurrency(product.price)}</span>
                                    {product.description && <p style={styles.productDesc}>{product.description}</p>}
                                </div>
                                <button
                                    onClick={() => addProductToOrder(product)}
                                    style={styles.addButtonSmall}
                                    disabled={submitLoading}
                                >
                                    Add to Order
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Section 2: Current Order Items */}
            <div style={styles.section}>
                <h2>Your Order</h2>
                {orderItems.length === 0 ? (
                    <p>Add products from the list above to start your order.</p>
                ) : (
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Product</th>
                                <th style={styles.th}>Unit Price</th>
                                <th style={styles.th}>Quantity</th>
                                <th style={styles.th}>Subtotal</th>
                                <th style={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderItems.map(item => (
                                <tr key={item.product_id}>
                                    <td style={styles.td}>{item.name}</td>
                                    <td style={styles.td}>{formatCurrency(item.unit_price)}</td>
                                    <td style={styles.td}>
                                        <input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) => updateItemQuantity(item.product_id, e.target.value)}
                                            style={styles.quantityInput}
                                            disabled={submitLoading}
                                        />
                                    </td>
                                    <td style={styles.td}>{formatCurrency(calculateSubtotal(item))}</td>
                                    <td style={styles.td}>
                                        <button
                                            onClick={() => removeItemFromOrder(item.product_id)}
                                            style={styles.removeButtonSmall}
                                            disabled={submitLoading}
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="3" style={{...styles.td, textAlign: 'right', fontWeight: 'bold'}}>Grand Total:</td>
                                <td style={{...styles.td, fontWeight: 'bold'}}>{formatCurrency(calculateGrandTotal())}</td>
                                <td style={styles.td}></td> {/* Empty cell for actions column */}
                            </tr>
                        </tfoot>
                    </table>
                )}
            </div>

            {/* Section 3: Submission */}
            <div style={styles.submissionSection}>
                 {submitError && <p style={styles.submitError}>Error: {submitError}</p>}
                <button
                    type="button" // Changed from submit to button to use onClick handler
                    onClick={handleSubmit}
                    disabled={submitLoading || orderItems.length === 0}
                    style={styles.submitButton}
                >
                    {submitLoading ? 'Placing Order...' : 'Place Order'}
                </button>
                <button
                    type="button"
                    onClick={() => navigate(-1)} // Go back
                    disabled={submitLoading}
                    style={styles.cancelButton}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};


// Basic styles (adapt or move to CSS files/modules)
const styles = {
    section: {
        marginBottom: '30px',
        paddingBottom: '20px',
        borderBottom: '1px solid #eee',
    },
    productList: {
        listStyle: 'none',
        padding: 0,
    },
    productListItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 0',
        borderBottom: '1px dashed #eee',
    },
    productPrice: {
        fontWeight: 'bold',
        color: '#333',
    },
    productDesc: {
       fontSize: '0.9em',
       color: '#666',
       margin: '5px 0 0 0',
    },
    addButtonSmall: {
        padding: '6px 10px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '0.9em',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '10px',
    },
    th: {
        borderBottom: '2px solid #ddd',
        padding: '10px',
        textAlign: 'left',
        backgroundColor: '#f8f8f8',
    },
    td: {
        borderBottom: '1px solid #eee',
        padding: '10px',
        verticalAlign: 'middle',
    },
    quantityInput: {
        width: '60px',
        padding: '6px',
        textAlign: 'center',
        border: '1px solid #ccc',
        borderRadius: '4px',
    },
    removeButtonSmall: {
        padding: '5px 10px',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '0.9em',
    },
    submissionSection: {
        marginTop: '20px',
    },
    submitButton: {
        padding: '12px 20px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '1em',
        fontWeight: 'bold',
    },
    cancelButton: {
        marginLeft: '10px',
        padding: '12px 20px',
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '1em',
    },
    error: {
        color: 'red',
    },
     submitError: {
        color: 'red',
        border: '1px solid red',
        padding: '10px',
        borderRadius: '4px',
        backgroundColor: '#fdd',
        marginBottom: '15px',
    },
};

export default OrderForm;