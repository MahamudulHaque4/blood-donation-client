import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axiosSecure from "../../api/axiosSecure";

const StatCard = ({ title, value, hint }) => (
  <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm">
    <div className="text-sm text-base-content/60">{title}</div>
    <div className="mt-2 text-3xl font-extrabold">{value}</div>
    {hint && <div className="mt-2 text-xs text-base-content/60">{hint}</div>}
  </div>
);

const VolunteerDashboardHome = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDonors: 0,
    totalFunding: 0,
    totalRequests: 0,
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get("/stats/overview");
        setStats({
          totalDonors: res.data?.totalDonors || 0,
          totalFunding: res.data?.totalFunding || 0,
          totalRequests: res.data?.totalRequests || 0,
        });
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to load stats");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm">
        <h1 className="text-2xl md:text-3xl font-extrabold">Volunteer Dashboard</h1>
        <p className="text-sm text-base-content/70 mt-2">
          Monitor donors, requests and funding overview.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="skeleton h-32 w-full rounded-3xl" />
          <div className="skeleton h-32 w-full rounded-3xl" />
          <div className="skeleton h-32 w-full rounded-3xl" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Total Donors" value={stats.totalDonors} hint="All donors in database" />
          <StatCard title="Total Requests" value={stats.totalRequests} hint="All donation requests" />
          <StatCard title="Total Funding" value={stats.totalFunding} hint="Sum of funding amounts" />
        </div>
      )}
    </div>
  );
};

export default VolunteerDashboardHome;
