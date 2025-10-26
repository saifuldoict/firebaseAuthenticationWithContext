import React, { createContext, useState, useEffect } from "react";
import {getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword,updateProfile,signOut,GoogleAuthProvider,signInWithPopup,onAuthStateChanged,sendPasswordResetEmail,} from "firebase/auth";
import app from "../firebase/firebase.config";
export const AuthContext = createContext();


const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

 
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


  const logOut = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };


  const updateUserProfile = async (profile) => {
    if (!auth.currentUser) throw new Error("No user is logged in");
    await updateProfile(auth.currentUser, profile);
    setUser({ ...auth.currentUser });
  };


  const resetPassword = async (email) => {
    if (!email) throw new Error("Please provide an email");
    await sendPasswordResetEmail(auth, email);
    return true;
  };


  const authInfo = {user,loading,registerUser,loginUser,loginWithGoogle,logOut, updateUserProfile,resetPassword,};

  return (
    <AuthContext.Provider value={authInfo}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
