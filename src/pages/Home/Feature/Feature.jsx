import React from "react";
import { Link } from "react-router-dom";

const Featured = () => {
  const features = [
    {
      title: "Emergency Blood Request",
      desc: "Create urgent blood requests and notify nearby donors instantly.",
      to: "/request-blood",
      badge: "Urgent",
      icon: "https://img.icons8.com/color/96/drop-of-blood.png",
    },
    {
      title: "Search Donors Nearby",
      desc: "Find donors by blood group and location in seconds.",
      to: "/search",
      badge: "Fast",
      icon: "https://img.icons8.com/color/96/search.png",
    },
    {
      title: "Join as a Donor",
      desc: "Register yourself and help save lives when needed most.",
      to: "/register",
      badge: "Impact",
      icon: "https://img.icons8.com/color/96/heart-with-pulse.png",
    },
    {
      title: "Organize Donation Camp",
      desc: "Host blood donation camps with your organization or community.",
      to: "/campaigns",
      badge: "Community",
      icon: "https://img.icons8.com/color/96/hospital.png",
    },
  ];

  return (
    <section className="bg-base-200">
      <div className="max-w-6xl mx-auto px-6 py-14">
        {/* Header */}
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Featured <span className="text-primary">Services</span>
            </h2>
            <p className="mt-2 text-base-content/70 max-w-2xl">
              Simple and powerful tools designed to save lives faster.
            </p>
          </div>

          <Link
            to="/search"
            className="hidden sm:inline-flex btn btn-outline rounded-full"
          >
            Search Donors
          </Link>
        </div>

        {/* Cards */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, idx) => (
            <Link
              key={idx}
              to={f.to}
              className="group rounded-2xl border border-base-300 bg-base-100 p-5 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl bg-base-200 flex items-center justify-center">
                  <img
                    src={f.icon}
                    alt={f.title}
                    className="w-7 h-7"
                    loading="lazy"
                  />
                </div>
                <span className="badge badge-outline text-xs">
                  {f.badge}
                </span>
              </div>

              <h3 className="mt-4 text-lg font-bold group-hover:text-primary transition-colors">
                {f.title}
              </h3>

              <p className="mt-2 text-sm text-base-content/70 leading-relaxed">
                {f.desc}
              </p>

              <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium">
                Explore
                <span className="transition-transform group-hover:translate-x-1">
                 ...
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 rounded-3xl border border-base-300 bg-base-100 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-base-content/60">Did you know?</p>
            <p className="font-semibold">
              One blood donation can save up to three lives.
            </p>
          </div>
          <Link to="/register" className="btn btn-primary rounded-full px-6">
            Become a Donor
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Featured;
