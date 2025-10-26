import React, { createContext, useState, useEffect } from "react";
import {getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword,updateProfile,signOut,GoogleAuthProvider,signInWithPopup,onAuthStateChanged,sendPasswordResetEmail,} from "firebase/auth";
import app from "../firebase/firebase.config";


export const AuthContext = createContext();  // কনটেক্সট এর জন্য প্রথম কাজ


const auth = getAuth(app);  // fiebbase  এর কোড
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {   //২য় কাজ main.jsx ফাইলের Router এর ভিতরের সকল ফাইল একসেস এর জন্য children
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

 // ইমেইল-পাসওয়ার্ড দিয়ে রেজিস্টেশন এর কোড
  const registerUser = async (name, email, password, photoURL) => {
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: name, photoURL });
      setUser(result.user);
      return result.user;
    } finally {
      setLoading(false);
    }
  };

 // ইমেইল-পাসওয়ার্ড দিয়ে লগইন এর কোড
  const loginUser = async (email, password) => {
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setUser(result.user);
      return result.user;
    } finally {
      setLoading(false);
    }
  };

 // গুগল দিয়ে রেজিস্টেশন এর কোড
  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      return result.user;
    } finally {
      setLoading(false);
    }
  };

 // লগআউট এর কোড
  const logOut = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

 // ইউজার আপডেট এর কোড
  const updateUserProfile = async (profile) => {
    if (!auth.currentUser) throw new Error("No user is logged in");
    await updateProfile(auth.currentUser, profile);
    setUser({ ...auth.currentUser });
  };

 // পাসওয়ার্ড রিসেট এর কোড
  const resetPassword = async (email) => {
    if (!email) throw new Error("Please provide an email");
    await sendPasswordResetEmail(auth, email);
    return true;
  };


  const authInfo = {user,loading,registerUser,loginUser,loginWithGoogle,logOut, updateUserProfile,resetPassword,};     // ৪র্থ কাজ অবজেক্ট তৈরি করা। উপরের যত ফাংশন করা হবে সবকিছু এই অবজেক্টএর ভিতরে রাখতে হবে।

  return (
    <AuthContext.Provider value={authInfo}>      // ৩য় কাজ ভেলুর ভিতরে যা যা থাকবে সেগুল অন্য যেকোন ফাইল থেকে একসেস করা যাবে
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
