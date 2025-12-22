import React, { useEffect, useMemo, useState } from "react";
import axiosPublic from "../../api/axiosPublic";
import { bloodGroups } from "../../utils";

const AvatarFallback = "https://i.ibb.co/2n0xq7y/avatar.png";

const SkeletonCard = () => (
  <div className="rounded-3xl border border-base-300 bg-base-100 shadow-sm overflow-hidden">
    <div className="p-5">
      <div className="flex items-center gap-3">
        <div className="skeleton w-12 h-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-2/3" />
          <div className="skeleton h-3 w-1/3" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="skeleton h-3 w-3/4" />
        <div className="skeleton h-3 w-2/3" />
      </div>
      <div className="mt-4 skeleton h-9 w-full rounded-2xl" />
    </div>
  </div>
);

const SearchDonors = () => {
 
  const [bloodGroup, setBloodGroup] = useState("");
  const [district, setDistrict] = useState("");
  const [upazila, setUpazila] = useState("");

 
  const [districtsData, setDistrictsData] = useState([]);
  const [upazilasData, setUpazilasData] = useState([]);

  const [districtSearch, setDistrictSearch] = useState("");
  const [upazilaSearch, setUpazilaSearch] = useState("");

  const [selectedDistrictId, setSelectedDistrictId] = useState("");

  const [districtActiveIndex, setDistrictActiveIndex] = useState(0);
  const [upazilaActiveIndex, setUpazilaActiveIndex] = useState(0);

 
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  
  const [copiedEmail, setCopiedEmail] = useState("");
  const [imgErrorIds, setImgErrorIds] = useState({}); 

  const hasAnyFilter = useMemo(() => {
    return Boolean(bloodGroup || district.trim() || upazila.trim());
  }, [bloodGroup, district, upazila]);

 
  useEffect(() => {
    fetch("/data/districts.json")
      .then((res) => res.json())
      .then((json) => setDistrictsData(json?.[2]?.data || []))
      .catch(() => setDistrictsData([]));

    fetch("/data/upazilas.json")
      .then((res) => res.json())
      .then((json) => setUpazilasData(json?.[2]?.data || []))
      .catch(() => setUpazilasData([]));
  }, []);

  const selectedDistrictObj = useMemo(() => {
    return districtsData.find((d) => d.id === selectedDistrictId);
  }, [districtsData, selectedDistrictId]);

  const filteredDistricts = useMemo(() => {
    const q = districtSearch.trim().toLowerCase();
    if (!q) return districtsData;
    return districtsData.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        (d.bn_name || "").toLowerCase().includes(q)
    );
  }, [districtSearch, districtsData]);

  const districtUpazilas = useMemo(() => {
    if (!selectedDistrictId) return [];
    return upazilasData.filter((u) => u.district_id === selectedDistrictId);
  }, [selectedDistrictId, upazilasData]);

  const filteredUpazilas = useMemo(() => {
    const q = upazilaSearch.trim().toLowerCase();
    if (!q) return districtUpazilas;
    return districtUpazilas.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        (u.bn_name || "").toLowerCase().includes(q)
    );
  }, [upazilaSearch, districtUpazilas]);

  const openDistrictModal = () => {
    setDistrictSearch("");
    setDistrictActiveIndex(0);
    document.getElementById("district_modal")?.showModal();
    setTimeout(() => document.getElementById("district_listbox")?.focus(), 0);
  };

  const openUpazilaModal = () => {
    setUpazilaSearch("");
    setUpazilaActiveIndex(0);
    document.getElementById("upazila_modal")?.showModal();
    setTimeout(() => document.getElementById("upazila_listbox")?.focus(), 0);
  };

  const selectDistrict = (d) => {
    setSelectedDistrictId(d.id);
    setDistrict(d.name);
    setUpazila("");
    setUpazilaSearch("");
  };

  const selectUpazila = (u) => {
    setUpazila(u.name);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setServerError("");
    setLoading(true);

    try {
      const params = {};
      if (bloodGroup) params.bloodGroup = bloodGroup;
      if (district.trim()) params.district = district.trim();
      if (upazila.trim()) params.upazila = upazila.trim();

      const res = await axiosPublic.get("/donors/search", { params });
      setDonors(res.data || []);
      setImgErrorIds({});
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Failed to search donors";
      setServerError(msg);
      setDonors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setBloodGroup("");
    setDistrict("");
    setUpazila("");
    setSelectedDistrictId("");
    setDistrictSearch("");
    setUpazilaSearch("");
    setDonors([]);
    setServerError("");
    setCopiedEmail("");
    setImgErrorIds({});
  };

  const copyToClipboard = async (email) => {
    try {
      await navigator.clipboard.writeText(email);
      setCopiedEmail(email);
      setTimeout(() => setCopiedEmail(""), 1500);
    } catch {
      // fallback
      const textarea = document.createElement("textarea");
      textarea.value = email;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopiedEmail(email);
      setTimeout(() => setCopiedEmail(""), 1500);
    }
  };

  const badgeClassForBlood = (bg) => {
    
    if (!bg) return "badge badge-ghost";
    if (bg.startsWith("O")) return "badge badge-primary";
    if (bg.startsWith("A")) return "badge badge-secondary";
    if (bg.startsWith("B")) return "badge badge-accent";
    if (bg.startsWith("AB")) return "badge badge-info";
    return "badge badge-ghost";
  };

  return (
    <section className="min-h-screen bg-base-200 px-4 py-10">
      {/* soft glow background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-secondary/15 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Search <span className="text-primary">Donors</span>
          </h1>
          <p className="mt-2 text-base-content/70">
            Filter by blood group, district and upazila. Then press Search.
          </p>
        </div>

        {/* Filters Card */}
        <div className="rounded-3xl border border-base-300 bg-base-100/80 backdrop-blur shadow-sm p-5 md:p-6">
          <form
            onSubmit={handleSearch}
            className="grid grid-cols-1 md:grid-cols-12 gap-4"
          >
            {/* Blood group */}
            <div className="md:col-span-3">
              <label className="label">
                <span className="label-text font-medium">Blood Group</span>
              </label>
              <select
                className="select select-bordered w-full rounded-2xl"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
              >
                <option value="">All</option>
                {bloodGroups.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            {/* District modal */}
            <div className="md:col-span-4">
              <label className="label">
                <span className="label-text font-medium">District</span>
              </label>
              <button
                type="button"
                className="btn btn-outline w-full justify-between rounded-2xl"
                onClick={openDistrictModal}
              >
                <span className="truncate">{district || "Select district"}</span>
                <span className="opacity-60">Search</span>
              </button>
            </div>

            {/* Upazila modal */}
            <div className="md:col-span-3">
              <label className="label">
                <span className="label-text font-medium">Upazila</span>
              </label>
              <button
                type="button"
                className="btn btn-outline w-full justify-between rounded-2xl"
                disabled={!selectedDistrictId}
                onClick={openUpazilaModal}
              >
                <span className="truncate">
                  {upazila
                    ? upazila
                    : selectedDistrictId
                    ? "Select upazila"
                    : "Select district first"}
                </span>
                <span className="opacity-60">Search</span>
              </button>
            </div>

            {/* Buttons */}
            <div className="md:col-span-2 flex items-end gap-2">
              <button
                type="submit"
                className="btn btn-primary w-full rounded-2xl"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="loading loading-spinner loading-sm" />
                    Searching...
                  </span>
                ) : (
                  "Search"
                )}
              </button>

              <button
                type="button"
                className="btn btn-ghost rounded-2xl"
                onClick={handleReset}
                disabled={loading}
              >
                Reset
              </button>
            </div>
          </form>

          {serverError && (
            <div className="mt-4 alert alert-error rounded-2xl">
              <span className="text-sm">{serverError}</span>
            </div>
          )}

          {/* {!hasAnyFilter && (
            <p className="mt-4 text-sm text-base-content/60">
              Tip: Choose district → choose upazila → Search.
            </p>
          )} */}
        </div>

        {/* Results */}
        <div className="mt-8">
          {/* Skeleton loader */}
          {loading && (
            <>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-base-content/60">
                  Searching donors...
                </p>
                <span className="loading loading-spinner loading-sm" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            </>
          )}

          {!loading && !serverError && donors.length === 0 && hasAnyFilter && (
            <div className="rounded-2xl border border-base-300 bg-base-100 p-5">
              <p className="text-base-content/70">
                No donors found for your filters.
              </p>
            </div>
          )}

          {!loading && donors.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-base-content/60">
                  Found <b>{donors.length}</b> donor(s)
                </p>

                {/* Active filter chips */}
                <div className="hidden md:flex items-center gap-2">
                  {bloodGroup && (
                    <span className={`${badgeClassForBlood(bloodGroup)} badge`}>
                      {bloodGroup}
                    </span>
                  )}
                  {district && <span className="badge badge-outline">{district}</span>}
                  {upazila && <span className="badge badge-ghost">{upazila}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {donors.map((d) => {
                  const id = d._id || d.email;
                  const showFallback = imgErrorIds[id];
                  const avatarSrc = showFallback ? AvatarFallback : (d.avatar || AvatarFallback);

                  return (
                    <div
                      key={id}
                      className="rounded-3xl border border-base-300 bg-base-100 shadow-sm overflow-hidden hover:shadow-md transition"
                    >
                      {/* top bar */}
                      <div className="px-5 pt-5 flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="avatar">
                            <div className="w-12 rounded-full ring-2 ring-base-300">
                              <img
                                src={avatarSrc}
                                alt={d.name || "Donor"}
                                onError={() =>
                                  setImgErrorIds((prev) => ({ ...prev, [id]: true }))
                                }
                              />
                            </div>
                          </div>

                          <div className="min-w-0">
                            <h2 className="font-bold text-lg truncate">
                              {d.name || "Unnamed Donor"}
                            </h2>
                            <div className="mt-1 flex items-center gap-2 flex-wrap">
                              <span className={`${badgeClassForBlood(d.bloodGroup)} badge`}>
                                {d.bloodGroup || "N/A"}
                              </span>
                              <span className="badge badge-outline">
                                {d.district || "N/A"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* body */}
                      <div className="px-5 pb-5 mt-4">
                        <div className="text-sm text-base-content/70 space-y-1">
                          <p>
                            <b>District:</b> {d.district || "N/A"}
                          </p>
                          <p>
                            <b>Upazila:</b> {d.upazila || "N/A"}
                          </p>
                        </div>

                        {/* actions */}
                        {d.email && (
                          <div className="mt-4 grid grid-cols-2 gap-2">
                            <a
                              href={`mailto:${d.email}`}
                              className="btn btn-outline btn-sm rounded-2xl"
                              title="Send email"
                            >
                              Email
                            </a>

                            <button
                              type="button"
                              className="btn btn-primary btn-sm rounded-2xl"
                              onClick={() => copyToClipboard(d.email)}
                              title="Copy email"
                            >
                              {copiedEmail === d.email ? "Copied!" : "Copy"}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {!hasAnyFilter && !loading && (
            <p className="text-base-content/60 mt-6">
              Select filters to search donors.
            </p>
          )}
        </div>
      </div>

      <dialog id="district_modal" className="modal">
        <div className="modal-box rounded-3xl">
          <h3 className="font-bold text-lg">Select District</h3>

          <input
            className="input input-bordered w-full rounded-full mt-3"
            placeholder="Type district name..."
            value={districtSearch}
            onChange={(e) => {
              setDistrictSearch(e.target.value);
              setDistrictActiveIndex(0);
            }}
          />

          <div className="mt-3 max-h-72 overflow-auto border border-base-300 rounded-2xl p-2">
            <ul
              id="district_listbox"
              tabIndex={0}
              className="space-y-1 outline-none"
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  setDistrictActiveIndex((prev) =>
                    Math.min(prev + 1, filteredDistricts.length - 1)
                  );
                }
                if (e.key === "ArrowUp") {
                  setDistrictActiveIndex((prev) => Math.max(prev - 1, 0));
                }
                if (e.key === "Enter") {
                  const d = filteredDistricts[districtActiveIndex];
                  if (d) {
                    selectDistrict(d);
                    document.getElementById("district_modal")?.close();
                  }
                }
              }}
            >
              {filteredDistricts.map((d, index) => (
                <li key={d.id}>
                  <button
                    type="button"
                    className={`w-full text-left px-4 py-3 rounded-2xl transition ${
                      districtActiveIndex === index
                        ? "bg-primary text-white"
                        : "hover:bg-base-200"
                    }`}
                    onMouseEnter={() => setDistrictActiveIndex(index)}
                    onClick={() => {
                      selectDistrict(d);
                      document.getElementById("district_modal")?.close();
                    }}
                  >
                    <div className="font-medium">{d.name}</div>
                    <div
                      className={`text-xs ${
                        districtActiveIndex === index
                          ? "text-white/80"
                          : "text-base-content/60"
                      }`}
                    >
                      {d.bn_name}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="modal-action">
            <button
              type="button"
              className="btn rounded-2xl"
              onClick={() => document.getElementById("district_modal")?.close()}
            >
              Close
            </button>
          </div>
        </div>

        <button
          type="button"
          className="modal-backdrop"
          onClick={() => document.getElementById("district_modal")?.close()}
        >
          close
        </button>
      </dialog>


      <dialog id="upazila_modal" className="modal">
        <div className="modal-box rounded-3xl">
          <h3 className="font-bold text-lg">
            Select Upazila{" "}
            <span className="text-base-content/60 text-sm font-normal">
              {selectedDistrictObj ? `(${selectedDistrictObj.name})` : ""}
            </span>
          </h3>

          <input
            className="input input-bordered w-full rounded-full mt-3"
            placeholder="Type upazila name..."
            value={upazilaSearch}
            onChange={(e) => {
              setUpazilaSearch(e.target.value);
              setUpazilaActiveIndex(0);
            }}
          />

          <div className="mt-3 max-h-72 overflow-auto border border-base-300 rounded-2xl p-2">
            <ul
              id="upazila_listbox"
              tabIndex={0}
              className="space-y-1 outline-none"
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  setUpazilaActiveIndex((prev) =>
                    Math.min(prev + 1, filteredUpazilas.length - 1)
                  );
                }
                if (e.key === "ArrowUp") {
                  setUpazilaActiveIndex((prev) => Math.max(prev - 1, 0));
                }
                if (e.key === "Enter") {
                  const u = filteredUpazilas[upazilaActiveIndex];
                  if (u) {
                    selectUpazila(u);
                    document.getElementById("upazila_modal")?.close();
                  }
                }
              }}
            >
              {filteredUpazilas.map((u, index) => (
                <li key={u.id}>
                  <button
                    type="button"
                    className={`w-full text-left px-4 py-3 rounded-2xl transition ${
                      upazilaActiveIndex === index
                        ? "bg-primary text-white"
                        : "hover:bg-base-200"
                    }`}
                    onMouseEnter={() => setUpazilaActiveIndex(index)}
                    onClick={() => {
                      selectUpazila(u);
                      document.getElementById("upazila_modal")?.close();
                    }}
                  >
                    <div className="font-medium">{u.name}</div>
                    <div
                      className={`text-xs ${
                        upazilaActiveIndex === index
                          ? "text-white/80"
                          : "text-base-content/60"
                      }`}
                    >
                      {u.bn_name}
                    </div>
                  </button>
                </li>
              ))}

              {selectedDistrictId && filteredUpazilas.length === 0 && (
                <li className="px-4 py-3 text-sm text-base-content/60">
                  No upazila found.
                </li>
              )}

              {!selectedDistrictId && (
                <li className="px-4 py-3 text-sm text-base-content/60">
                  Select district first.
                </li>
              )}
            </ul>
          </div>

          <div className="modal-action">
            <button
              type="button"
              className="btn rounded-2xl"
              onClick={() => document.getElementById("upazila_modal")?.close()}
            >
              Close
            </button>
          </div>
        </div>

        <button
          type="button"
          className="modal-backdrop"
          onClick={() => document.getElementById("upazila_modal")?.close()}
        >
          close
        </button>
      </dialog>
    </section>
  );
};

export default SearchDonors;
