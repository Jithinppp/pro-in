import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export const roles = {
  tech: "technicians",
  pm: "project-manager",
  inv: "inventory",
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
