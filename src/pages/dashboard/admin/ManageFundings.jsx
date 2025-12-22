import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import axiosSecure from "../../../api/axiosSecure";

const StatusBadge = ({ status }) => {
  const map = {
    pending: "badge-warning",
    approved: "badge-success",
    rejected: "badge-error",
  };
  return <span className={`badge badge-sm ${map[status] || "badge-ghost"}`}>{status}</span>;
};

const ManageFundings = () => {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);

  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const totalPages = useMemo(() => Math.max(Math.ceil(total / limit), 1), [total]);

  const load = async (p = page, s = status) => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/admin/fundings", {
        params: { page: p, limit, status: s || undefined },
      });

      setRows(res.data?.data || []);
      setTotal(res.data?.total || 0);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load fundings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1, status);
    
  }, [status]);

  useEffect(() => {
    load(page, status);
    
  }, [page]);

  const updateStatus = async (id, nextStatus) => {
    try {
      await axiosSecure.patch(`/admin/fundings/${id}/status`, { status: nextStatus });
      toast.success(`Funding marked ${nextStatus}`);
      load(page, status);
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
            <h1 className="text-2xl md:text-3xl font-extrabold">Manage Fundings</h1>
            <p className="text-sm text-base-content/70 mt-1">
              Approve or reject funding entries (Admin only).
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              className="select select-bordered rounded-2xl"
              value={status}
              onChange={(e) => {
                setPage(1);
                setStatus(e.target.value);
              }}
            >
              <option value="">All</option>
              <option value="pending">pending</option>
              <option value="approved">approved</option>
              <option value="rejected">rejected</option>
            </select>

            <button className="btn btn-outline rounded-2xl" onClick={() => load(page, status)}>
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
          <div className="p-6 text-base-content/70">No fundings found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Donor</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Txn</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((f) => (
                  <tr key={f._id} className="hover">
                    <td>
                      <div className="font-semibold">{f.name || "—"}</div>
                      <div className="text-xs text-base-content/60">{f.email || "—"}</div>
                    </td>
                    <td className="font-bold">৳ {f.amount}</td>
                    <td className="text-sm">{f.method || "—"}</td>
                    <td className="text-sm">{f.transactionId || "—"}</td>
                    <td><StatusBadge status={f.status} /></td>
                    <td className="text-sm">
                      {f.createdAt ? new Date(f.createdAt).toLocaleString() : "—"}
                    </td>
                    <td className="text-right">
                      {f.status === "pending" ? (
                        <div className="flex justify-end gap-2 flex-wrap">
                          <button
                            className="btn btn-xs btn-success rounded-xl"
                            onClick={() => updateStatus(f._id, "approved")}
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-xs btn-error rounded-xl"
                            onClick={() => updateStatus(f._id, "rejected")}
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-base-content/60">No actions</span>
                      )}
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

export default ManageFundings;
