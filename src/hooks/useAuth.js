"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only set up auth listener if Firebase auth is available
    if (!auth) {
      console.warn("Firebase auth not available");
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(
        user
          ? {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
            }
          : null
      );
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signup = (email, password, displayName) => {
    if (!auth) {
      throw new Error("Firebase auth not available");
    }
    return createUserWithEmailAndPassword(auth, email, password).then(
      (result) => updateProfile(result.user, { displayName })
    );
  };

  const login = (email, password) => {
    if (!auth) {
      throw new Error("Firebase auth not available");
    }
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    if (!auth) {
      throw new Error("Firebase auth not available");
    }
    return signOut(auth);
  };

  const resetPassword = (email) => {
    if (!auth) {
      throw new Error("Firebase auth not available");
    }
    return sendPasswordResetEmail(auth, email);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, resetPassword, loading }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
