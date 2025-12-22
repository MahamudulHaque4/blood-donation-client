import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import Logo from "../../../components/Logo/Logo";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { imageUpload, bloodGroups } from "../../../utils";
import LoadingButton from "../../../components/Button/LoadingButton";
import axiosPublic from "../../../api/axiosPublic";

const Register = () => {
  const [serverError, setServerError] = useState("");
  const [uploading, setUploading] = useState(false);

  const [districtsData, setDistrictsData] = useState([]);
  const [upazilasData, setUpazilasData] = useState([]);

  const [districtSearch, setDistrictSearch] = useState("");
  const [upazilaSearch, setUpazilaSearch] = useState("");

  const [districtActiveIndex, setDistrictActiveIndex] = useState(0);
  const [upazilaActiveIndex, setUpazilaActiveIndex] = useState(0);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { createUser, updateUserProfile } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const selectedDistrictId = watch("district");
  const selectedUpazila = watch("upazila");
  const passwordValue = watch("password");

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

  const handleRegistration = async (data) => {
    setServerError("");

    
    const file = data.avatar?.[0];
    if (!file) {
      setServerError("Avatar image is required");
      return;
    }

    setUploading(true);

    try {
     
      await createUser(data.email, data.password);

    
      const avatarUrl = await imageUpload(file);

      
      await updateUserProfile(data.name, avatarUrl);

      
      const userPayload = {
        name: data.name,
        email: data.email,
        avatar: avatarUrl,
        bloodGroup: data.bloodGroup,
        district: selectedDistrictObj?.name || "",
        upazila: data.upazila,
      };

      await axiosPublic.put("/users", userPayload);

     
      const jwtRes = await axiosPublic.post("/jwt", { email: data.email });
      const token = jwtRes?.data?.token;

      if (!token) {
        throw new Error("JWT token not received");
      }

      localStorage.setItem("access-token", token);

      navigate(location.state?.from || "/", { replace: true });
    } catch (err) {
      console.error("Registration error:", err);
      const msg =
        err?.response?.data?.message || err?.message || "Registration failed";
      setServerError(msg);
    } finally {
      setUploading(false);
    }
  };

  const openDistrictModal = () => {
    setDistrictSearch("");
    setDistrictActiveIndex(0);
    document.getElementById("district_modal").showModal();
    setTimeout(() => document.getElementById("district_listbox")?.focus(), 0);
  };

  const openUpazilaModal = () => {
    setUpazilaSearch("");
    setUpazilaActiveIndex(0);
    document.getElementById("upazila_modal").showModal();
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

  return (
    <section className="min-h-screen bg-base-200 flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-xl">
        <div className="rounded-3xl border border-base-300 bg-base-100 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="space-y-4 text-center flex flex-col items-center">
            <Logo />
            <div className="p-6 md:p-2 border-b border-base-300">
              <h2 className="text-3xl font-extrabold">
                Create your <span className="text-primary">donor</span> account
              </h2>
              <p className="mt-2 text-sm text-base-content/70">
                Default role: <b>donor</b> • Status: <b>active</b>
              </p>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(handleRegistration)}
            className="p-6 md:p-8 space-y-4"
          >
            {/* Name */}
            <div>
              <label className="label">Name</label>
              <input
                type="text"
                {...register("name", { required: "Name is required" })}
                className="input input-bordered w-full rounded-2xl"
                placeholder="Your full name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                {...register("email", { required: "Email is required" })}
                className="input input-bordered w-full rounded-2xl"
                placeholder="Email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Avatar */}
            <div>
              <label className="label mt-3">Image Upload</label>
              <input
                type="file"
                accept="image/*"
                {...register("avatar", {
                  required: "Avatar image is required",
                })}
                className="file-input file-input-bordered w-full"
              />
              <p className="text-xs text-base-content/60 mt-1">
                Upload your profile photo (required)
              </p>
              {errors.avatar && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.avatar.message}
                </p>
              )}
            </div>

            {/* Blood group */}
            <div>
              <label className="label">Blood Group</label>
              <select
                className="select select-bordered w-full rounded-2xl"
                {...register("bloodGroup", {
                  required: "Blood group is required",
                })}
                defaultValue=""
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
              <label className="label">District</label>
              <button
                type="button"
                className="btn btn-outline w-full justify-between rounded-2xl"
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

              {/* District modal */}
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
                            document.getElementById("district_modal").close();
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
                              document.getElementById("district_modal").close();
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
                        document.getElementById("district_modal").close()
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
                    document.getElementById("district_modal").close()
                  }
                >
                  close
                </button>
              </dialog>
            </div>

            {/* Upazila */}
            <div>
              <label className="label">Upazila</label>
              <button
                type="button"
                className="btn btn-outline w-full justify-between rounded-2xl"
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
                  <h3 className="font-bold text-lg">Select Upazila</h3>

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
                            document.getElementById("upazila_modal").close();
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
                              document.getElementById("upazila_modal").close();
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
                    </ul>
                  </div>

                  <div className="modal-action">
                    <button
                      type="button"
                      className="btn rounded-2xl"
                      onClick={() =>
                        document.getElementById("upazila_modal").close()
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
                    document.getElementById("upazila_modal").close()
                  }
                >
                  close
                </button>
              </dialog>
            </div>

            {/* Password */}
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters long",
                    },
                    pattern: {
                      value:
                        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/,
                      message:
                        "Must include letter, number, and special character",
                    },
                  })}
                  className="input input-bordered w-full rounded-2xl pr-16"
                  placeholder="Password"
                />

                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm link link-hover"
                  onClick={() => setShowPassword((p) => !p)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label className="label">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirm_password", {
                    required: "Confirm password is required",
                    validate: (value) =>
                      value === passwordValue || "Passwords do not match",
                  })}
                  className="input input-bordered w-full rounded-2xl pr-16"
                  placeholder="Confirm password"
                />

                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm link link-hover"
                  onClick={() => setShowConfirmPassword((p) => !p)}
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>

              {errors.confirm_password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirm_password.message}
                </p>
              )}
            </div>

            {serverError && (
              <p className="text-red-500 text-sm">{serverError}</p>
            )}

            <LoadingButton
              type="submit"
              loading={uploading}
              className="btn btn-primary w-full"
            >
              Register
            </LoadingButton>

            <p className="mt-4 text-sm text-base-content/70">
              Already have an account?{" "}
              <Link
                state={location.state}
                to="/login"
                className="link link-hover text-primary font-semibold"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Register;
