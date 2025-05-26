import React from 'react';
import { Route, Routes } from 'react-router-dom';

// Import all dashboard components
import Dashboard from '../dashboard'; // Assuming this is the layout component
import Profile from '../UserProfile/ProfileManagement';
import { RFQManagement } from '../RFQ/RFQManagement';
import RFQItems from '../RFQ/RFQItems';
import RFQResponses from '../RFQ/RFQResponse';
import ProductList from '../Products/ProductList';
import ProductDetail from '../Products/ProductDetails'; // Corrected import name if needed
import PostList from '../Posts/PostList';
import PostForm from '../Posts/PostForm';
import PostDetails from '../Posts/PostDetails';
import OrderList from '../Orders/OrderList';
import OrderForm from '../Orders/OrderForm';
import OrderDetails from '../Orders/OrderDetails';
import CommentList from '../Comments/CommentList';
import CommentForm from '../Comments/CommentForm';
import SubscriptionForm from '../Subscriptions/SubscriptionForm';
import LogoutPage from '../../Logout/Logout';
const DashboardRoutes = () => {
  return (
    // Assuming Dashboard is a layout component that includes an <Outlet />
    // where the nested routes will render.
    <Routes>
      <Route path="/" element={<Dashboard />}>
        {/* Default content when just at the parent route's path */}
        {/* If Profile is the default, use index */}
        <Route index element={<Profile />} />

        {/* Use relative paths for nested routes */}
        <Route path="profile" element={<Profile />} />
        <Route path="rfqs" element={<RFQManagement />} />
        <Route path="rfqs/published" element={<RFQItems />} />
        <Route path="rfq-responses" element={<RFQResponses />} />

        {/* --- CORRECTED PRODUCT ROUTES --- */}
        <Route path="products" element={<ProductList />} />
        <Route path="products/:id" element={<ProductDetail />} />
        {/* -------------------------------- */}

        <Route path="posts" element={<PostList />} />
        <Route path="posts/create" element={<PostForm />} />
        <Route path="posts/new" element={<PostForm />} /> {/* Use 'new' instead of 'create' for convention */}
        <Route path="posts/:slug" element={<PostDetails />} />
        <Route path="posts/:slug/edit" element={<PostForm />} />

        <Route path="orders" element={<OrderList />} />
        <Route path="orders/new" element={<OrderForm />} />
        <Route path="orders/:orderId" element={<OrderDetails />} />
        <Route path="comments" element={<CommentList />} />
        <Route path="comments/new" element={<CommentForm />} />
        <Route path="subscribe" element={<SubscriptionForm />} />
        <Route path="/logout" element={<LogoutPage />} />
        

         {/* Optional: Add a catch-all for unknown routes within the dashboard */}
         {/* <Route path="*" element={<NotFound />} /> */}
      </Route>
    </Routes>
  );
};

export default DashboardRoutes;