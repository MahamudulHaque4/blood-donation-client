import React, { useEffect, useMemo, useState } from "react";
import axiosSecure from "../../../api/axiosSecure";
import toast from "react-hot-toast";

const RoleBadge = ({ role }) => {
  const map = {
    admin: "badge-success",
    volunteer: "badge-info",
    donor: "badge-ghost",
  };
  return (
    <span className={`badge badge-sm ${map[role] || "badge-ghost"}`}>
      {role || "—"}
    </span>
  );
};

const StatusBadge = ({ status }) => {
  const map = {
    active: "badge-success",
    blocked: "badge-error",
  };
  return (
    <span className={`badge badge-sm ${map[status] || "badge-ghost"}`}>
      {status || "—"}
    </span>
  );
};

const ManageUsers = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);

  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const totalPages = useMemo(
    () => Math.max(Math.ceil((total || 0) / limit), 1),
    [total, limit]
  );

  const load = async (p = page, s = statusFilter) => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/admin/users", {
        params: { page: p, limit, status: s || undefined },
      });

      setRows(res.data?.users || []);
      setTotal(res.data?.total || 0);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    load(1, statusFilter);
    
  }, [statusFilter]);

  useEffect(() => {
    load(page, statusFilter);
    
  }, [page]);

  const updateStatus = async (id, next) => {
    try {
      setSaving(true);
      await axiosSecure.patch(`/admin/users/${id}/status`, { status: next });
      toast.success(`User marked ${next}`);
      load(page, statusFilter);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Status update failed");
    } finally {
      setSaving(false);
    }
  };

  const updateRole = async (id, next) => {
    try {
      setSaving(true);
      await axiosSecure.patch(`/admin/users/${id}/role`, { role: next });
      toast.success(`Role updated to ${next}`);
      load(page, statusFilter);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Role update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold">Manage Users</h1>
            <p className="text-sm text-base-content/70 mt-1">
              Change role and block/unblock users.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              className="select select-bordered rounded-2xl"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              disabled={loading}
            >
              <option value="">All</option>
              <option value="active">active</option>
              <option value="blocked">blocked</option>
            </select>

            <button
              className="btn btn-outline rounded-2xl"
              onClick={() => load(page, statusFilter)}
              disabled={loading}
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
          <div className="p-6 text-base-content/70">No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Blood</th>
                  <th>Location</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((u) => (
                  <tr key={u._id} className="hover">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="w-10 rounded-2xl">
                            <img
                              src={u.avatar || "https://i.ibb.co/7YF9B0Q/user.png"}
                              alt="avatar"
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-semibold">{u.name}</div>
                          <div className="text-xs text-base-content/60">{u.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="font-semibold">{u.bloodGroup || "—"}</td>

                    <td className="text-sm">
                      {u.district || "—"}
                      <span className="text-base-content/50"> • </span>
                      {u.upazila || "—"}
                    </td>

                    <td>
                      <RoleBadge role={u.role} />
                    </td>

                    <td>
                      <StatusBadge status={u.status} />
                    </td>

                    <td className="text-right">
                      <div className="flex justify-end gap-2 flex-wrap">
                        <select
                          className="select select-bordered select-sm rounded-xl"
                          value={u.role || "donor"}
                          disabled={saving}
                          onChange={(e) => updateRole(u._id, e.target.value)}
                        >
                          <option value="donor">donor</option>
                          <option value="volunteer">volunteer</option>
                          <option value="admin">admin</option>
                        </select>

                        {u.status === "active" ? (
                          <button
                            className="btn btn-sm btn-error rounded-2xl"
                            disabled={saving}
                            onClick={() => updateStatus(u._id, "blocked")}
                          >
                            Block
                          </button>
                        ) : (
                          <button
                            className="btn btn-sm btn-success rounded-2xl"
                            disabled={saving}
                            onClick={() => updateStatus(u._id, "active")}
                          >
                            Unblock
                          </button>
                        )}
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
            disabled={page <= 1 || loading}
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
            disabled={page >= totalPages || loading}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
