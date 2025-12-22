import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import axiosSecure from "../api/axiosSecure";
import useAuth from "../hooks/useAuth";

const VolunteerRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  const [roleLoading, setRoleLoading] = useState(true);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const run = async () => {
      try {
        setRoleLoading(true);

        // must be logged in first
        if (!user?.email) {
          setOk(false);
          return;
        }

        const res = await axiosSecure.get("/users/me");
        const role = res.data?.role;

        
        setOk(role === "volunteer" || role === "admin");
      } catch (e) {
        setOk(false);
      } finally {
        setRoleLoading(false);
      }
    };

    run();
  }, [user?.email]);

  if (loading || roleLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (!user?.email) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (!ok) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default VolunteerRoute;
