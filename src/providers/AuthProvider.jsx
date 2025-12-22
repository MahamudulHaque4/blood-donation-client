import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import axiosPublic from "../api/axiosPublic";

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

  const updateUserProfile = (name, photo) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo,
    });
  };

  const logOut = async () => {
    setLoading(true);
    localStorage.removeItem("access-token");
    setUser(null);
    return signOut(auth);
  };

  
  const upsertUserToDB = async (firebaseUser) => {
    const userPayload = {
      name: firebaseUser?.displayName || "No Name",
      email: firebaseUser?.email,
      avatar: firebaseUser?.photoURL || "",
    };

    
    await axiosPublic.put("/users", userPayload);
  };

 
  const getJwtToken = async (email) => {
    const res = await axiosPublic.post("/jwt", { email });
    const token = res.data?.token;

    if (token) localStorage.setItem("access-token", token);
    else localStorage.removeItem("access-token");

    return token;
  };

  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      try {
        if (currentUser?.email) {
          
          await upsertUserToDB(currentUser);

          
          await getJwtToken(currentUser.email);
        } else {
          localStorage.removeItem("access-token");
        }
      } catch (err) {
        console.log("AuthProvider JWT/DB error:", err?.response?.data || err.message);
        localStorage.removeItem("access-token");
      } finally {
        setLoading(false);
      }
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
    logOut,
    updateUserProfile,
  };

  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
