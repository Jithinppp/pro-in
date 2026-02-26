import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper to get user role by email
export async function getUserRole(email) {
    const { data, error } = await supabase
        .from("user_roles")
        .select("user_role")
        .eq("user_email", email)
        .maybeSingle();

    if (error) {
        console.error("Error fetching user role:", error);
        return null;
    }

    return data?.user_role || null;
}

// Route mapping based on role
export const roleToRoute = {
    pm: "/pm",
    tech: "/tech",
    inv: "/inv",
};
