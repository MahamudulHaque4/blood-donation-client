import React from "react";
import useAuth from "../../../hooks/useAuth";
import { Link, NavLink } from "react-router";

const Navbar = () => {

    const{user, logOut} = useAuth();

    const handleLogOut = () => {
        logOut()
        .then()
        .catch(error => {
            console.log(error);
        })
    }

    const links = <>
             <li>
                <NavLink to='' className="font-semibold">Donate Blood</NavLink>
              </li>
              <li>
                <NavLink to='' className="font-semibold">Search </NavLink>
              </li>    
    </>
  return (
    <div>
      <div className="navbar bg-base-100 shadow-sm">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />{" "}
              </svg>
            </div>
            <ul
              tabIndex="-1"
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
                {links}

            </ul>
          </div>
          <a className=" btn-ghost font-bold text-2xl">Red <span className="text-primary">Pulse</span></a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1"> 

             {links}

          </ul>
        </div>
        <div className="navbar-end">
          {
            user ? <a onClick = {handleLogOut}className="btn">Log Out</a>
             : <Link className="btn" to='/login'>Log In</Link>
          }
        </div>
      </div>
    </div>
  );
};

export default Navbar;
