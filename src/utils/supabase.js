import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

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

// search equipments
export const searchEquipments = async (searchTerm) => {
  if (!searchTerm) {
    return [];
  }

  const { data, error } = await supabase
    .from("equipments")
    .select(
      `
      id,
      uuid,
      category,
      sub_category,
      equipment_items (*)
    `,
    )
    .ilike("sub_category", `%${searchTerm}%`);

  if (error) {
    console.error("Error searching equipments:", error);
    throw error; // or return []
  }

  return data;
};

export default supabase;
