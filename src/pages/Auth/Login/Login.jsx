import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { AuthContext } from "../../../providers/AuthContext";
import Logo from "../../../components/Logo/Logo";

const Login = () => {
  const { signInUser, signInGoogle } = useContext(AuthContext);

  const location = useLocation();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      await signInUser(email, password);
      navigate(location.state?.from || "/", { replace: true });
    } catch (err) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await signInGoogle();
      navigate(location.state?.from || "/", { replace: true });
    } catch (err) {
      setError(err?.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-base-200 px-6 py-12">
      {/* soft bg */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-secondary/15 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="rounded-3xl border border-base-300 bg-base-100/80 backdrop-blur p-6 md:p-8 shadow-sm">
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
              />

              <div className="mt-2 text-right">
                <Link to="/forgot-password" className="link link-hover text-sm">
                  Forgot password?
                </Link>
              </div>
            </div>

            {error && (
              <div className="alert alert-error rounded-2xl">
                <span className="text-sm">{error}</span>
              </div>
            )}

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

          {/* <div className="divider my-6">OR</div> */}

          {/* <button
            type="button"
            onClick={handleGoogleLogin}
            className="btn btn-outline w-full rounded-2xl flex items-center gap-2"
            disabled={loading}
          >
            <img
              src="https://img.icons8.com/color/48/google-logo.png"
              alt="Google"
              className="w-5 h-5"
            />
            Continue with Google
          </button> */}

          <p className="mt-5 text-center text-sm text-base-content/70">
            Don’t have an account?{" "}
            <Link
            state = {location.state}
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
