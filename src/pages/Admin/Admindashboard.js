// src/pages/admin/Admindashboard.jsx
import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Users,         // For Manage Users
  FileText,      // For Manage RFQs
  Package,       // For Manage Products
  Newspaper,     // For Manage Posts
  ShoppingCart,  // For Manage Orders
  Briefcase,     // For Manage Jobs (example icon)
  Image,         // For Manage Gallery (example icon)
  UserPlus,      // For Create Admin
  ChevronLeft,
  ChevronRight,
  LogOut         // Added LogOut icon
} from 'lucide-react';

const Admindashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // --- Get user role from localStorage ---
  const userRole = localStorage.getItem('role'); // Role stored during login

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Helper function for active link styling
  const isActive = (path) =>
    location.pathname === `/admin/${path}` ||
    location.pathname.startsWith(`/admin/${path}/`);

  // Define navigation items as an array of objects
  const navItems = [
    // Note: Create Admin is handled conditionally below
    { to: 'users', label: 'Manage Users', icon: <Users size={20} /> },
    { to: 'rfqs', label: 'Manage RFQs', icon: <FileText size={20} /> },
    { to: 'products', label: 'Manage Products', icon: <Package size={20} /> },
    { to: 'posts', label: 'Manage Posts', icon: <Newspaper size={20} /> },
    { to: 'orders', label: 'Manage Orders', icon: <ShoppingCart size={20} /> },
    { to: 'jobs', label: 'Manage Jobs', icon: <Briefcase size={20} /> },
    { to: 'galleries', label: 'Manage Gallery', icon: <Image size={20} /> },
  ];

  // Define the Create Admin item separately for conditional rendering
  const createAdminItem = {
    to: 'create-admin',
    label: 'Create Admin',
    icon: <UserPlus size={20} />,
  };

  return (
    <div className="min-h-screen flex bg-gray-100 mt-20">
      {/* Sidebar */}
      <aside
        className={`${
          isCollapsed ? 'w-20' : 'w-64'
        } bg-white shadow-lg p-4 flex-shrink-0 transition-all duration-300 rounded-r-lg`}
      >
        {/* Header and Toggle Button */}
        <div className={`flex items-center justify-${isCollapsed ? 'center' : 'between'} mb-6`}>
          {!isCollapsed && (
            <h2 className="text-xl font-bold text-blue-700">Admin Panel</h2>
          )}
          <button
            onClick={toggleSidebar}
            className="text-blue-600 hover:text-blue-800 focus:outline-none"
          >
            {isCollapsed ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-3">
          {/* Conditionally render Create Admin link */}
          {userRole?.toLowerCase() === 'superadmin' && (
            <Link
              key={createAdminItem.to}
              to={createAdminItem.to}
              className={`flex items-center p-2 rounded-md transition duration-200 ${
                isActive(createAdminItem.to)
                  ? 'bg-blue-100 text-blue-900 font-semibold shadow-sm'
                  : 'text-blue-800 hover:bg-blue-50'
              } ${isCollapsed ? 'justify-center' : 'gap-2'}`}
            >
              {createAdminItem.icon}
              {!isCollapsed && <span>{createAdminItem.label}</span>}
            </Link>
          )}

          {/* Render the rest of the navigation items */}
          {navItems.map(({ to, label, icon }) => {
            const active = isActive(to);
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center p-2 rounded-md transition duration-200 ${
                  active
                    ? 'bg-blue-100 text-blue-900 font-semibold shadow-sm'
                    : 'text-blue-800 hover:bg-blue-50'
                } ${isCollapsed ? 'justify-center' : 'gap-2'}`}
              >
                {icon}
                {!isCollapsed && <span>{label}</span>}
              </Link>
            );
          })}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`flex items-center p-2 rounded-md transition duration-200 text-red-600 hover:bg-red-50 ${
              isCollapsed ? 'justify-center' : 'gap-2'
            }`}
          >
            <LogOut size={20} />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 bg-blue-50 m-2 sm:m-4 rounded-lg shadow-inner">
        <Outlet />
      </main>
    </div>
  );
};

export default Admindashboard;