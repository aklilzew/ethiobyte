import React from 'react';
import { Route, Routes } from 'react-router-dom';

// Import all dashboard components
import Admindashboard from '../Admindashboard';
import RfqListPage from '../rfq/RfqListPage';
import RfqDetailPage from '../rfq/RfqDetailPage';
import ProductCreatePage from '../Products/ProductCreatePage';
import ProductEditPage from '../Products/ProductEditPage';
import ProductListPage from '../Products/ProductListPage';
import PostCreatePage from '../Posts/PostCreatePage';
import PostDetailPage from '../Posts/PostDetailPage';
import PostEditPage from '../Posts/PostEditPage';
import PostListPage from '../Posts/PostListPage';
import OrderDetailPage from '../Orders/OrderDetailPage';
import OrderListPage from '../Orders/OrderListPage';
import JobPostEditPage from '../Jobs/JobPostEditPage';
import JobPostListPage from '../Jobs/JobPostListPage';
import UserDetailPage from '../Users/UserDetailPage';
import UserListPage from '../Users/UserListPage';
import CreateAdminPage from '../createAdmin/CreateAdminPage';
import JobPostCreatePage from '../Jobs/JobPostCreatePage';
import GalleryListPage from '../Gallery/GalleryListPage';
import GalleryCreatePage from '../Gallery/GalleryCreatePage';
import GalleryDetailPage from '../Gallery/GalleryDetailPage';
import LogoutPage from '../../Logout/Logout';

const AdminDashboardRoutes = () => {
  return (
    <Routes>
      {/* Ensure Admindashboard provides an <Outlet /> for nested routes */}
      <Route path="/" element={<Admindashboard />}>
        {/* Use a more explicit default or remove index if Admindashboard itself shows something */}
        <Route index element={<UserListPage />} />
        <Route path="users" element={<UserListPage />} />
        <Route path="create-admin" element={<CreateAdminPage />} />
        <Route path="users/:userId" element={<UserDetailPage />} />
        <Route path="rfqs" element={<RfqListPage />} />
        <Route path="rfqs/edit/:rfqId" element={<RfqDetailPage />} />
        <Route path="products" element={<ProductListPage />} />
        <Route path="products/new" element={<ProductCreatePage />} />
        {/* Assuming product IDs are numbers, :productId is fine */}
        <Route path="products/edit/:productId" element={<ProductEditPage />} />

        {/* ----- POST ROUTES - CORRECTED ----- */}
        <Route path="posts" element={<PostListPage />} />
        <Route path="posts/new" element={<PostCreatePage />} />
        {/* Use :slug for the view route, matching PostDetailPage and PostListPage link */}
        <Route path="posts/view/:slug" element={<PostDetailPage />} />
        {/* Use :id for the edit route, matching PostEditPage and PostListPage link */}
        <Route path="posts/edit/:id" element={<PostEditPage />} />
        {/* ----- END POST ROUTES CORRECTION ----- */}

        <Route path="orders" element={<OrderListPage />} />
        <Route path="orders/:id" element={<OrderDetailPage />} />
        <Route path="jobs" element={<JobPostListPage />} />
        <Route path="jobs/new" element={<JobPostCreatePage />} />
         {/* Assuming job IDs are numbers, :jobId is fine */}
        <Route path="jobs/:jobId/edit" element={<JobPostEditPage />} />
        <Route path="galleries" element={<GalleryListPage />} />
         <Route path="galleries/new" element={<GalleryCreatePage />} />
         <Route path="galleries/:id" element={<GalleryDetailPage />} />
         <Route path="/logout" element={<LogoutPage />} />


         {/* Add a catch-all or Not Found route within the dashboard if desired */}
         {/* <Route path="*" element={<div>Admin Section Not Found</div>} /> */}
      </Route>
    </Routes>
  );
};

export default AdminDashboardRoutes;