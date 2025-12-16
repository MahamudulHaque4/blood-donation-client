import React from "react";
import { Link } from "react-router";
import Logo from "../../../components/Logo/Logo";

const Footer = () => {
  return (
    <footer className="relative mt-16">
      <div className="absolute -top-10 left-0 w-full overflow-hidden leading-none">
        <svg
          className="relative block w-[calc(150%+1.3px)] h-10 text-base-200"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39 56.44C187.12 84.17 66.29 67.12 0 50.12V120h1200V0c-103.64 38.9-270.84 84.87-469.96 72.36C602.55 62.63 468.1 25.63 321.39 56.44z"
            fill="currentColor"
          />
        </svg>
      </div>

      <div className="bg-base-200 text-base-content">
        <div className="max-w-6xl mx-auto px-6 pt-12 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* Brand */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2">

            {/* Logo Part  */}
                <div className="w-9 h-9 rounded-2xl bg-primary/15 grid place-items-center">
                  <Logo />    
                </div>
                <h2 className="text-xl font-bold tracking-tight">
                  Red <span className="text-primary">Pulse</span>
                </h2>
              </div>

              <p className="text-sm text-base-content/70 leading-relaxed">
                Donate blood, save lives. Find donors, request blood, and join life-saving campaigns in minutes.
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                <span className="badge badge-outline text-xs">Verified Donors</span>
                <span className="badge badge-outline text-xs">Emergency Requests</span>
                <span className="badge badge-outline text-xs">Nearby Camps</span>
              </div>
            </div>

            {/* Links */}
            <nav className="space-y-3 md:justify-self-center">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-base-content/60">
                Organization
              </h3>

              <div className="grid gap-x-8 gap-y-2 text-sm">
                <Link to="/about" className="link link-hover hover:text-primary transition-colors">
                  About Us
                </Link>
                <Link to="/campaigns" className="link link-hover hover:text-primary transition-colors">
                  Blood Drives
                </Link>
                <Link to="/contact" className="link link-hover hover:text-primary transition-colors">
                  Contact
                </Link>
                <Link to="/faq" className="link link-hover hover:text-primary transition-colors">
                  FAQ
                </Link>
              </div>
            </nav>

            {/* CTAs + Social */}
            <div className="space-y-3 md:justify-self-end">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-base-content/60">
                Take Action
              </h3>

              <div className="flex flex-col sm:flex-row gap-2">
                <Link to="/donate" className="btn btn-primary btn-sm rounded-full px-5">
                  Become a Donor
                </Link>
                <Link to="/request-blood" className="btn btn-outline btn-sm rounded-full px-5">
                  Request Blood
                </Link>
              </div>

              <div className="flex gap-2 pt-1">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="btn btn-ghost btn-sm rounded-full hover:bg-base-300 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" className="fill-current">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                  </svg>
                </a>

                <a
                  href="https://www.youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="btn btn-ghost btn-sm rounded-full hover:bg-base-300 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" className="fill-current">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
                  </svg>
                </a>

                <a
                  href="https://www.facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="btn btn-ghost btn-sm rounded-full hover:bg-base-300 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" className="fill-current">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-base-300 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-base-content/60">
            <p>© {new Date().getFullYear()} Blood Donation Network. All rights reserved.</p>
            <p className="italic">Give blood. Save life.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
