import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import { bloodGroups, imageUpload } from "../../utils";
import axiosSecure from "../../api/axiosSecure";
import { useNavigate } from "react-router-dom";


const CreateDonationRequest = () => {
  const { user } = useAuth();
  const navigate = useNavigate();


  const [districtsData, setDistrictsData] = useState([]);
  const [upazilasData, setUpazilasData] = useState([]);

  const [districtSearch, setDistrictSearch] = useState("");
  const [upazilaSearch, setUpazilaSearch] = useState("");

  const [districtActiveIndex, setDistrictActiveIndex] = useState(0);
  const [upazilaActiveIndex, setUpazilaActiveIndex] = useState(0);


  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      recipientName: "",
      bloodGroup: "",
      district: "",
      upazila: "",
      hospitalName: "",
      fullAddress: "",
      donationDate: "",
      donationTime: "",
      requestMessage: "",
    },
  });

  const selectedDistrictId = watch("district");
  const selectedUpazila = watch("upazila");

  // Load districts/upazilas
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
    setValue("district", d.id);
    setValue("upazila", "");
    setUpazilaSearch("");
  };

  const selectUpazila = (u) => {
    setValue("upazila", u.name);
  };

  const isBlocked = user?.status === "blocked";

  
  const onSubmit = async (data) => {
    if (isBlocked) {
      toast.error("You are blocked. You cannot create donation requests.");
      return;
    }

    try {
      setUploading(true);

      let recipientImage = "";
      if (imageFile) {
        recipientImage = await imageUpload(imageFile);
      }

      const payload = {
        recipientName: data.recipientName,
        recipientDistrict: selectedDistrictObj?.name || "",
        recipientUpazila: data.upazila,

        hospitalName: data.hospitalName,
        address: data.fullAddress,

        bloodGroup: data.bloodGroup,
        donationDate: data.donationDate,
        donationTime: data.donationTime,

        message: data.requestMessage,
        recipientImage,
      };

      
      const res = await axiosSecure.post("/donation-requests", payload);

      if (res?.data?.insertedId) toast.success("Donation request created!");
      else toast.success("Request submitted!");

     
      reset();
      setValue("district", "");
      setValue("upazila", "");
      setImageFile(null);


      setTimeout(() => {
        navigate("/dashboard/my-donation-requests");
      }, 600);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to create request");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">
          Create Donation Request
        </h1>
        <p className="text-sm text-base-content/70 mt-1">
          Fill out the form. Request status will be <b>pending</b>.
        </p>
        {isBlocked && (
          <div className="alert alert-error mt-4">
            <span>You are blocked. You cannot create donation requests.</span>
          </div>
        )}
      </div>

      <div className="card bg-base-100 shadow-sm border border-base-300">
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Recipient Name */}
            <div>
              <label className="label">Recipient Name</label>
              <input
                className="input input-bordered w-full"
                placeholder="Who will receive the blood?"
                {...register("recipientName", {
                  required: "Recipient name is required",
                })}
              />
              {errors.recipientName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.recipientName.message}
                </p>
              )}
            </div>

            {/* Recipient Image */}
            <div>
              <label className="label">Recipient Image (optional)</label>
              <input
                type="file"
                accept="image/*"
                className="file-input file-input-bordered w-full"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
              {imageFile && (
                <p className="text-xs text-base-content/70 mt-1">
                  Selected: <b>{imageFile.name}</b>
                </p>
              )}
            </div>

            {/* Blood Group */}
            <div>
              <label className="label">Blood Group</label>
              <select
                className="select select-bordered w-full"
                defaultValue=""
                {...register("bloodGroup", {
                  required: "Blood group is required",
                })}
              >
                <option value="" disabled>
                  Select blood group
                </option>
                {bloodGroups.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
              {errors.bloodGroup && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.bloodGroup.message}
                </p>
              )}
            </div>

            {/* District */}
            <div>
              <label className="label">Recipient District</label>

              <button
                type="button"
                className="btn btn-outline w-full justify-between"
                onClick={openDistrictModal}
              >
                <span className="truncate">
                  {selectedDistrictObj
                    ? selectedDistrictObj.name
                    : "Select district"}
                </span>
                <span className="opacity-60">Search</span>
              </button>

              <input
                type="hidden"
                {...register("district", { required: "District is required" })}
              />
              {errors.district && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.district.message}
                </p>
              )}

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
                          setDistrictActiveIndex((prev) =>
                            Math.max(prev - 1, 0)
                          );
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
                              document
                                .getElementById("district_modal")
                                ?.close();
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
                      onClick={() =>
                        document.getElementById("district_modal")?.close()
                      }
                    >
                      Close
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  className="modal-backdrop"
                  onClick={() =>
                    document.getElementById("district_modal")?.close()
                  }
                >
                  close
                </button>
              </dialog>
            </div>

            {/* Upazila */}
            <div>
              <label className="label">Recipient Upazila</label>

              <button
                type="button"
                className="btn btn-outline w-full justify-between"
                disabled={!selectedDistrictId}
                onClick={openUpazilaModal}
              >
                <span className="truncate">
                  {selectedUpazila
                    ? selectedUpazila
                    : selectedDistrictId
                    ? "Select upazila"
                    : "Select district first"}
                </span>
                <span className="opacity-60">Search</span>
              </button>

              <input
                type="hidden"
                {...register("upazila", { required: "Upazila is required" })}
              />
              {errors.upazila && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.upazila.message}
                </p>
              )}

              <dialog id="upazila_modal" className="modal">
                <div className="modal-box rounded-3xl">
                  <h3 className="font-bold text-lg">
                    Select Upazila{" "}
                    <span className="text-base-content/60 font-normal">
                      {selectedDistrictObj
                        ? `• ${selectedDistrictObj.name}`
                        : ""}
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
                          setUpazilaActiveIndex((prev) =>
                            Math.max(prev - 1, 0)
                          );
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

                      {filteredUpazilas.length === 0 && (
                        <li className="p-4 text-sm text-base-content/70">
                          No upazila found.
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="modal-action">
                    <button
                      type="button"
                      className="btn rounded-2xl"
                      onClick={() =>
                        document.getElementById("upazila_modal")?.close()
                      }
                    >
                      Close
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  className="modal-backdrop"
                  onClick={() =>
                    document.getElementById("upazila_modal")?.close()
                  }
                >
                  close
                </button>
              </dialog>
            </div>

            {/* Hospital Name */}
            <div>
              <label className="label">Hospital Name</label>
              <input
                className="input input-bordered w-full"
                placeholder="e.g., Dhaka Medical College Hospital"
                {...register("hospitalName", {
                  required: "Hospital name is required",
                })}
              />
              {errors.hospitalName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.hospitalName.message}
                </p>
              )}
            </div>

            {/* Full Address */}
            <div>
              <label className="label">Full Address</label>
              <input
                className="input input-bordered w-full"
                placeholder="Full address (road, area, etc.)"
                {...register("fullAddress", {
                  required: "Full address is required",
                })}
              />
              {errors.fullAddress && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.fullAddress.message}
                </p>
              )}
            </div>

            {/* Date + Time */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label">Donation Date</label>
                <input
                  type="date"
                  className="input input-bordered w-full"
                  {...register("donationDate", {
                    required: "Donation date is required",
                  })}
                />
                {errors.donationDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.donationDate.message}
                  </p>
                )}
              </div>

              <div>
                <label className="label">Donation Time</label>
                <input
                  type="time"
                  className="input input-bordered w-full"
                  {...register("donationTime", {
                    required: "Donation time is required",
                  })}
                />
                {errors.donationTime && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.donationTime.message}
                  </p>
                )}
              </div>
            </div>

            {/* Request Message */}
            <div>
              <label className="label">Request Message</label>
              <textarea
                className="textarea textarea-bordered w-full min-h-[120px]"
                placeholder="Write why blood is needed, patient info, emergency note..."
                {...register("requestMessage", {
                  required: "Request message is required",
                })}
              />
              {errors.requestMessage && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.requestMessage.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isBlocked || uploading}
              title={isBlocked ? "Blocked users cannot create requests" : ""}
            >
              {uploading ? "Uploading & Creating..." : "Create Request"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateDonationRequest;
