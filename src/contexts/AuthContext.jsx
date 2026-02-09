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
          roleData: roleData.user_role,
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
    // console.log("effect in auth context", currentUser, loading);
    // Add session check logic here if needed
    let mounted = true;

    const fetchSession = async () => {
      setLoading(true);
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
      async (event, session) => {
        if (session?.user && mounted) {
          const { data: roleData } = await checkRole(session.user.email);
          setCurrentUser({
            isLoggedIn: true,
            user: session.user,
            roleData: roleData.user_role,
          });
        } else if (mounted) {
          setCurrentUser({ isLoggedIn: false, user: null, roleData: null });
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
