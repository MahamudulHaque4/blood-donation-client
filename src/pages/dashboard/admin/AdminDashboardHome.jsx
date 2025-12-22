import React, { useEffect, useState } from "react";
import axiosSecure from "../../../api/axiosSecure";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const StatCard = ({ title, value, hint }) => (
  <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm">
    <p className="text-sm text-base-content/60">{title}</p>
    <div className="mt-2 text-3xl font-extrabold">{value}</div>
    {hint && <p className="mt-2 text-xs text-base-content/60">{hint}</p>}
  </div>
);

const AdminDashboardHome = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDonors: 0,
    totalFunding: 0,
    totalRequests: 0,
  });

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get("/stats/overview");
        if (!ignore) setStats(res.data || {});
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to load stats");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    load();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm">
        <h1 className="text-2xl md:text-3xl font-extrabold">Admin Dashboard</h1>
        <p className="text-sm text-base-content/70 mt-1">
          Manage users, requests, and monitor platform health.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link to="/dashboard/admin/users" className="btn btn-primary rounded-2xl">
            Manage Users
          </Link>
          <Link
            to="/dashboard/admin/donation-requests"
            className="btn btn-outline rounded-2xl"
          >
            Manage Requests
          </Link>
        </div>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="skeleton h-32 w-full rounded-3xl" />
          <div className="skeleton h-32 w-full rounded-3xl" />
          <div className="skeleton h-32 w-full rounded-3xl" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Total Donors" value={stats.totalDonors ?? 0} />
          <StatCard
            title="Total Funding"
            value={`৳ ${stats.totalFunding ?? 0}`}
            hint="Sum of all fundings"
          />
          <StatCard title="Total Requests" value={stats.totalRequests ?? 0} />
        </div>
      )}
    </div>
  );
};

export default AdminDashboardHome;
