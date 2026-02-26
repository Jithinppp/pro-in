import { createContext, useState, useEffect } from "react";
import { supabase, getUserRole, authLogin, authLogout } from "../lib/supabase";

const AuthContext = createContext(null);

export { AuthContext };

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user role and set it
  const fetchUserRole = async (email) => {
    const userRole = await getUserRole(email);
    setRole(userRole);
    return userRole;
  };

  // Check for existing session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        fetchUserRole(session.user.email);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        fetchUserRole(session.user.email);
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    setError(null);

    const result = await authLogin(email, password);

    if (!result.success) {
      console.error("Login error:", result.error);
      setError(result.error);
      return { success: false, error: result.error };
    }

    setUser(result.user);
    setRole(result.role);

    return { success: true, role: result.role };
  };

  const logout = async () => {
    setError(null);
    try {
      await authLogout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      setRole(null);
    }
  };

  const value = {
    user,
    role,
    loading,
    error,
    login,
    logout,
    clearError: () => setError(null),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
