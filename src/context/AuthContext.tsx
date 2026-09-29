"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  plan: "trial" | "active" | "expired";
  trialEndsAt: string;
  hasSeenNotificationPrompt: boolean;
  hasFirstToken: boolean;
}

export interface AuthContextType {
  user: UserProfile | null;
  isLoggedIn: boolean;
  loginWithGoogle: () => void;
  logout: () => void;
  updateName: (name: string) => void;
  deleteAccount: () => void;
  markNotificationPromptSeen: () => void;
  markFirstTokenTaken: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_USER: UserProfile = {
  id: "user_101",
  name: "Rahul Verma",
  email: "rahul.verma@example.com",
  plan: "trial",
  trialEndsAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
  hasSeenNotificationPrompt: false,
  hasFirstToken: false,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("auth_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        setUser(DEFAULT_USER);
      }
    } else {
      // Initialize with default logged in user for prototype seamlessly
      setUser(DEFAULT_USER);
      localStorage.setItem("auth_user", JSON.stringify(DEFAULT_USER));
    }
  }, []);

  const saveUser = (u: UserProfile | null) => {
    setUser(u);
    if (u) {
      localStorage.setItem("auth_user", JSON.stringify(u));
    } else {
      localStorage.removeItem("auth_user");
    }
  };

  const loginWithGoogle = () => {
    saveUser(DEFAULT_USER);
  };

  const logout = () => {
    saveUser(null);
  };

  const updateName = (newName: string) => {
    if (user) {
      saveUser({ ...user, name: newName });
    }
  };

  const deleteAccount = () => {
    localStorage.clear();
    setUser(null);
  };

  const markNotificationPromptSeen = () => {
    if (user) {
      saveUser({ ...user, hasSeenNotificationPrompt: true });
    }
  };

  const markFirstTokenTaken = () => {
    if (user) {
      saveUser({ ...user, hasFirstToken: true });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: Boolean(user),
        loginWithGoogle,
        logout,
        updateName,
        deleteAccount,
        markNotificationPromptSeen,
        markFirstTokenTaken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
