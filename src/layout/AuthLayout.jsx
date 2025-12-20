import React from "react";
import { Outlet } from "react-router-dom";
import AuthImg from "../assets/banner/blood_donation_1.jpg";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-base-200">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden border border-base-300 bg-base-100 shadow-sm">
          {/* Left: Form */}
          <div className="p-2">
            <Outlet />
          </div>

          {/* Right: Image */}
          <div className="hidden md:block relative">
            <img className="h-full w-full object-cover" src={AuthImg} alt="Blood Donation" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <p className="text-xl font-bold">Donate blood. Save lives.</p>
              <p className="text-sm text-white/80 mt-1">
                Your small act can be someone’s biggest hope.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
