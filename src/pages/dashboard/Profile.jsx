import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import { imageUpload, bloodGroups } from "../../utils"; 
// import axiosSecure from "../../api/axiosSecure";

const Profile = () => {
  const axiosSecure = useAxiosSecure();


  const { user, updateUserProfile } = useAuth();

  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get("/users/me");
        if (!ignore) {
          const u = res.data || {};
          setMe(u);
          reset({
            name: u.name || user?.displayName || "",
            avatar: u.avatar || user?.photoURL || "",
            bloodGroup: u.bloodGroup || "",
            district: u.district || "",
            upazila: u.upazila || "",
          });
        }
      } catch (err) {
        console.error(err);
        toast.error(err?.response?.data?.message || "Failed to load profile");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    load();
    return () => {
      ignore = true;
    };
  }, [axiosSecure, reset, user]);

  const onSubmit = async (data) => {
    try {
      setSaving(true);

      
      let avatarUrl = data.avatar || "";
      const file = data.avatarFile?.[0];
      if (file) {
        avatarUrl = await imageUpload(file);
      }

      //  update DB
      await axiosSecure.patch("/users/me", {
        name: data.name,
        avatar: avatarUrl,
        bloodGroup: data.bloodGroup,
        district: data.district,
        upazila: data.upazila,
      });

     
      if (updateUserProfile) {
        await updateUserProfile(data.name, avatarUrl);
      }

      toast.success("Profile updated");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Profile update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm">
        <div className="skeleton h-6 w-48 mb-5"></div>
        <div className="skeleton h-12 w-full mb-3"></div>
        <div className="skeleton h-12 w-full mb-3"></div>
        <div className="skeleton h-12 w-full"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center gap-5 md:justify-between">
          <div className="flex items-center gap-4">
            <div className="avatar">
              <div className="w-16 rounded-full ring ring-primary/20 ring-offset-2 ring-offset-base-100">
                <img
                  src={me?.avatar || user?.photoURL || "https://i.ibb.co/2kRzYQz/user.png"}
                  alt="avatar"
                />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-extrabold">My Profile</h1>
              <p className="text-sm text-base-content/70">
                Email: <span className="font-medium">{me?.email}</span>
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="badge badge-outline">Role: {me?.role || "donor"}</span>
                <span className={`badge ${me?.status === "blocked" ? "badge-error" : "badge-success"}`}>
                  Status: {me?.status || "active"}
                </span>
              </div>
            </div>
          </div>

          <div className="text-sm text-base-content/70">
            Last Updated:{" "}
            <span className="font-medium">
              {me?.updatedAt ? new Date(me.updatedAt).toLocaleString() : "—"}
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="label">Name</label>
            <input
              className="input input-bordered w-full rounded-2xl"
              {...register("name", { required: "Name is required" })}
              placeholder="Your name"
            />
            {errors.name && <p className="text-error text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="label">Avatar URL (optional)</label>
            <input
              className="input input-bordered w-full rounded-2xl"
              {...register("avatar")}
              placeholder="https://..."
            />
            <p className="text-xs text-base-content/60 mt-1">
              Or upload a new image below.
            </p>
          </div>

          <div className="md:col-span-2">
            <label className="label">Upload New Avatar</label>
            <input
              type="file"
              accept="image/*"
              className="file-input file-input-bordered w-full rounded-2xl"
              {...register("avatarFile")}
            />
          </div>

          <div>
            <label className="label">Blood Group</label>
            <select className="select select-bordered w-full rounded-2xl" {...register("bloodGroup")}>
              <option value="">Select</option>
              {bloodGroups.map((bg) => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">District</label>
            <input className="input input-bordered w-full rounded-2xl" {...register("district")} />
          </div>

          <div>
            <label className="label">Upazila</label>
            <input className="input input-bordered w-full rounded-2xl" {...register("upazila")} />
          </div>

          <div className="md:col-span-2 flex items-center justify-end gap-3 mt-2">
            <button type="submit" className="btn btn-primary rounded-2xl" disabled={saving}>
              {saving ? (
                <span className="flex items-center gap-2">
                  <span className="loading loading-spinner loading-sm" />
                  Saving...
                </span>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
