import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const SuperAdmindashboard = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === `/admin/${path}` || location.pathname.startsWith(`/admin/${path}/`);
  const isExactActive = (path) => location.pathname === `/admin/${path}`;

  return (
    <div className="min-h-screen flex bg-gray-100 mt-20">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4 flex-shrink-0">
        <h2 className="text-xl font-semibold text-purple-700 mb-4">Admin Dashboard</h2>
        <nav className="flex flex-col gap-2">
          <Link to="users" className={`p-2 rounded transition ${isActive('users') ? 'bg-purple-100 text-purple-900 font-semibold' : 'text-purple-800 hover:bg-purple-100'}`}>
            Manage Users
          </Link>
          <Link to="createadmin" className={`p-2 rounded transition ${isActive('users') ? 'bg-purple-100 text-purple-900 font-semibold' : 'text-purple-800 hover:bg-purple-100'}`}>
            createadmin
          </Link>
          <Link to="rfqs" className={`p-2 rounded transition ${isActive('rfqs') ? 'bg-purple-100 text-purple-900 font-semibold' : 'text-purple-800 hover:bg-purple-100'}`}>
            Manage RFQs
          </Link>
          <Link to="products" className={`p-2 rounded transition ${isActive('products') ? 'bg-purple-100 text-purple-900 font-semibold' : 'text-purple-800 hover:bg-purple-100'}`}>
            Manage Products
          </Link>
          <Link to="posts" className={`p-2 rounded transition ${isActive('posts') ? 'bg-purple-100 text-purple-900 font-semibold' : 'text-purple-800 hover:bg-purple-100'}`}>
            Manage Posts
          </Link>
          <Link to="orders" className={`p-2 rounded transition ${isActive('orders') ? 'bg-purple-100 text-purple-900 font-semibold' : 'text-purple-800 hover:bg-purple-100'}`}>
            Manage Orders
          </Link>
          <Link to="jobs" className={`p-2 rounded transition ${isActive('jobs') ? 'bg-purple-100 text-purple-900 font-semibold' : 'text-purple-800 hover:bg-purple-100'}`}>
            Manage Jobs
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1  p-6 bg-purple-50 m-4 rounded shadow">
        <Outlet />
      </main>
    </div>
  );
};

export default SuperAdmindashboard;
