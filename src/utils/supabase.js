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

// fetch total equipment count
export const fetchTotalEquipmentCount = async () => {
  const { count, error } = await supabase
    .from("items")
    .select("*", { count: "exact", head: true });

  if (error) {
    throw error;
  }

  return count || 0;
};

// fetch in use equipment count (items with in_use status)
export const fetchInUseEquipmentCount = async () => {
  const { count, error } = await supabase
    .from("items")
    .select("*", { count: "exact", head: true })
    .eq("status", "in_use");

  if (error) {
    throw error;
  }

  return count || 0;
};

// fetch maintenance equipment count (items with maintenance status)
export const fetchMaintenanceEquipmentCount = async () => {
  const { count, error } = await supabase
    .from("items")
    .select("*", { count: "exact", head: true })
    .eq("status", "maintenance");

  if (error) {
    throw error;
  }

  return count || 0;
};

// fetch recent items (last added, limited to 3)
export const fetchRecentInventoryItems = async (limit = 3) => {
  const { data, error } = await supabase
    .from("items")
    .select(
      `
      id,
      status,
      created_at,
      product:product_id (
        id,
        brand,
        model,
        category:category_id (id, name)
      )
    `,
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return data || [];
};

// fetch all categories
export const fetchCategories = async () => {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (error) {
    throw error;
  }

  return data || [];
};

// fetch category by id
export const fetchCategoryById = async (categoryId) => {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", categoryId)
    .single();

  if (error) {
    throw error;
  }

  return data;
};

// fetch products by category
export const fetchProductsByCategory = async (categoryId) => {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      id,
      brand,
      brand_code,
      model,
      description
    `
    )
    .eq("category_id", categoryId)
    .order("brand");

  if (error) {
    throw error;
  }

  return data || [];
};

// generate next asset code based on product
export const generateAssetCode = async (productId) => {
  // Get the product with category info
  const { data: product, error: productError } = await supabase
    .from("products")
    .select(
      `
      id,
      brand_code,
      category:category_id (id, code)
    `
    )
    .eq("id", productId)
    .single();

  if (productError) {
    throw productError;
  }

  if (!product || !product.category?.code || !product.brand_code) {
    throw new Error("Product, category code, or brand code not found");
  }

  // Get all existing items to count those with matching prefix
  const { data: allItems, error: itemsError } = await supabase
    .from("items")
    .select("asset_code");

  if (itemsError) {
    throw itemsError;
  }

  // Count items with asset code starting with this category-brand prefix
  const prefix = `${product.category.code}-${product.brand_code.toUpperCase()}-`;
  const countForCategory = allItems?.filter(item =>
    item.asset_code && item.asset_code.startsWith(prefix)
  ).length || 0;

  // Generate next sequence number
  const nextNumber = countForCategory + 1;
  const paddedNumber = String(nextNumber).padStart(3, '0');

  return `${product.category.code}-${product.brand_code.toUpperCase()}-${paddedNumber}`;
};

// create a new product
export const createProduct = async (productData) => {
  const { data, error } = await supabase
    .from("products")
    .insert([productData])
    .select();

  if (error) {
    throw error;
  }

  return data?.[0] || null;
};

// create a new item
export const createItem = async (itemData) => {
  const { data, error } = await supabase
    .from("items")
    .insert([itemData])
    .select();

  if (error) {
    throw error;
  }

  return data?.[0] || null;
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
