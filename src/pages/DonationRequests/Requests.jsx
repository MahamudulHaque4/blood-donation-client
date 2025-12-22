import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosPublic from "../../api/axiosPublic";
import axiosSecure from "../../api/axiosSecure";
import useAuth from "../../hooks/useAuth";

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

const Requests = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); 

  const [requests, setRequests] = useState([]);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(1);
  const limit = 6;
  const [loading, setLoading] = useState(true);

  const totalPages = useMemo(
    () => Math.max(Math.ceil(total / limit), 1),
    [total]
  );

  const load = async (p = page) => {
    try {
      setLoading(true);
      const res = await axiosPublic.get("/donation-requests/public", {
        params: { page: p, limit },
      });

      setRequests(res.data?.data || []);
      setTotal(res.data?.total || 0);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleConfirmDonate = async (id) => {
    if (!user?.email) {
      toast.error("Please login to donate.");
      navigate("/login", { state: { from: "/donation-requests" } });
      return;
    }

    try {
      await axiosSecure.patch(`/donation-requests/${id}/confirm`);
      toast.success("Donation confirmed! (Request is now inprogress)");
      load(page);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Confirm failed");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top header */}
      <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold">
              Blood Donation Requests
            </h1>
            <p className="text-sm text-base-content/70 mt-1">
              Public requests (only <b>pending</b>) • Donate and save lives.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/search-donors" className="btn btn-outline rounded-2xl">
              Search Donors
            </Link>

            <Link
              to="/dashboard/create-donation-request"
              className="btn btn-primary rounded-2xl"
            >
              Create Request
            </Link>
          </div>
        </div>
      </div>

      {/* Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-3xl border border-base-300 bg-base-100 p-5">
              <div className="skeleton h-6 w-3/4 mb-3" />
              <div className="skeleton h-4 w-1/2 mb-2" />
              <div className="skeleton h-4 w-full mb-2" />
              <div className="skeleton h-10 w-full mt-4" />
            </div>
          ))}
        </div>
      ) : requests.length === 0 ? (
        <div className="rounded-3xl border border-base-300 bg-base-100 p-8 text-center text-base-content/70">
          No pending requests right now.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {requests.map((r) => (
            <div
              key={r._id}
              className="rounded-3xl border border-base-300 bg-base-100 p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-extrabold">{r.recipientName}</h2>
                  <p className="text-sm text-base-content/70">
                    {r.recipientDistrict} • {r.recipientUpazila}
                  </p>
                </div>
                <StatusBadge status={r.status} />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-base-200 p-3">
                  <div className="text-xs text-base-content/60">Blood Group</div>
                  <div className="text-xl font-extrabold">{r.bloodGroup}</div>
                </div>
                <div className="rounded-2xl bg-base-200 p-3">
                  <div className="text-xs text-base-content/60">Donation Date</div>
                  <div className="font-bold">{r.donationDate}</div>
                  <div className="text-xs text-base-content/60">{r.donationTime}</div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  to={`/donation-requests/${r._id}`}
                  className="btn btn-outline btn-sm rounded-2xl flex-1"
                >
                  View Details
                </Link>

                <button
                  onClick={() => handleConfirmDonate(r._id)}
                  className="btn btn-primary btn-sm rounded-2xl flex-1"
                >
                  Donate / Confirm
                </button>
              </div>

              <p className="mt-3 text-xs text-base-content/60">
                Created: {new Date(r.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="rounded-3xl border border-base-300 bg-base-100 p-4 shadow-sm flex items-center justify-between">
        <button
          className="btn btn-sm rounded-2xl"
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </button>

        <div className="text-sm text-base-content/70">
          Page <span className="font-semibold">{page}</span> of{" "}
          <span className="font-semibold">{totalPages}</span> • Total{" "}
          <span className="font-semibold">{total}</span>
        </div>

        <button
          className="btn btn-sm rounded-2xl"
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Requests;
