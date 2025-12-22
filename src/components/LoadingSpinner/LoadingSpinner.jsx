import React from "react";

export default function LoadingSpinner({
  label = "Loading...",
  fullScreen = false,
  size = 40,
  className = "",
}) {
  const Wrapper = ({ children }) =>
    fullScreen ? (
      <div className="fixed inset-0 z-[9999] grid place-items-center bg-base-100/60 backdrop-blur-sm">
        {children}
      </div>
    ) : (
      <div className={`grid place-items-center ${className}`}>{children}</div>
    );

  const thickness = Math.max(3, Math.round(size / 10));

  return (
    <Wrapper>
      <div
        className="flex flex-col items-center gap-3"
        role="status"
        aria-live="polite"
      >
        {/* Spinner ring */}
        <div
          className="animate-spin rounded-full border-base-content/20 border-t-primary"
          style={{
            width: size,
            height: size,
            borderWidth: thickness,
          }}
          aria-label={label}
        />

        {/* Label */}
        {label ? (
          <p className="text-sm text-base-content/70 font-medium">
            {label}
          </p>
        ) : null}
      </div>
    </Wrapper>
  );
}

