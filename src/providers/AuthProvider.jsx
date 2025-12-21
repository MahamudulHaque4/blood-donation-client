import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import axiosPublic from "../api/axiosPublic";

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signInUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signInGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const updateUserProfile = (name, photo) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo,
    });
  };

  const logOut = async () => {
    setLoading(true);
    // remove token first
    localStorage.removeItem("access-token");
    setUser(null);
    return signOut(auth);
  };

  // ✅ Get custom JWT from backend and save to localStorage
  const getJwtToken = async (email) => {
    try {
      const res = await axiosPublic.post("/jwt", { email });
      const token = res.data?.token;
      if (token) {
        localStorage.setItem("access-token", token);
      } else {
        localStorage.removeItem("access-token");
      }
    } catch (err) {
      // if backend says blocked / not found / etc.
      localStorage.removeItem("access-token");
      console.log("JWT error:", err?.response?.data || err.message);
    }
  };

  // ✅ On auth state change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser?.email) {
        // 🔥 get custom JWT after login
        await getJwtToken(currentUser.email);
      } else {
        // if logged out
        localStorage.removeItem("access-token");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    loading,
    setUser,
    setLoading,
    createUser,
    signInUser,
    signInGoogle,
    logOut,
    updateUserProfile,
  };

  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
