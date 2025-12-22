import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import axiosPublic from "../../api/axiosPublic";
import axiosSecure from "../../api/axiosSecure";
import useAuth from "../../hooks/useAuth";

const Funding = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);

  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("bkash"); // default
  const [transactionId, setTransactionId] = useState("");
  const [paying, setPaying] = useState(false);

  const totalAmountVisible = useMemo(
    () => rows.reduce((sum, r) => sum + (Number(r.amount) || 0), 0),
    [rows]
  );

  const load = async () => {
    try {
      setLoading(true);
      const res = await axiosPublic.get("/fundings/public", {
        params: { page: 1, limit: 20 },
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
    load();
  }, []);

  const handleDonate = async (e) => {
    e.preventDefault();

    if (!user?.email) {
      toast.error("Please login to donate");
      return;
    }

    const num = Number(amount);
    if (!num || num <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    try {
      setPaying(true);

      await axiosSecure.post("/fundings", {
        amount: num,
        method,
        transactionId: transactionId.trim(),
      });

      toast.success("Thanks! Funding submitted ");
      setAmount("");
      setMethod("bkash");
      setTransactionId("");
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Funding failed");
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm">
        <h1 className="text-2xl md:text-3xl font-extrabold">Funding</h1>
        <p className="text-sm text-base-content/70 mt-2">
          Support the platform with a small donation.
        </p>
      </div>

      {/* Donate form */}
      <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm">
        <h2 className="font-extrabold text-lg">Make a Donation</h2>

        <form
          onSubmit={handleDonate}
          className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3"
        >
          <input
            type="number"
            className="input input-bordered rounded-2xl"
            placeholder="Amount (৳)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <select
            className="select select-bordered rounded-2xl"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
          >
            <option value="bkash">bkash</option>
            <option value="nagad">nagad</option>
            <option value="rocket">rocket</option>
            <option value="card">card</option>
            <option value="cash">cash</option>
          </select>

          <input
            type="text"
            className="input input-bordered rounded-2xl"
            placeholder="Transaction ID (optional)"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
          />

          <button disabled={paying} className="btn btn-primary rounded-2xl">
            {paying ? "Submitting..." : "Donate"}
          </button>
        </form>

        {!user?.email && (
          <p className="text-xs text-base-content/60 mt-2">
            Login required to submit a donation.
          </p>
        )}
      </div>

      {/* Funding list */}
      <div className="rounded-3xl border border-base-300 bg-base-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-base-300 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div className="text-sm text-base-content/70">
            Total entries: <span className="font-semibold">{total}</span>
          </div>

          <div className="text-sm text-base-content/70">
            Visible total:{" "}
            <span className="font-semibold">৳ {totalAmountVisible}</span>
          </div>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            <div className="skeleton h-10 w-full" />
            <div className="skeleton h-10 w-full" />
            <div className="skeleton h-10 w-full" />
          </div>
        ) : rows.length === 0 ? (
          <div className="p-6 text-base-content/70">No fundings yet.</div>
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
                </tr>
              </thead>

              <tbody>
                {rows.map((f) => (
                  <tr key={f._id}>
                    <td>
                      <div className="font-semibold">{f.name || "—"}</div>
                      <div className="text-xs text-base-content/60">
                        {f.email || "—"}
                      </div>
                    </td>
                    <td className="font-bold">৳ {f.amount}</td>
                    <td className="text-sm">{f.method || "—"}</td>
                    <td className="text-sm">{f.transactionId || "—"}</td>
                    <td className="text-sm">{f.status || "—"}</td>
                    <td className="text-sm">
                      {f.createdAt ? new Date(f.createdAt).toLocaleString() : "—"}
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

export default Funding;
