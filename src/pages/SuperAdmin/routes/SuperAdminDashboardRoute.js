import React from 'react'; 
import { Route, Routes } from 'react-router-dom';

// Import all dashboard components
import Admindashboard from '../SuperAdmindashboard';
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
import CreateNewAdmin from '../Users/CreateNewAdmin';

const SuperAdminDashboardRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<Admindashboard />}>
        <Route index element={<UserListPage />} />  {/* Default content when just /admin */}
        <Route path="users" element={<UserListPage />} />
        <Route path="createadmin" element={<CreateNewAdmin/>}/>
        <Route path="users/:id" element={<UserDetailPage />} />
        <Route path="rfqs" element={<RfqListPage />} />
        <Route path="rfqs/:rfqId" element={<RfqDetailPage />} />
        <Route path="products" element={<ProductListPage />} />
        <Route path="products/create" element={<ProductCreatePage />} />
        <Route path="products/:productId/edit" element={<ProductEditPage />} />
        <Route path="posts" element={<PostListPage />} />
        <Route path="posts/create" element={<PostCreatePage />} />
        <Route path="posts/:postId" element={<PostDetailPage />} />
        <Route path="posts/:postId/edit" element={<PostEditPage />} />
        <Route path="orders" element={<OrderListPage />} />
        <Route path="orders/:orderId" element={<OrderDetailPage />} />
        <Route path="jobs" element={<JobPostListPage />} />
        <Route path="jobs/:jobId/edit" element={<JobPostEditPage />} />
      </Route>
    </Routes>
  );
};

export default SuperAdminDashboardRoute;
