import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import axiosSecure from "../../api/axiosSecure";

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

const AllDonationRequests = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);

  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [loading, setLoading] = useState(true);

  const totalPages = useMemo(
    () => Math.max(Math.ceil(total / limit), 1),
    [total]
  );

  const load = async (p = page, s = status) => {
    try {
      setLoading(true);

      
      const res = await axiosSecure.get("/donation-requests/all", {
        params: { page: p, limit, status: s || undefined },
      });

 
      setData(res.data?.data || []);
      setTotal(res.data?.total || 0);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to load all requests");
      setData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    load(1, status);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    load(page, status);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const updateStatus = async (id, nextStatus) => {
    try {
      await axiosSecure.patch(`/donation-requests/${id}/status`, {
        status: nextStatus,
      });
      toast.success(`Updated to ${nextStatus}`);
      load(page, status);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Status update failed");
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-base-300 bg-base-100 p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold">
              All Donation Requests
            </h1>
            <p className="text-sm text-base-content/70 mt-1">
              Volunteer/Admin can monitor and update request status.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              className="select select-bordered rounded-2xl"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="pending">pending</option>
              <option value="inprogress">inprogress</option>
              <option value="done">done</option>
              <option value="canceled">canceled</option>
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-base-300 bg-base-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-base-300 flex items-center justify-between">
          <div className="text-sm text-base-content/70">
            Total: <span className="font-semibold">{total}</span> • Page{" "}
            <span className="font-semibold">{page}</span> /{" "}
            <span className="font-semibold">{totalPages}</span>
          </div>
        </div>

        {loading ? (
          <div className="p-6">
            <div className="skeleton h-12 w-full mb-3" />
            <div className="skeleton h-12 w-full mb-3" />
            <div className="skeleton h-12 w-full" />
          </div>
        ) : data.length === 0 ? (
          <div className="p-6 text-base-content/70">No requests found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Recipient</th>
                  <th>Blood</th>
                  <th>Location</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                  <th>Requester</th>
                  <th>Donor</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {data.map((r) => (
                  <tr key={r._id} className="hover">
                    <td className="font-medium">
                      <Link
                        className="link link-hover"
                       
                        to={`/donation-requests/${r._id}`}
                      >
                        {r.recipientName}
                      </Link>
                    </td>
                    <td>{r.bloodGroup}</td>
                    <td>
                      <div className="text-sm">
                        {r.recipientDistrict} • {r.recipientUpazila}
                      </div>
                      <div className="text-xs text-base-content/60">
                        {r.hospitalName}
                      </div>
                    </td>
                    <td>
                      <div className="text-sm">{r.donationDate}</div>
                      <div className="text-xs text-base-content/60">
                        {r.donationTime}
                      </div>
                    </td>
                    <td>
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="text-sm">
                      <div className="font-medium">{r.requesterName || "—"}</div>
                      <div className="text-xs text-base-content/60">
                        {r.requesterEmail || "—"}
                      </div>
                    </td>
                    <td className="text-sm">
                      {r?.donor?.name ? (
                        <>
                          <div className="font-medium">{r.donor.name}</div>
                          <div className="text-xs text-base-content/60">
                            {r.donor.email}
                          </div>
                        </>
                      ) : (
                        <span className="text-base-content/60">—</span>
                      )}
                    </td>

                    <td className="text-right">
                      <div className="flex justify-end gap-2 flex-wrap">
                        {r.status === "pending" && (
                          <button
                            className="btn btn-xs btn-info rounded-xl"
                            onClick={() => updateStatus(r._id, "inprogress")}
                            title="Move to inprogress"
                          >
                            In Progress
                          </button>
                        )}

                        {r.status === "inprogress" && (
                          <>
                            <button
                              className="btn btn-xs btn-success rounded-xl"
                              onClick={() => updateStatus(r._id, "done")}
                            >
                              Done
                            </button>
                            <button
                              className="btn btn-xs btn-error rounded-xl"
                              onClick={() => updateStatus(r._id, "canceled")}
                            >
                              Cancel
                            </button>
                          </>
                        )}

                        {(r.status === "done" || r.status === "canceled") && (
                          <span className="text-xs text-base-content/60">
                            No actions
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-4 border-t border-base-300 flex items-center justify-between">
          <button
            className="btn btn-sm rounded-2xl"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </button>

          <div className="text-sm text-base-content/70">
            Page <span className="font-semibold">{page}</span> of{" "}
            <span className="font-semibold">{totalPages}</span>
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
    </div>
  );
};

export default AllDonationRequests;
