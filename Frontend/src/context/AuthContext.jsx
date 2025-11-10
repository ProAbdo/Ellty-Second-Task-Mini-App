import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

const USER_STORAGE_KEY = "user";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const persistUser = useCallback((userData) => {
    if (userData) {
      setUser(userData);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    } else {
      setUser(null);
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, []);

  const logout = useCallback(() => {
    api.setToken(null);
    persistUser(null);
  }, [persistUser]);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = api.getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const storedUser = localStorage.getItem(USER_STORAGE_KEY);
        if (storedUser) {
          persistUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Failed to restore user session", error);
        localStorage.removeItem(USER_STORAGE_KEY);
      }

      try {
        const data = await api.getCurrentUser();
        if (data.user) {
          persistUser(data.user);
        } else {
          logout();
        }
      } catch (error) {
        console.error("Failed to verify session", error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [persistUser, logout]);

  const login = async (username, password) => {
    try {
      const data = await api.login(username, password);
      if (data.user) {
        persistUser(data.user);
      }
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (username, password) => {
    try {
      const data = await api.register(username, password);
      if (data.user) {
        persistUser(data.user);
      }
      if (data.token) {
        api.setToken(data.token);
      }
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
