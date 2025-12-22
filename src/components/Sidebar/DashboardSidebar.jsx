import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosSecure from "../../api/axiosSecure";
import useAuth from "../../hooks/useAuth";

const DashboardSidebar = () => {
  const { user, loading } = useAuth();
  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);

  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded-xl font-medium transition ${
      isActive
        ? "bg-primary text-white"
        : "text-base-content hover:bg-base-200"
    }`;

  useEffect(() => {
    let ignore = false;

    const loadRole = async () => {
      try {
        if (!user?.email) {
          setRole(null);
          setRoleLoading(false);
          return;
        }

        setRoleLoading(true);
        const res = await axiosSecure.get("/users/me");
        if (!ignore) setRole(res.data?.role || "donor");
      } catch (err) {
        if (!ignore) setRole("donor");
      } finally {
        if (!ignore) setRoleLoading(false);
      }
    };

    loadRole();
    return () => {
      ignore = true;
    };
  }, [user?.email]);

  if (loading || roleLoading) {
    return (
      <aside className="w-64 bg-base-100 border-r border-base-300 min-h-screen p-4">
        <div className="skeleton h-6 w-32 mb-6" />
        <div className="space-y-3">
          <div className="skeleton h-10 w-full rounded-xl" />
          <div className="skeleton h-10 w-full rounded-xl" />
          <div className="skeleton h-10 w-full rounded-xl" />
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-64 bg-base-100 border-r border-base-300 min-h-screen p-4">
      {/* Title */}
      <h2 className="text-xl font-extrabold mb-6 capitalize">
        {role} Dashboard
      </h2>

      <nav className="space-y-1">
        {/* COMMON */}
        <NavLink to="/dashboard" end className={linkClass}>
          Dashboard Home
        </NavLink>

        <NavLink to="/dashboard/profile" className={linkClass}>
          Profile
        </NavLink>

        {/* DONOR */}
        {role === "donor" && (
          <>
            <NavLink
              to="/dashboard/create-donation-request"
              className={linkClass}
            >
              Create Donation Request
            </NavLink>

            <NavLink
              to="/dashboard/my-donation-requests"
              className={linkClass}
            >
              My Donation Requests
            </NavLink>
          </>
        )}

        {/* VOLUNTEER */}
        {role === "volunteer" && (
          <>
            <NavLink
              to="/dashboard/volunteer"
              end
              className={linkClass}
            >
              Volunteer Home
            </NavLink>

            <NavLink
              to="/dashboard/volunteer/donation-requests"
              className={linkClass}
            >
              Manage Requests
            </NavLink>
          </>
        )}

        {/* ADMIN */}
        {role === "admin" && (
          <>
            <NavLink
              to="/dashboard/admin"
              end
              className={linkClass}
            >
              Admin Home
            </NavLink>

            <NavLink
              to="/dashboard/admin/users"
              className={linkClass}
            >
              Manage Users
            </NavLink>

            <NavLink
              to="/dashboard/admin/donation-requests"
              className={linkClass}
            >
              Manage Requests
            </NavLink>
          </>
        )}
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
