// ============================================================
// context/AuthContext.jsx — Authentication state + actions
//
// Provides: user, token, loading, login(), logout(), register()
// Persists token + user to localStorage via utils/auth.js
// ============================================================

import { createContext, useState, useEffect, useCallback } from "react";
import { api } from "../api/axiosInstance";
import { AUTH_ROUTES } from "../utils/constants";
import { setToken, getToken, clearAuth, isAuthenticated } from "../utils/auth";

// Create the context (exported so useAuth hook can consume it)
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Initialize from localStorage so auth persists on page refresh
  // Remove user state, only use token
  const [token, setTokenState] = useState(getToken);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // On mount: if we have a token, verify it's still valid with the server
  useEffect(() => {
    
    const verifyToken = async () => {
      if (!isAuthenticated()) {
        clearAuth();
        setTokenState(null);
        return;
      }
      // Optionally, you can verify token with server here if needed
    };
    verifyToken();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ---------- Login ----------
  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post(AUTH_ROUTES.LOGIN, { email, password });
      // Our axiosInstance returns response.data directly
      const { token: newToken, data } = response;
      if (!newToken) {
        throw new Error("Invalid login response");
      }
      setToken(newToken);
      setTokenState(newToken);
      setUser(data.user);
      return { success: true };
    } catch (err) {
      const message = err.message || "Login failed";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  // ---------- Register ----------
  const register = useCallback(async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post(AUTH_ROUTES.REGISTER, {
        name,
        email,
        password,
      });
      const { token: newToken } = res;
      setToken(newToken);
      setTokenState(newToken);
      return { success: true };
    } catch (err) {
      const message = err.message || "Registration failed";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  // ---------- Logout ----------
  const logout = useCallback(async () => {
    try {
      await api.post(AUTH_ROUTES.LOGOUT).catch(() => {});
    } finally {
      clearAuth();
      setTokenState(null);
    }
  }, []);

  // ---------- Update user in state (e.g. after profile edit) ----------
  // No-op: user state removed
  const updateUser = useCallback(() => {}, []);

  const value = {
    token,
    user,
    loading,
    error,
    isLoggedIn: !!token,
    login,
    logout,
    register,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
