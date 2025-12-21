import React from "react";
import { Link, NavLink } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

const Navbar = () => {
  const { user, logOut } = useAuth();

  const handleLogOut = async () => {
    try {
      await logOut();
      localStorage.removeItem("access-token"); // ✅ clear JWT
    } catch (error) {
      console.log(error);
    }
  };

  const navClass = ({ isActive }) =>
    `font-semibold ${isActive ? "text-primary" : ""}`;

  return (
    <div className="navbar bg-base-100 shadow-sm">
      {/* ========== Left ========= */}
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
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow"
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

            {/* Search donors (route can be added later) */}
            <li>
              <NavLink to="/donors" className={navClass}>
                Search Donors
              </NavLink>
            </li>

            {user && (
              <li>
                <NavLink to="/dashboard" className={navClass}>
                  Dashboard
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

        <Link to="/" className="btn btn-ghost font-bold text-2xl">
          Red <span className="text-primary">Pulse</span>
        </Link>
      </div>

      {/* ========== Center (Desktop) ========= */}
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

          <li>
            <NavLink to="/donors" className={navClass}>
              Search Donors
            </NavLink>
          </li>

          {user && (
            <li>
              <NavLink to="/dashboard" className={navClass}>
                Dashboard
              </NavLink>
            </li>
          )}
        </ul>
      </div>

      {/* ========== Right ========= */}
      <div className="navbar-end gap-2">
        {!user ? (
          <Link to="/login" className="btn btn-primary rounded-2xl">
            Login
          </Link>
        ) : (
          <button onClick={handleLogOut} className="btn rounded-2xl">
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
