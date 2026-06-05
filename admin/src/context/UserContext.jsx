import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const userDataContext = createContext();

const serverUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

function UserContext({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [user, setUser] = useState(null);

  const checkAuth = async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/auth/profile`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setIsAuthenticated(true);
        setUser(response.data.user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setLoadingAuth(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value = {
    serverUrl,
    isAuthenticated,
    setIsAuthenticated,
    loadingAuth,
    checkAuth,
    user,
    setUser,
  };

  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
}

export default UserContext;
