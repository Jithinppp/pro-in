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
  } catch {
    return null;
  }
};

// search equipments - search products by name and get total item quantity per product
export const searchEquipments = async (searchTerm) => {
  if (!searchTerm) {
    return [];
  }

  // Search products by brand or model, include category and item count
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      id,
      brand,
      model,
      category:category_id (id, name),
      items:items (count)
    `,
    )
    .or(`brand.ilike.%${searchTerm}%,model.ilike.%${searchTerm}%`);

  if (error) {
    throw error;
  }

  // Transform data to include quantity as a number
  const transformed = data?.map((product) => ({
    ...product,
    quantity: product.items?.[0]?.count ?? 0,
  }));

  return transformed;
};

// fetch product by id
export const fetchProductById = async (productId) => {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      id,
      brand,
      model,
      category:category_id (id, name),
      items:items (id, status)
    `,
    )
    .eq("id", productId)
    .single();

  if (error) {
    throw error;
  }

  return data;
};

// create event
export const createEvent = async (eventData) => {
  const { data, error } = await supabase
    .from("events")
    .insert([eventData])
    .select();

  if (error) {
    throw error;
  }

  return data;
};

// fetch all events
export const fetchEvents = async (limit = null) => {
  let query = supabase
    .from("events")
    .select("*")
    .order("event_start_date", { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data;
};

// fetch single item by id
export const fetchItemById = async (itemId) => {
  const { data, error } = await supabase
    .from("items")
    .select(
      `
      id,
      status,
      product:product_id (
        id,
        brand,
        model,
        category:category_id (id, name)
      )
    `,
    )
    .eq("id", itemId);

  if (error) {
    throw error;
  }

  return data?.[0] || null;
};
export const fetchEventById = async (eventId) => {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", eventId);

  if (error) {
    throw error;
  }

  return data?.[0] || null;
};
export const fetchEventsCount = async () => {
  const { count, error } = await supabase
    .from("events")
    .select("*", { count: "exact", head: true });

  if (error) {
    throw error;
  }

  return count || 0;
};

// fetch available equipment count (items with available status)
export const fetchAvailableEquipmentCount = async () => {
  const { count, error } = await supabase
    .from("items")
    .select("*", { count: "exact", head: true })
    .eq("status", "available");

  if (error) {
    throw error;
  }

  return count || 0;
};

// update event
export const updateEvent = async (eventId, eventData) => {
  const { data, error } = await supabase
    .from("events")
    .update(eventData)
    .eq("id", eventId)
    .select();

  if (error) {
    throw error;
  }

  return data;
};

export default supabase;
