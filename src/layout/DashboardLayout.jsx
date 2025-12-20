import React from "react";
import { Outlet } from "react-router-dom";
import DashboardSidebar from "../components/Sidebar/DashboardSidebar"; // adjust path if needed

const DashboardLayout = () => {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main content */}
      <main className="flex-1 bg-base-200 p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;


