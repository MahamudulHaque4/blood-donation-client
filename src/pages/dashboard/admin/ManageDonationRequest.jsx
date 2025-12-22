import React, { useEffect, useMemo, useState } from "react";
import axiosSecure from "../../../api/axiosSecure";
import toast from "react-hot-toast";

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

const ManageDonationRequests = () => {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);

  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const totalPages = useMemo(
    () => Math.max(Math.ceil(total / limit), 1),
    [total]
  );

  const load = async (p = page, s = statusFilter) => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/admin/donation-requests", {
        params: { page: p, limit, status: s || undefined },
      });

      setRows(res.data?.data || []);
      setTotal(res.data?.total || 0);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1, statusFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  useEffect(() => {
    load(page, statusFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const updateStatus = async (id, next) => {
    try {
      await axiosSecure.patch(`/donation-requests/${id}/status`, { status: next });
      toast.success(`Marked as ${next}`);
      load(page, statusFilter);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Status update failed");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold">
              Manage Donation Requests
            </h1>
            <p className="text-sm text-base-content/70 mt-1">
              Admin can view all requests and update status.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              className="select select-bordered rounded-2xl"
              value={statusFilter}
              onChange={(e) => {
                setPage(1);
                setStatusFilter(e.target.value);
              }}
            >
              <option value="">All</option>
              <option value="pending">pending</option>
              <option value="inprogress">inprogress</option>
              <option value="done">done</option>
              <option value="canceled">canceled</option>
            </select>

            <button
              className="btn btn-outline rounded-2xl"
              onClick={() => load(page, statusFilter)}
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-3xl border border-base-300 bg-base-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-base-300 text-sm text-base-content/70">
          Total: <span className="font-semibold">{total}</span> • Page{" "}
          <span className="font-semibold">{page}</span> /{" "}
          <span className="font-semibold">{totalPages}</span>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            <div className="skeleton h-10 w-full" />
            <div className="skeleton h-10 w-full" />
            <div className="skeleton h-10 w-full" />
          </div>
        ) : rows.length === 0 ? (
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
                  <th>Requester</th>
                  <th>Status</th>
                  <th className="text-right">Admin Actions</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((r) => (
                  <tr key={r._id} className="hover">
                    <td className="font-semibold">{r.recipientName}</td>
                    <td className="font-semibold">{r.bloodGroup}</td>
                    <td className="text-sm">
                      {r.recipientDistrict} • {r.recipientUpazila}
                      <div className="text-xs text-base-content/60">
                        {r.hospitalName}
                      </div>
                    </td>
                    <td className="text-sm">
                      {r.donationDate}
                      <div className="text-xs text-base-content/60">
                        {r.donationTime}
                      </div>
                    </td>
                    <td className="text-sm">
                      <div className="font-medium">{r.requesterName}</div>
                      <div className="text-xs text-base-content/60">
                        {r.requesterEmail}
                      </div>
                    </td>
                    <td>
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="text-right">
                      <div className="flex justify-end gap-2 flex-wrap">
                        <button
                          className="btn btn-xs btn-outline rounded-xl"
                          onClick={() => updateStatus(r._id, "pending")}
                          disabled={r.status === "pending"}
                        >
                          Pending
                        </button>
                        <button
                          className="btn btn-xs btn-info rounded-xl"
                          onClick={() => updateStatus(r._id, "inprogress")}
                          disabled={r.status === "inprogress"}
                        >
                          Inprogress
                        </button>
                        <button
                          className="btn btn-xs btn-success rounded-xl"
                          onClick={() => updateStatus(r._id, "done")}
                          disabled={r.status === "done"}
                        >
                          Done
                        </button>
                        <button
                          className="btn btn-xs btn-error rounded-xl"
                          onClick={() => updateStatus(r._id, "canceled")}
                          disabled={r.status === "canceled"}
                        >
                          Canceled
                        </button>
                      </div>
                      <div className="mt-2 text-xs text-base-content/60">
                        Donor can only do inprogress → done/canceled. Admin can set any.
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
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

export default ManageDonationRequests;
