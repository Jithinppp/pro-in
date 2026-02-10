// Auth context for sign in with email and password
import { createContext, useState, useEffect } from "react";
import supabase from "../utils/supabase";
import { checkRole } from "../utils/supabase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({
    isLoggedIn: false,
    user: null,
    roleData: null,
  });
  const [loading, setLoading] = useState(true);

  const userLogin = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      const user = data.user;
      if (user) {
        const { data: roleData } = await checkRole(user.email);
        setCurrentUser({
          isLoggedIn: true,
          user: user,
          roleData: roleData?.user_role || null,
        });
        return true;
      }
    } catch (err) {
      console.error("Login error:", err.message);
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setCurrentUser({ isLoggedIn: false, user: null, roleData: null });
    } catch (err) {
      console.error("Logout error:", err.message);
    }
  };

  //effect logics here
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async (session) => {
      try {
        if (session?.user) {
          const { data: roleData } = await checkRole(session.user.email);
          if (mounted) {
            setCurrentUser({
              isLoggedIn: true,
              user: session.user,
              roleData: roleData?.user_role || null,
            });
          }
        } else if (mounted) {
          setCurrentUser({ isLoggedIn: false, user: null, roleData: null });
        }
      } catch (err) {
        console.error("Error initializing auth:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      initializeAuth(session);
    });

    // Listen for auth changes (login, logout, token refresh)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Skip INITIAL_SESSION since we handle it above with getSession
        if (event === "INITIAL_SESSION") return;

        if (event === "SIGNED_OUT") {
          if (mounted) {
            setCurrentUser({ isLoggedIn: false, user: null, roleData: null });
          }
          return;
        }

        // For SIGNED_IN, TOKEN_REFRESHED etc., re-fetch role
        if (session?.user && mounted) {
          // Use setTimeout to avoid Supabase deadlock with async in listener
          setTimeout(() => {
            initializeAuth(session);
          }, 0);
        }
      },
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, loading, userLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
