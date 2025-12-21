import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { AuthContext } from "../../../providers/AuthContext";
import Logo from "../../../components/Logo/Logo";
import axiosPublic from "../../../api/axiosPublic";

const Login = () => {
  const { signInUser } = useContext(AuthContext);

  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    // ✅ remove old token first
    localStorage.removeItem("access-token");

    setLoading(true);

    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    // ✅ loading toast
    const toastId = toast.loading("Logging in...");

    try {
      // ✅ 1) Firebase login
      await signInUser(email, password);

      // ✅ 2) Get custom JWT from backend
      const jwtRes = await axiosPublic.post("/jwt", { email });
      const token = jwtRes?.data?.token;

      if (!token) {
        // ✅ don't show firebase errors; show clean message
        throw new Error("Unable to create session token. Please try again.");
      }

      // ✅ 3) Save token
      localStorage.setItem("access-token", token);

      // ✅ 4) Success toast + Navigate
      toast.success("Login successful!", { id: toastId });
      navigate(location.state?.from || "/", { replace: true });
    } catch (err) {
      // ✅ Do NOT show firebase error messages
      // Show clean, user-friendly messages only
      const status = err?.response?.status;

      // backend error message if you send friendly messages from server
      const serverMsg = err?.response?.data?.message;

      let message = "Login failed. Please try again.";

      // Prefer server friendly message if exists
      if (serverMsg && typeof serverMsg === "string") {
        message = serverMsg;
      } else if (status === 401) {
        message = "Invalid email or password.";
      } else if (status === 403) {
        message = "Access denied. Please contact support.";
      } else if (status >= 500) {
        message = "Server error. Please try again later.";
      } else if (
        err?.message === "Unable to create session token. Please try again."
      ) {
        message = err.message;
      }

      toast.error(message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-base-200 px-6 py-12">
      {/* soft background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-secondary/15 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="rounded-3xl border border-base-300 bg-base-100/80 backdrop-blur p-6 md:p-8 shadow-sm">
          {/* Header */}
          <div className="space-y-3 text-center flex flex-col items-center">
            <Logo />
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                Welcome <span className="text-primary">Back</span>
              </h1>
              <p className="mt-2 text-sm text-base-content/70">
                Login to continue and manage your donor profile.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="mt-7 space-y-4">
            <div>
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <input
                name="email"
                type="email"
                placeholder="Enter your email"
                className="input input-bordered w-full rounded-2xl"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <input
                name="password"
                type="password"
                placeholder="Enter your password"
                className="input input-bordered w-full rounded-2xl"
                required
                autoComplete="current-password"
              />

              <div className="mt-2 text-right">
                <Link to="/forgot-password" className="link link-hover text-sm">
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full rounded-2xl"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="loading loading-spinner loading-sm" />
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-base-content/70">
            Don’t have an account?{" "}
            <Link
              state={location.state}
              to="/register"
              className="link link-hover text-primary font-semibold"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
