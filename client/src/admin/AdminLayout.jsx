import React from "react";
import { Outlet, NavLink } from "react-router-dom";

function AdminLayout() {
  const activeLinkStyle = {
    backgroundColor: "#0284C7",
    color: "white",
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <aside className="w-full md:w-52 flex-shrink-0">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Admin Panel
        </h2>
        <nav className="flex flex-col gap-2">
          <NavLink
            to="/admin/users"
            style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
            className="p-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Upravljanje korisnicima
          </NavLink>
          <NavLink
            to="/admin/lessons"
            style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
            className="p-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Upravljanje lekcijama
          </NavLink>
        </nav>
      </aside>

      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
