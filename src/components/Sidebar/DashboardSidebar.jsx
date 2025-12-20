import { NavLink } from "react-router-dom";

const DashboardSidebar = () => {
  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded-lg font-medium ${
      isActive
        ? "bg-primary text-white"
        : "text-base-content hover:bg-base-200"
    }`;

  return (
    <aside className="w-64 bg-base-100 border-r border-base-300 min-h-screen p-4">
      <h2 className="text-xl font-bold mb-6">Donor Dashboard</h2>

      <nav className="space-y-2">
        <NavLink to="/dashboard" end className={linkClass}>
          Dashboard Home
        </NavLink>

        <NavLink to="/dashboard/profile" className={linkClass}>
          Profile
        </NavLink>

        <NavLink to="/dashboard/create-donation-request" className={linkClass}>
          Create Donation Request
        </NavLink>

        <NavLink to="/dashboard/my-donation-requests" className={linkClass}>
          My Donation Requests
        </NavLink>
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
