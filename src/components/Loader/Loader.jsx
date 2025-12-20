import React from "react";

const Loader = ({ size = "md", label = "", center = false }) => {
  return (
    <div
      className={`flex items-center gap-2 ${
        center ? "justify-center" : ""
      }`}
      role="status"
      aria-live="polite"
    >
      <span
        className={`loading loading-spinner loading-${size}`}
      ></span>

      {label && (
        <span className="text-sm text-base-content/70">
          {label}
        </span>
      )}
    </div>
  );
};

export default Loader;

