import { createContext, useEffect, useState } from "react";
import supabase from "../utils/supabase";
import { checkRole } from "../utils/supabase";

const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({
    isLoggedIn: false,
    user: null,
    roleData: null,
  });

  const [loading, setLoading] = useState(true); // true until session is checked

  // Check session on mount & listen to auth changes
  useEffect(() => {
    let mounted = true;

    const fetchSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user && mounted) {
          const { data: roleData } = await checkRole(session.user.email);
          setCurrentUser({
            isLoggedIn: true,
            user: session.user,
            roleData: roleData.user_role,
          });
        }
      } catch (err) {
        console.error("Error fetching session:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session && mounted) {
          setCurrentUser({ isLoggedIn: false, user: null, roleData: null });
        }
      },
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  // Login function
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
          roleData: roleData.user_role,
        });
        return true;
      }
    } catch (err) {
      console.error("Login error:", err.message);
      return false;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setCurrentUser({ isLoggedIn: false, user: null, roleData: null });
    } catch (err) {
      console.error("Logout error:", err.message);
    }
  };

  return (
    <LoginContext.Provider value={{ currentUser, userLogin, logout, loading }}>
      {children}
    </LoginContext.Provider>
  );
};

export default LoginContext;
