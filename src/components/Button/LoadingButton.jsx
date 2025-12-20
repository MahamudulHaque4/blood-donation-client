import React from "react";
import Loader from "../Loader/Loader";

const LoadingButton = ({
  loading = false,
  children,
  className = "btn btn-primary",
  disabled = false,
  ...props
}) => {
  return (
    <button
      className={className}
      disabled={loading || disabled}
      aria-busy={loading}
      {...props}
    >
      {loading ? <Loader size="sm" /> : children}
    </button>
  );
};

export default LoadingButton;

