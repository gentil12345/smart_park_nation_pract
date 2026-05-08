import { createContext, useContext, useState, useEffect } from "react";
import api from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    api.get("/auth/me")
      .then(({ data }) => { if (data.loggedIn) setUser({ username: data.username }); })
      .finally(() => setChecking(false));
  }, []);

  const login = async (username, password) => {
    try {
      const { data } = await api.post("/auth/login", { username, password });
      setUser({ username: data.username });
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Login failed" };
    }
  };

  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, checking, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
