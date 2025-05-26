import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  User,
  FileText,
  Send,
  Inbox,
  Package,
  Newspaper,
  ShoppingCart,
  Bell,
  LogOut
} from 'lucide-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const isActive = (path) =>
    location.pathname === `/dashboard/${path}` ||
    location.pathname.startsWith(`/dashboard/${path}/`);

  const isExactActive = (path) => location.pathname === `/dashboard/${path}`;

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const navItems = [
    { to: 'profile', label: 'Profile Management', icon: <User size={20} /> },
    { to: 'rfqs', label: 'My RFQs', icon: <FileText size={20} /> },
    { to: 'rfqs/published', label: 'Published RFQs', icon: <Send size={20} /> },
    { to: 'rfq-responses', label: 'My RFQ Responses', icon: <Inbox size={20} /> },
    { to: 'products', label: 'View Products', icon: <Package size={20} /> },
    { to: 'posts', label: 'View Posts', icon: <Newspaper size={20} /> },
    { to: 'orders', label: 'My Orders', icon: <ShoppingCart size={20} /> },
    { to: 'subscribe', label: 'Subscribe', icon: <Bell size={20} /> }
  ];

  return (
    <div className="min-h-screen flex bg-gray-100 mt-20">
      {/* Sidebar */}
      <aside
        className={`${
          isCollapsed ? 'w-20' : 'w-64'
        } bg-white shadow-lg p-4 flex-shrink-0 transition-all duration-300 rounded-r-lg`}
      >
        <div className={`flex items-center justify-${isCollapsed ? 'center' : 'between'} mb-6`}>
          {!isCollapsed && (
            <h2 className="text-xl font-bold text-blue-700">Dashboard</h2>
          )}
          <button
            onClick={toggleSidebar}
            className="text-blue-600 hover:text-blue-800 focus:outline-none"
          >
            {isCollapsed ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
          </button>
        </div>

        <nav className="flex flex-col gap-3">
          {navItems.map(({ to, label, icon }) => {
            const active = isActive(to) || isExactActive(to);
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
          
          {/* Logout Button - Placed right after the nav items */}
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

export default Dashboard;