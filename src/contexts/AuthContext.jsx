import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase, getUserRole, roleToRoute } from "../lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

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
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (session?.user) {
                    setUser(session.user);
                    fetchUserRole(session.user.email);
                } else {
                    setUser(null);
                    setRole(null);
                }
                setLoading(false);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const fetchUserRole = useCallback(async (email) => {
        const userRole = await getUserRole(email);
        setRole(userRole);
    }, []);

    const login = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.error("Login error:", error.message);
            return { success: false, error: error.message };
        }

        // Fetch user role after successful login and wait for it
        if (data.user) {
            const userRole = await getUserRole(data.user.email);
            setRole(userRole);
            return { success: true, role: userRole };
        }

        return { success: true };
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setRole(null);
    };

    const value = {
        user,
        role,
        loading,
        login,
        logout,
        getRedirectRoute: () => role ? roleToRoute[role] : null,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

export default AuthContext;
