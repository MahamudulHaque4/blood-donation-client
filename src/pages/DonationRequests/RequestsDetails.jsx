import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
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
    <span className={`badge ${map[status] || "badge-ghost"} badge-sm`}>
      {status}
    </span>
  );
};

const RequestsDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const [authRequired, setAuthRequired] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      setAuthRequired(false);

      // ✅ Your backend requires JWT for this route, so we must use axiosSecure
      const res = await axiosSecure.get(`/donation-requests/${id}`);
      setData(res.data);
    } catch (err) {
      console.error(err);

      const status = err?.response?.status;
      const msg = err?.response?.data?.message;

      if (status === 401 || status === 403) {
        setAuthRequired(true);
        setData(null);
        return;
      }

      toast.error(msg || "Failed to load request details");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleConfirmDonate = async () => {
    if (!user?.email) {
      toast.error("Please login to donate.");
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    try {
      await axiosSecure.patch(`/donation-requests/${id}/confirm`);
      toast.success("Donation confirmed! Request is now inprogress.");
      load();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Confirm failed");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <p className="text-sm text-base-content/60">Donation Request Details</p>
            <h1 className="text-2xl md:text-3xl font-extrabold mt-1">
              {loading ? "Loading..." : data?.recipientName || "—"}
            </h1>
            <p className="text-sm text-base-content/70 mt-2">
              {data?.recipientDistrict ? (
                <>
                  {data.recipientDistrict} • {data.recipientUpazila}
                </>
              ) : (
                " "
              )}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {data?.status && <StatusBadge status={data.status} />}
            <Link to="/donation-requests" className="btn btn-outline rounded-2xl">
              Back
            </Link>
          </div>
        </div>
      </div>

      {/* If auth required */}
      {authRequired && (
        <div className="rounded-3xl border border-base-300 bg-base-100 p-8 shadow-sm text-center">
          <h2 className="text-xl font-extrabold">Login required</h2>
          <p className="text-sm text-base-content/70 mt-2">
            Your backend protects request details. Please login to view full details.
          </p>

          <div className="mt-5 flex justify-center gap-3">
            <button
              className="btn btn-primary rounded-2xl"
              onClick={() =>
                navigate("/login", { state: { from: location.pathname } })
              }
            >
              Login
            </button>
            <Link to="/donation-requests" className="btn btn-outline rounded-2xl">
              Back to Requests
            </Link>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && !authRequired && (
        <div className="rounded-3xl border border-base-300 bg-base-100 p-6">
          <div className="skeleton h-7 w-1/2 mb-3" />
          <div className="skeleton h-4 w-2/3 mb-2" />
          <div className="skeleton h-24 w-full mt-4" />
        </div>
      )}

      {/* Details */}
      {!loading && !authRequired && data && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left: main info */}
          <div className="lg:col-span-2 rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm space-y-5">
            <div className="flex flex-wrap gap-3">
              <div className="rounded-2xl bg-base-200 px-4 py-3">
                <div className="text-xs text-base-content/60">Blood Group</div>
                <div className="text-2xl font-extrabold">{data.bloodGroup}</div>
              </div>

              <div className="rounded-2xl bg-base-200 px-4 py-3">
                <div className="text-xs text-base-content/60">Donation Date</div>
                <div className="font-bold">{data.donationDate}</div>
                <div className="text-xs text-base-content/60">{data.donationTime}</div>
              </div>
            </div>

            <div className="rounded-2xl border border-base-300 p-5">
              <h3 className="font-extrabold text-lg">Hospital & Address</h3>
              <p className="mt-2 text-sm text-base-content/80">
                <span className="font-semibold">Hospital:</span> {data.hospitalName}
              </p>
              <p className="mt-1 text-sm text-base-content/80">
                <span className="font-semibold">Address:</span> {data.address}
              </p>
            </div>

            <div className="rounded-2xl border border-base-300 p-5">
              <h3 className="font-extrabold text-lg">Message</h3>
              <p className="mt-2 text-sm text-base-content/80 whitespace-pre-wrap">
                {data.message?.trim() ? data.message : "—"}
              </p>
            </div>
          </div>

          {/* Right: actions */}
          <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-extrabold">Actions</h3>

            <button
              onClick={handleConfirmDonate}
              className="btn btn-primary w-full rounded-2xl"
              disabled={data.status !== "pending"}
              title={data.status !== "pending" ? "Only pending can be confirmed" : ""}
            >
              Donate / Confirm
            </button>

            {data.status !== "pending" && (
              <p className="text-xs text-base-content/60">
                This request is <b>{data.status}</b>. Confirm is only available when status is <b>pending</b>.
              </p>
            )}

            {/* Donor info (if inprogress) */}
            <div className="divider" />

            <h4 className="font-bold">Donor</h4>
            {data?.donor?.name ? (
              <div className="rounded-2xl bg-base-200 p-4">
                <div className="font-semibold">{data.donor.name}</div>
                <div className="text-sm text-base-content/70">{data.donor.email}</div>
              </div>
            ) : (
              <p className="text-sm text-base-content/60">No donor assigned yet.</p>
            )}

            <div className="divider" />

            <h4 className="font-bold">Requester</h4>
            <div className="rounded-2xl bg-base-200 p-4">
              <div className="font-semibold">{data.requesterName || "—"}</div>
              <div className="text-sm text-base-content/70">{data.requesterEmail || "—"}</div>
            </div>

            <p className="text-xs text-base-content/60">
              Created: {data.createdAt ? new Date(data.createdAt).toLocaleString() : "—"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestsDetails;
