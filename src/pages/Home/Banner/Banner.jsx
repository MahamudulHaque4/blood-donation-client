import React from "react";
import { Link } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import bannerImg1 from "../../../assets/banner/blood_donation_1.jpg";
import bannerImg2 from "../../../assets/banner/blood_donation_2.jpg";
import bannerImg3 from "../../../assets/banner/blood_donation_3.jpg";
import bannerImg4 from "../../../assets/banner/blood_donation_4.jpg";
import bannerImg5 from "../../../assets/banner/blood_donation_5.jpg";


const Banner = () => {
  const slides = [
  { src: bannerImg1, alt: "Blood donation camp" },
  { src: bannerImg2, alt: "Blood donation process" },
  { src: bannerImg3, alt: "Donate blood save life" },
  { src: bannerImg4, alt: "Blood donation awareness" },
  { src: bannerImg5, alt: "Blood donation volunteers" },
];


  return (
    <section className="relative bg-base-200">
      {/* soft background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-secondary/15 blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* LEFT: content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-100/70 px-4 py-2 backdrop-blur">
              <span className="badge badge-primary badge-sm">Emergency Ready</span>
              <p className="text-sm text-base-content/70">
                Search donors fast • Verified profiles
              </p>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.05] tracking-tight">
              Donate blood,{" "}
              <span className="text-primary">save lives</span> today.
            </h1>

            <p className="text-base md:text-lg text-base-content/70 max-w-xl">
              Join as a donor or find nearby donors when every minute matters.
              Simple, quick, and community-driven.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/register"
                className="btn btn-primary rounded-full px-7"
              >
                Join as a Donor
              </Link>
              <Link
                to="/search"
                className="btn btn-outline rounded-full px-7"
              >
                Search Donors
              </Link>
            </div>

            {/* mini stats */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="rounded-2xl border border-base-300 bg-base-100/70 p-4 backdrop-blur">
                <p className="text-xs text-base-content/60">Verified</p>
                <p className="text-lg font-bold">Donors</p>
              </div>
              <div className="rounded-2xl border border-base-300 bg-base-100/70 p-4 backdrop-blur">
                <p className="text-xs text-base-content/60">Fast</p>
                <p className="text-lg font-bold">Search</p>
              </div>
              <div className="rounded-2xl border border-base-300 bg-base-100/70 p-4 backdrop-blur">
                <p className="text-xs text-base-content/60">24/7</p>
                <p className="text-lg font-bold">Support</p>
              </div>
            </div>
          </div>

          {/* RIGHT: carousel */}
          <div className="rounded-3xl overflow-hidden border border-base-300 bg-base-100 shadow-sm">
            <Carousel
              autoPlay
              infiniteLoop
              interval={3500}
              transitionTime={700}
              showThumbs={false}
              showStatus={false}
              showIndicators={true}
              showArrows={false}
              stopOnHover
              swipeable
              emulateTouch
            >
              {slides.map((s, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={s.src}
                    alt={s.alt}
                    className="h-[280px] sm:h-[360px] lg:h-[420px] w-full object-cover"
                    loading="eager"
                    fetchPriority={idx === 0 ? "high" : "auto"}
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="inline-flex items-center gap-2 rounded-full bg-black/40 px-4 py-2 text-white backdrop-blur">
                      <span className="h-2 w-2 rounded-full bg-primary" />
                      <p className="text-sm font-medium">Give blood. Give life.</p>
                    </div>
                  </div>
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
