import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import axiosSecure from "../api/axiosSecure";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  const [role, setRole] = React.useState(null);
  const [roleLoading, setRoleLoading] = React.useState(true);

  React.useEffect(() => {
    let ignore = false;

    const run = async () => {
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
        if (!ignore) setRole(null);
      } finally {
        if (!ignore) setRoleLoading(false);
      }
    };

    run();
    return () => {
      ignore = true;
    };
  }, [user?.email]);

  if (loading || roleLoading) {
    return (
      <div className="p-10">
        <div className="skeleton h-8 w-56 mb-4" />
        <div className="skeleton h-28 w-full" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminRoute;
