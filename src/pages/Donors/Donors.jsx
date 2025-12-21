import React from "react";

const Donors = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">Search Donors</h1>

      <p className="text-base-content/70 mb-6">
        Find blood donors by blood group and location.
      </p>

      {/* Filters will be added next */}
      <div className="p-6 border rounded-2xl bg-base-100">
        <p className="text-sm text-base-content/60">
          Donor search filters and results will appear here.
        </p>
      </div>
    </div>
  );
};

export default Donors;
