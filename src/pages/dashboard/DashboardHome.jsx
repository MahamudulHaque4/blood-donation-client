import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const StatusBadge = ({ status }) => {
  const map = {
    pending: "badge-warning",
    inprogress: "badge-info",
    done: "badge-success",
    canceled: "badge-error",
  };
  return (
    <span className={`badge badge-sm ${map[status] || "badge-ghost"}`}>
      {status}
    </span>
  );
};

const StatCard = ({ title, value, desc }) => (
  <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
    <div className="text-sm text-base-content/60">{title}</div>
    <div className="mt-1 text-3xl font-extrabold">{value}</div>
    {desc ? <div className="mt-2 text-sm text-base-content/70">{desc}</div> : null}
  </div>
);

const DashboardHome = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [me, setMe] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  const counts = useMemo(() => {
    const c = { pending: 0, inprogress: 0, done: 0, canceled: 0 };
    recent.forEach((r) => {
      if (c[r.status] !== undefined) c[r.status] += 1;
    });
    return c;
  }, [recent]);

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      try {
        setLoading(true);

        const [meRes, recentRes] = await Promise.all([
          axiosSecure.get("/users/me"),
          axiosSecure.get("/donation-requests/my/recent"),
        ]);

        if (!ignore) {
          setMe(meRes.data);
          setRecent(recentRes.data || []);
        }
      } catch (err) {
        console.error(err);
        toast.error(err?.response?.data?.message || "Failed to load dashboard");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    load();
    return () => {
      ignore = true;
    };
  }, [axiosSecure]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-base-300 bg-base-100 p-5 md:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center gap-5 md:justify-between">
          <div className="flex items-center gap-4">
            <div className="avatar">
              <div className="w-14 rounded-full ring ring-primary/20 ring-offset-2 ring-offset-base-100">
                <img
                  src={user?.photoURL || "https://i.ibb.co/2kRzYQz/user.png"}
                  alt="avatar"
                />
              </div>
            </div>

            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold">
                Hi, <span className="text-primary">{user?.displayName || "Donor"}</span>
              </h1>
              <p className="text-sm text-base-content/70 mt-1">
                Email: <span className="font-medium">{user?.email}</span>
              </p>

              {me?.status === "blocked" && (
                <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-error/10 px-3 py-1 text-sm text-error">
                  <span className="w-2 h-2 rounded-full bg-error"></span>
                  You are blocked — creating/confirming requests is restricted.
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link to="/dashboard/create-donation-request" className="btn btn-primary rounded-2xl">
              Create Donation Request
            </Link>
            <Link to="/dashboard/my-donation-requests" className="btn btn-outline rounded-2xl">
              My Donation Requests
            </Link>
            <Link to="/dashboard/profile" className="btn btn-ghost rounded-2xl">
              Edit Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <StatCard title="Recent Pending" value={counts.pending} desc="Last 3 requests snapshot" />
        <StatCard title="Recent In Progress" value={counts.inprogress} desc="Donor assigned" />
        <StatCard title="Recent Done" value={counts.done} desc="Completed donations" />
        <StatCard title="Recent Canceled" value={counts.canceled} desc="Canceled requests" />
      </div>

      {/* Recent table */}
      <div className="rounded-3xl border border-base-300 bg-base-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-base-300 flex items-center justify-between">
          <h2 className="text-lg font-bold">Recent Requests (Last 3)</h2>
          <Link to="/dashboard/my-donation-requests" className="link link-hover text-primary">
            View all
          </Link>
        </div>

        {loading ? (
          <div className="p-6">
            <div className="skeleton h-4 w-1/3 mb-3"></div>
            <div className="skeleton h-12 w-full mb-2"></div>
            <div className="skeleton h-12 w-full mb-2"></div>
            <div className="skeleton h-12 w-full"></div>
          </div>
        ) : recent.length === 0 ? (
          <div className="p-6 text-base-content/70">
            No donation requests yet. Create your first one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Recipient</th>
                  <th>Blood</th>
                  <th>Location</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((r) => (
                  <tr key={r._id} className="hover">
                    <td className="font-medium">{r.recipientName}</td>
                    <td>{r.bloodGroup}</td>
                    <td>
                      {r.recipientDistrict} • {r.recipientUpazila}
                    </td>
                    <td>{r.donationDate}</td>
                    <td>{r.donationTime}</td>
                    <td>
                      <StatusBadge status={r.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;
