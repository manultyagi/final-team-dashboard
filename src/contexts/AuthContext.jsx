// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("td_user_v1");
    return raw ? JSON.parse(raw) : null;
  });

  const login = (username, password) => {
    if (!username || password.length < 4) return { success: false, message: "Password must be 4+ chars" };
    const token = "mock-token-" + btoa(username + ":" + Date.now());
    const u = { username, token };
    localStorage.setItem("td_user_v1", JSON.stringify(u));
    setUser(u);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem("td_user_v1");
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}
