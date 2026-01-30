import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export const roles = {
  tech: "technicians",
  pm: "project-manager",
  inv: "inventory",
};

// get session
export const checkSession = async () => {
  try {
    const { data } = await supabase.auth.getSession();
    return data.session;
  } catch (error) {
    console.log("Error fetching session:", error.message);
    return null;
  }
};

// login
export const login = async (email, password) => {
  try {
    const { data } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    return data.user;
  } catch (error) {
    console.log("Login error:", error.message);
    return null;
  }
};

// logout
export const logout = async () => {
  try {
    await supabase.auth.signOut();
    console.log("logout success");
    return true;
  } catch (error) {
    console.log("Logout error:", error.message);
    return null;
  }
};

// get roleData
export const checkRole = async (user_email) => {
  try {
    const data = await supabase
      .from("user_roles")
      .select("*")
      .eq("user_email", user_email)
      .single();
    return data;
  } catch (error) {
    console.log("Error checking role:", error.message);
    return null;
  }
};

// create user
// const createUser = async (email, password) => {
//   const { data, error } = await supabase.auth.signUp({
//     email: email,
//     password: password,
//   });
//   if (error) {
//     console.log("Create user error:", error.message);
//     return;
//   }
//   setCurrentUser({ isLoggedIn: true, user: data.user });
//   console.log("User created successfully:", data);
// };

export default supabase;
