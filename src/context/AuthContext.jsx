import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser, getUser } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (storedToken) {
        setToken(storedToken);

        // Try to restore user from localStorage first
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (e) {
            console.error("Failed to parse stored user data");
          }
        }

        // Fetch fresh user data from server to ensure it's up to date
        try {
          const userData = await getUser(storedToken);
          if (userData && !userData.error) {
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
          }
        } catch (err) {
          console.error("Failed to fetch user data:", err);
          // If fetch fails but we have stored user, keep using it
        }
      }

      setIsInitialized(true);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const res = await loginUser({ email, password });

      if (res.token) {
        setUser(res.user);
        setToken(res.token);
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));
        return true;
      } else {
        setError(res.message || "Login failed");
        return false;
      }
    } catch (err) {
      setError(err.message || "An error occurred");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, name) => {
    setLoading(true);
    setError(null);

    try {
      const res = await registerUser({ email, password, name });

      if (res.token) {
        setUser(res.user);
        setToken(res.token);
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));
        return true;
      } else {
        setError(res.message || "Registration failed");
        return false;
      }
    } catch (err) {
      setError(err.message || "An error occurred");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setError(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // Don't render children until auth state is initialized
  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
