// src/routes/MainRoutes.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';

// Import all dashboard components
import Home from '../pages/Home/Home';
import About from '../pages/About/About';
import ProductService from '../pages/ProductService/ProductServcie';
import Projects from '../pages/Project.js/Project';
import Contact from '../pages/Contact/Contact';
import Blog from '../pages/Blog/Blog';
import Gallery from '../pages/Gallery/Gallery';
import JobPost from '../pages/Job/JobPost';
import LoginPage from '../pages/Login';
import Product from '../pages/Product/Product';
import TestimonialSlider from '../pages/Testimonial-page';
import PriceRequest from '../pages/PriceRequest/PriceRequest';
import RegisterPage from '../pages/Register';
import DashboardRoutes from '../pages/Users/routes/DashboardRoutes';
import UserProtectedRoute from './UserProtectedRoute';
import AdminDashboardRoute from '../pages/Admin/routes/AdminDashboardRoute';
import SuperAdminDashboardRoute from '../pages/SuperAdmin/routes/SuperAdminDashboardRoute';
// import Admindashboard from '../pages/Admin/Admindashboard'; // You don't need this line here

const MainRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/service" element={<ProductService />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/contacts" element={<Contact />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/jobs" element={<JobPost />} />
      <Route path="/request-price" element={<PriceRequest />} />
      <Route path="/product" element={<Product />} />
      <Route path="/testimonials" element={<TestimonialSlider />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* User Dashboard Routes */}
      <Route path="/userdashboard/*" element={<UserProtectedRoute />}>
        <Route path="*" element={<DashboardRoutes />} />
      </Route>

      {/* Admin Dashboard Routes */}
      <Route path="/admin/*" element={<AdminDashboardRoute />} />
      {/* SuperAdmin Dashboard Routes */}
      <Route path="/superadmin/*" element={<SuperAdminDashboardRoute />} />
    </Routes>
  );
};

export default MainRoutes;
