import axios from "axios";

export const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export const imageUpload = async (file) => {
  if (!file) throw new Error("No image file selected");

  const key = import.meta.env.VITE_IMGBB_KEY;
  if (!key) throw new Error("Missing VITE_IMGBB_KEY in .env");

  const formData = new FormData();
  formData.append("image", file);

  const res = await axios.post(
    `https://api.imgbb.com/1/upload?key=${key}`,
    formData
  );

  if (!res.data?.success) {
    throw new Error(res.data?.error?.message || "Image upload failed");
  }

  return res.data.data.display_url;
};
