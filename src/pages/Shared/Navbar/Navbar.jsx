import React, { useMemo } from "react";
import { Link, NavLink } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import useRole from "../../../hooks/useRole";
import Logo from "../../../components/Logo/Logo";

const Navbar = () => {
  const { user, logOut, loading } = useAuth();
  const { role, roleLoading } = useRole();

  const dashboardLabel = useMemo(() => {
    if (role === "admin") return "Admin Dashboard";
    if (role === "volunteer") return "Volunteer Dashboard";
    return "Dashboard";
  }, [role]);

  const navClass = ({ isActive }) =>
    `font-semibold px-3 py-2 rounded-xl transition ${
      isActive ? "text-primary bg-base-200" : "hover:bg-base-200"
    }`;

  const handleLogOut = async () => {
    try {
      await logOut(); // logOut already removes token in your AuthProvider
    } catch (error) {
      console.log(error);
    }
  };

  const avatarSrc =
    typeof user?.photoURL === "string" && user.photoURL.trim()
      ? user.photoURL
      : "https://i.ibb.co/2n0xq7y/avatar.png";

  return (
    <div className="navbar bg-base-100 shadow-sm px-2 md:px-6">
      {/* Left */}
      <div className="navbar-start">
        {/* Mobile menu */}
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>

          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-56 p-2 shadow"
          >
            <li>
              <NavLink to="/" className={navClass}>
                Home
              </NavLink>
            </li>

            <li>
              <NavLink to="/donation-requests" className={navClass}>
                Blood Requests
              </NavLink>
            </li>

            {/* ✅ FIX: your router is /donors/search */}
            <li>
              <NavLink to="/search-donors" className={navClass}>
                Search Donors
              </NavLink>
            </li>

            {user && (
              <li>
                <NavLink to="/dashboard" className={navClass}>
                  {dashboardLabel}
                </NavLink>
              </li>
            )}

            {!user && (
              <li>
                <NavLink to="/login" className={navClass}>
                  Login
                </NavLink>
              </li>
            )}
          </ul>
        </div>

        {/* Brand */}
        <Link to="/" className=" flex items-center gap-2 px-2">
          {/* Logo */}
          <div className="w-9 h-9 flex items-center justify-center">
            <Logo />
          </div>

          {/* Text */}
          <span className="font-extrabold text-2xl leading-none">
            Red <span className="text-primary">Pulse</span>
          </span>
        </Link>
      </div>

      {/* Center */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-1">
          <li>
            <NavLink to="/" className={navClass}>
              Home
            </NavLink>
          </li>

          <li>
            <NavLink to="/donation-requests" className={navClass}>
              Blood Requests
            </NavLink>
          </li>

          {/* ✅ FIX: your router is /donors/search */}
          <li>
            <NavLink to="/search-donors" className={navClass}>
              Search Donors
            </NavLink>
          </li>

          {user && (
            <li>
              <NavLink to="/dashboard" className={navClass}>
                {dashboardLabel}
              </NavLink>
            </li>
          )}
        </ul>
      </div>

      {/* Right */}
      <div className="navbar-end gap-2">
        {!user ? (
          <Link to="/login" className="btn btn-primary rounded-2xl">
            Login
          </Link>
        ) : (
          <div className="dropdown dropdown-end">
            <button className="btn btn-ghost rounded-2xl px-2" tabIndex={0}>
              <div className="flex items-center gap-2">
                <div className="avatar">
                  <div className="w-9 rounded-full ring-2 ring-base-300">
                    <img src={avatarSrc} alt={user?.displayName || "User"} />
                  </div>
                </div>

                <div className="hidden md:block text-left">
                  <p className="text-sm font-bold leading-tight">
                    {user?.displayName || "User"}
                  </p>
                  <p className="text-xs text-base-content/60 leading-tight capitalize">
                    {roleLoading ? "Loading..." : role || "donor"}
                  </p>
                </div>
              </div>
            </button>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-56 p-2 shadow"
            >
              <li className="px-2 py-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-base-content/60">Role</span>
                  <span className="badge badge-primary capitalize">
                    {roleLoading ? "..." : role || "donor"}
                  </span>
                </div>
              </li>

              <div className="divider my-1" />

              <li>
                <NavLink to="/dashboard/profile">Profile</NavLink>
              </li>
              <li>
                <NavLink to="/dashboard">{dashboardLabel}</NavLink>
              </li>

              <div className="divider my-1" />

              <li>
                <button onClick={handleLogOut} disabled={loading}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
