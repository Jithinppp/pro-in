import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper to get user role by email
export async function getUserRole(email) {
  if (!email) return null;

  try {
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
  } catch (err) {
    console.error("Unexpected error fetching role:", err);
    return null;
  }
}

// Route mapping based on role
export const roleToRoute = {
  pm: "/pm",
  tech: "/tech",
  inv: "/inv",
};

// Fetch recent events (last 5, ordered by creation date)
export async function fetchRecentEvents(limit = 5) {
  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching events:", error);
      return { success: false, error: error.message, events: [] };
    }

    return { success: true, events: data || [] };
  } catch (err) {
    console.error("Unexpected error fetching events:", err);
    return { success: false, error: err.message, events: [] };
  }
}

// Fetch all events for PM Events page with pagination
export async function fetchEvents(page = 1, limit = 20) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  try {
    const { data, error, count } = await supabase
      .from("events")
      .select("*", { count: "exact" })
      .order("event_date", { ascending: true })
      .range(from, to);

    if (error) {
      console.error("Error fetching events:", error);
      return { success: false, error: error.message, events: [], total: 0 };
    }

    return { success: true, events: data || [], total: count || 0 };
  } catch (err) {
    console.error("Unexpected error fetching events:", err);
    return { success: false, error: err.message, events: [], total: 0 };
  }
}

// Fetch a single event by ID
export async function fetchEventById(eventId) {
  try {
    // Fetch event
    const { data: event, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", eventId)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Error fetching event:", error);
      return { success: false, error: error.message, event: null };
    }

    // Fetch event dates from event_dates table
    const { data: eventDates, error: datesError } = await supabase
      .from("event_dates")
      .select("*")
      .eq("event_id", eventId)
      .order("date_order", { ascending: true });

    if (datesError) {
      console.error("Error fetching event dates:", datesError);
    }

    // Fetch event venues from event_venues table
    const { data: eventVenues, error: venuesError } = await supabase
      .from("event_venues")
      .select("*")
      .eq("event_id", eventId)
      .order("venue_order", { ascending: true });

    if (venuesError) {
      console.error("Error fetching event venues:", venuesError);
    }

    // Attach dates and venues to event object
    return {
      success: true,
      event: {
        ...event,
        event_dates: eventDates || [],
        event_venues: eventVenues || [],
      },
    };
  } catch (err) {
    console.error("Unexpected error fetching event:", err);
    return { success: false, error: err.message, event: null };
  }
}

// Fetch event counts for dashboard
export async function fetchEventCounts() {
  try {
    // Get total count
    const { count: total, error: totalError } = await supabase
      .from("events")
      .select("*", { count: "exact", head: true });

    // Get confirmed count
    const { count: confirmed, error: confirmedError } = await supabase
      .from("events")
      .select("*", { count: "exact", head: true })
      .eq("job_status", "confirmed");

    // Get completed count
    const { count: completed, error: completedError } = await supabase
      .from("events")
      .select("*", { count: "exact", head: true })
      .eq("job_status", "completed");

    // Get pending count
    const { count: pending, error: pendingError } = await supabase
      .from("events")
      .select("*", { count: "exact", head: true })
      .eq("job_status", "pending");

    if (totalError || confirmedError || completedError || pendingError) {
      console.error(
        "Error fetching event counts:",
        totalError || confirmedError || completedError || pendingError,
      );
      return {
        success: false,
        error: "Failed to fetch counts",
        total: 0,
        confirmed: 0,
        completed: 0,
        pending: 0,
      };
    }

    return {
      success: true,
      total: total || 0,
      confirmed: confirmed || 0,
      completed: completed || 0,
      pending: pending || 0,
    };
  } catch (err) {
    console.error("Unexpected error fetching event counts:", err);
    return {
      success: false,
      error: err.message,
      total: 0,
      confirmed: 0,
      completed: 0,
      pending: 0,
    };
  }
}

// Fetch project managers from project_managers table
export async function fetchProjectManagers() {
  try {
    const { data, error } = await supabase
      .from("project_managers")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Error fetching project managers:", error);
      return { success: false, error: error.message, managers: [] };
    }

    return { success: true, managers: data || [] };
  } catch (err) {
    console.error("Unexpected error fetching project managers:", err);
    return { success: false, error: err.message, managers: [] };
  }
}

// Fetch event types from event_types table
export async function fetchEventTypes() {
  try {
    const { data, error } = await supabase
      .from("event_types")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Error fetching event types:", error);
      return { success: false, error: error.message, eventTypes: [] };
    }

    return { success: true, eventTypes: data || [] };
  } catch (err) {
    console.error("Unexpected error fetching event types:", err);
    return { success: false, error: err.message, eventTypes: [] };
  }
}

// Create a new event type
export async function createEventType(name, description) {
  try {
    const { data, error } = await supabase
      .from("event_types")
      .insert([{ name, description }])
      .select()
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Error creating event type:", error);
      return { success: false, error: error.message };
    }

    return { success: true, eventType: data };
  } catch (err) {
    console.error("Unexpected error creating event type:", err);
    return { success: false, error: err.message };
  }
}

// Fetch the last event's job_id to generate next sequence
export async function fetchLastJobId() {
  try {
    const { data, error } = await supabase
      .from("events")
      .select("job_id")
      .not("job_id", "is", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Error fetching last job_id:", error);
      return { success: false, error: error.message, jobId: null };
    }

    return { success: true, jobId: data?.job_id || null };
  } catch (err) {
    console.error("Unexpected error fetching last job_id:", err);
    return { success: false, error: err.message, jobId: null };
  }
}

// Sign in with email and password
export async function authLogin(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: error.message, user: null };
  }

  // Fetch user role after successful login
  if (data?.user) {
    const userRole = await getUserRole(data.user.email);

    if (!userRole) {
      await supabase.auth.signOut();
      const roleError = "No role assigned. Please contact administrator.";
      return { success: false, error: roleError, user: null };
    }

    return { success: true, error: null, user: data.user, role: userRole };
  }

  return { success: true, error: null, user: data?.user };
}

// logout function
export async function authLogout() {
  await supabase.auth.signOut();
}

// Create event with venues and dates
export async function createEvent(eventData, userId) {
  try {
    // Insert main event
    const { data: event, error: eventError } = await supabase
      .from("events")
      .insert({
        job_id: eventData.job_id,
        event_name: eventData.event_name,
        description: eventData.description,
        client_name: eventData.client_name,
        client_type: eventData.client_type,
        event_type: eventData.event_type,
        project_manager_id: eventData.project_manager_id,
        job_status: eventData.job_status,
        setup_date: eventData.setup_date,
        event_date: eventData.event_date,
        is_multiple_days: eventData.is_multiple_days,
        contact_name: eventData.contact_name,
        contact_role: eventData.contact_role,
        contact_mobile: eventData.contact_mobile,
        contact_email: eventData.contact_email,
        file_floor_plan: eventData.file_floor_plan,
        file_run_of_show: eventData.file_run_of_show,
        user_id: userId,
        created_by: userId,
      })
      .select()
      .limit(1)
      .maybeSingle();

    if (eventError) {
      console.error("Error creating event:", eventError);
      return { success: false, error: eventError.message };
    }

    if (!event) {
      return { success: false, error: "Failed to create event" };
    }

    const eventId = event.id;

    // Insert primary event date into event_dates table (date_order = 1)
    if (eventData.event_date) {
      const { error: primaryDateError } = await supabase
        .from("event_dates")
        .insert({
          event_id: eventId,
          date_order: 1,
          event_date: eventData.event_date,
        });

      if (primaryDateError) {
        console.error("Error creating primary date:", primaryDateError);
        await supabase.from("events").delete().eq("id", eventId);
        return { success: false, error: primaryDateError.message };
      }
    }

    // Insert additional dates into event_dates table
    if (eventData.additional_dates && eventData.additional_dates.length > 0) {
      const datesToInsert = eventData.additional_dates.map((date, index) => ({
        event_id: eventId,
        date_order: index + 2,
        event_date: date.date,
      }));

      const { error: datesError } = await supabase
        .from("event_dates")
        .insert(datesToInsert);

      if (datesError) {
        console.error("Error creating additional dates:", datesError);
        // Rollback: Delete the event and all related data
        await supabase.from("event_dates").delete().eq("event_id", eventId);
        await supabase.from("event_venues").delete().eq("event_id", eventId);
        await supabase.from("events").delete().eq("id", eventId);
        return { success: false, error: datesError.message };
      }
    }

    // Insert first venue (from main fields)
    const { error: venueError } = await supabase.from("event_venues").insert({
      event_id: eventId,
      venue_order: 1,
      venue_name: eventData.venue_name,
      hall_name: eventData.hall_name,
      venue_address: eventData.venue_address,
      pax: eventData.pax ? parseInt(eventData.pax) : null,
      loading_dock_notes: eventData.loading_dock_notes,
      safety_precautions: eventData.safety_precautions,
      parking_passes: eventData.parking_passes || null,
      security_access: eventData.security_access,
    });

    if (venueError) {
      console.error("Error creating venue:", venueError);
      // Delete the event if venue fails
      await supabase.from("events").delete().eq("id", eventId);
      return { success: false, error: venueError.message };
    }

    // Insert additional venues
    if (eventData.additional_venues && eventData.additional_venues.length > 0) {
      const venuesToInsert = eventData.additional_venues.map(
        (venue, index) => ({
          event_id: eventId,
          venue_order: index + 2,
          venue_name: venue.venue_name,
          hall_name: venue.hall_name,
          venue_address: venue.venue_address,
          pax: venue.pax ? parseInt(venue.pax) : null,
          loading_dock_notes: venue.loading_dock_notes,
          safety_precautions: venue.safety_precautions,
          parking_passes: venue.parking_passes || null,
          security_access: venue.security_access,
        }),
      );

      const { error: additionalVenuesError } = await supabase
        .from("event_venues")
        .insert(venuesToInsert);

      if (additionalVenuesError) {
        console.error(
          "Error creating additional venues:",
          additionalVenuesError,
        );
        return { success: false, error: additionalVenuesError.message };
      }
    }

    return { success: true, event };
  } catch (err) {
    console.error("Unexpected error creating event:", err);
    return { success: false, error: err.message };
  }
}

// Update an existing event
export async function updateEvent(eventId, eventData, userId) {
  try {
    // Update main event
    const { data: event, error: eventError } = await supabase
      .from("events")
      .update({
        event_name: eventData.event_name,
        description: eventData.description,
        client_name: eventData.client_name,
        client_type: eventData.client_type,
        event_type: eventData.event_type,
        project_manager_id: eventData.project_manager_id,
        job_status: eventData.job_status,
        setup_date: eventData.setup_date,
        event_date: eventData.event_date,
        contact_name: eventData.contact_name,
        contact_role: eventData.contact_role,
        contact_mobile: eventData.contact_mobile,
        contact_email: eventData.contact_email,
        file_floor_plan: eventData.file_floor_plan,
        file_run_of_show: eventData.file_run_of_show,
        updated_at: new Date().toISOString(),
      })
      .eq("id", eventId)
      .select()
      .limit(1)
      .maybeSingle();

    if (eventError) {
      console.error("Error updating event:", eventError);
      return { success: false, error: eventError.message };
    }

    // Delete existing dates and re-insert
    await supabase.from("event_dates").delete().eq("event_id", eventId);

    // Insert primary event date
    if (eventData.event_date) {
      await supabase.from("event_dates").insert({
        event_id: eventId,
        date_order: 1,
        event_date: eventData.event_date,
      });
    }

    // Insert additional dates
    if (eventData.additional_dates && eventData.additional_dates.length > 0) {
      const datesToInsert = eventData.additional_dates.map((date, index) => ({
        event_id: eventId,
        date_order: index + 2,
        event_date: date.date,
      }));
      await supabase.from("event_dates").insert(datesToInsert);
    }

    // Delete existing venues and re-insert
    await supabase.from("event_venues").delete().eq("event_id", eventId);

    // Insert primary venue
    await supabase.from("event_venues").insert({
      event_id: eventId,
      venue_order: 1,
      venue_name: eventData.venue_name,
      hall_name: eventData.hall_name,
      venue_address: eventData.venue_address,
      pax: eventData.pax ? parseInt(eventData.pax) : null,
      loading_dock_notes: eventData.loading_dock_notes,
      safety_precautions: eventData.safety_precautions,
      parking_passes: eventData.parking_passes || null,
      security_access: eventData.security_access,
    });

    // Insert additional venues
    if (eventData.additional_venues && eventData.additional_venues.length > 0) {
      const venuesToInsert = eventData.additional_venues.map((venue, index) => ({
        event_id: eventId,
        venue_order: index + 2,
        venue_name: venue.venue_name,
        hall_name: venue.hall_name,
        venue_address: venue.venue_address,
        pax: venue.pax ? parseInt(venue.pax) : null,
        loading_dock_notes: venue.loading_dock_notes,
        safety_precautions: venue.safety_precautions,
        parking_passes: venue.parking_passes || null,
        security_access: venue.security_access,
      }));
      await supabase.from("event_venues").insert(venuesToInsert);
    }

    return { success: true, event };
  } catch (err) {
    console.error("Unexpected error updating event:", err);
    return { success: false, error: err.message };
  }
}

// Upload file to Supabase Storage
export async function uploadFile(
  file,
  bucketName = "event_attachment_bucket",
  folder = "",
  jobId = "",
  sequence = "",
) {
  try {
    // Format: jobId-img-01, jobId-img-02, etc.
    const fileName = folder + jobId + "-img-" + sequence + "-" + file.name;
    const { error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file);

    if (error) {
      console.error("Error uploading file:", error);
      return { success: false, error: error.message, url: null };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    return { success: true, url: urlData.publicUrl };
  } catch (err) {
    console.error("Unexpected error uploading file:", err);
    return { success: false, error: err.message, url: null };
  }
}

// Upload multiple files and save to event_attachments table
export async function uploadEventAttachments(
  eventId,
  files,
  fileType,
  jobId = "",
) {
  try {
    const attachments = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Sequence number: 01, 02, 03, etc.
      const sequence = String(i + 1).padStart(2, "0");

      const result = await uploadFile(
        file,
        "event_attachment_bucket",
        fileType + "/",
        jobId,
        sequence,
      );

      if (result.success) {
        attachments.push({
          event_id: eventId,
          file_type: fileType,
          file_url: result.url,
          file_name: file.name,
        });
      }
    }

    if (attachments.length > 0) {
      const { error } = await supabase
        .from("event_attachments")
        .insert(attachments);

      if (error) {
        console.error("Error saving attachments:", error);
        return { success: false, error: error.message };
      }
    }

    return { success: true };
  } catch (err) {
    console.error("Unexpected error:", err);
    return { success: false, error: err.message };
  }
}

// Fetch attachments for an event
export async function fetchEventAttachments(eventId) {
  try {
    const { data, error } = await supabase
      .from("event_attachments")
      .select("*")
      .eq("event_id", eventId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching attachments:", error);
      return { success: false, error: error.message };
    }

    return { success: true, attachments: data };
  } catch (err) {
    console.error("Unexpected error:", err);
    return { success: false, error: err.message };
  }
}

// ==================== INVENTORY FUNCTIONS ====================

// Fetch all categories
export async function fetchCategories() {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching categories:", error);
      return { success: false, error: error.message, categories: [] };
    }

    return { success: true, categories: data || [] };
  } catch (err) {
    console.error("Unexpected error fetching categories:", err);
    return { success: false, error: err.message, categories: [] };
  }
}

// Fetch models by category ID
export async function fetchModelsByCategory(categoryId) {
  try {
    const { data, error } = await supabase
      .from("models")
      .select("*")
      .eq("category_id", categoryId)
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching models:", error);
      return { success: false, error: error.message, models: [] };
    }

    return { success: true, models: data || [] };
  } catch (err) {
    console.error("Unexpected error fetching models:", err);
    return { success: false, error: err.message, models: [] };
  }
}

// Fetch all models
export async function fetchAllModels() {
  try {
    const { data, error } = await supabase
      .from("models")
      .select("*, categories(name, code)")
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching models:", error);
      return { success: false, error: error.message, models: [] };
    }

    return { success: true, models: data || [] };
  } catch (err) {
    console.error("Unexpected error fetching models:", err);
    return { success: false, error: err.message, models: [] };
  }
}

// Get next asset sequence for a category + brand combination
export async function getAssetSequence(categoryCode, brandCode) {
  console.log("=== getAssetSequence FUNCTION ===");
  console.log("Searching assets table with prefix:", `${categoryCode}-${brandCode}-`);
  try {
    const prefix = `${categoryCode}-${brandCode}-`;

    const { data, error } = await supabase
      .from("assets")
      .select("asset_code")
      .like("asset_code", `${prefix}%`)
      .order("asset_code", { ascending: false })
      .limit(1);

    console.log("assets table query result:", data);

    if (error) {
      console.error("Error fetching sequence:", error);
      return { success: false, error: error.message, sequence: 1 };
    }

    let nextSequence = 1;
    if (data && data.length > 0) {
      const lastCode = data[0].asset_code;
      console.log("Last asset_code found:", lastCode);
      const lastSeq = parseInt(lastCode.split("-")[2], 10);
      console.log("Extracted sequence number:", lastSeq);
      nextSequence = isNaN(lastSeq) ? 1 : lastSeq + 1;
      console.log("Next sequence will be:", nextSequence);
    } else {
      console.log("No existing assets found, starting with sequence: 1");
    }

    return { success: true, sequence: nextSequence };
  } catch (err) {
    console.error("Unexpected error fetching sequence:", err);
    return { success: false, error: err.message, sequence: 1 };
  }
}

// Fetch assets with pagination and search
export async function fetchAssets(page = 1, limit = 20, searchQuery = "") {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  try {
    let query = supabase
      .from("assets")
      .select(
        "*, models(id, name, brand, brand_code, categories(id, name, code))",
        { count: "exact" },
      )
      .order("created_at", { ascending: false })
      .range(from, to);

    if (searchQuery) {
      // Fetch more results for client-side filtering on related fields
      // (PostgREST doesn't easily support .or() on foreign table columns)
      query = query.range(0, 99); // Fetch up to 100 items for client-side search
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching assets:", error);
      return { success: false, error: error.message, assets: [], total: 0 };
    }

    let filteredData = data || [];

    // Client-side filtering for model/brand/category fields
    // (PostgREST doesn't easily support .or() on foreign table columns)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredData = filteredData.filter((asset) => {
        const modelName = asset.models?.name?.toLowerCase() || "";
        const modelBrand = asset.models?.brand?.toLowerCase() || "";
        const categoryName =
          asset.models?.categories?.name?.toLowerCase() || "";
        const categoryCode =
          asset.models?.categories?.code?.toLowerCase() || "";

        return (
          modelName.includes(query) ||
          modelBrand.includes(query) ||
          categoryName.includes(query) ||
          categoryCode.includes(query)
        );
      });

      // Apply pagination to filtered results
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      filteredData = filteredData.slice(from, to + 1);
    }

    return { success: true, assets: filteredData, total: count || 0 };
  } catch (err) {
    console.error("Unexpected error fetching assets:", err);
    return { success: false, error: err.message, assets: [], total: 0 };
  }
}

// Fetch asset by ID
export async function fetchAssetById(assetId) {
  try {
    const { data, error } = await supabase
      .from("assets")
      .select(
        "*, models(id, name, brand, brand_code, categories(id, name, code))",
      )
      .eq("id", assetId)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Error fetching asset:", error);
      return { success: false, error: error.message, asset: null };
    }

    if (!data) {
      return { success: false, error: "Asset not found", asset: null };
    }

    return { success: true, asset: data };
  } catch (err) {
    console.error("Unexpected error fetching asset:", err);
    return { success: false, error: err.message, asset: null };
  }
}

// Create new asset with auto-generated code
export async function createAsset(assetData) {
  console.log("=== createAsset FUNCTION ===");
  console.log("1. Fetching from: models table (to get category code)");
  try {
    // Get category and model info to build asset code
    const { data: modelData, error: modelError } = await supabase
      .from("models")
      .select("*, categories(code)")
      .eq("id", assetData.models_id)
      .limit(1)
      .maybeSingle();

    if (modelError || !modelData) {
      console.error("Error fetching model:", modelError);
      return { success: false, error: "Model not found" };
    }

    console.log("models table result:", modelData);

    const categoryCode = modelData.categories?.code || "UNK";
    const brandCode = modelData.brand_code || "XXX";
    console.log("2. categoryCode:", categoryCode, ", brandCode:", brandCode);

    // Get next sequence
    console.log("3. Calling getAssetSequence (fetches from: assets table)");
    const seqResult = await getAssetSequence(categoryCode, brandCode);
    console.log("getAssetSequence result:", seqResult);

    const sequence = seqResult.sequence.toString().padStart(4, "0");
    const assetCode = `${categoryCode}-${brandCode}-${sequence}`;
    console.log("4. Generated asset_code:", assetCode);

    console.log("5. Inserting into: assets table");
    // Insert asset
    const { data, error } = await supabase
      .from("assets")
      .insert([
        {
          models_id: assetData.models_id,
          asset_code: assetCode,
          serial_number: assetData.serial_number || null,
          supplier_name: assetData.supplier_name || null,
          invoice_number: assetData.invoice_number || null,
          purchase_date: assetData.purchase_date || null,
          purchase_price: assetData.purchase_price || null,
          condition: assetData.condition || "good",
          status: assetData.status || "available",
          description: assetData.description || null,
        },
      ])
      .select()
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Error creating asset:", error);
      return { success: false, error: error.message };
    }

    if (!data) {
      return { success: false, error: "Failed to create asset" };
    }

    return { success: true, asset: data };
  } catch (err) {
    console.error("Unexpected error creating asset:", err);
    return { success: false, error: err.message };
  }
}

// Bulk create assets from CSV data
export async function createBulkAssets(csvData, categoryId, modelId, onProgress) {
  console.log("=== createBulkAssets FUNCTION ===");
  console.log("CSV data count:", csvData.length);
  console.log("categoryId:", categoryId, "modelId:", modelId);

  try {
    // Get category and model info
    console.log("Fetching model info from: models table");
    const { data: modelData, error: modelError } = await supabase
      .from("models")
      .select("*, categories(code)")
      .eq("id", modelId)
      .limit(1)
      .maybeSingle();

    if (modelError || !modelData) {
      console.error("Error fetching model:", modelError);
      return { success: false, error: "Model not found" };
    }

    const categoryCode = modelData.categories?.code || "UNK";
    const brandCode = modelData.brand_code || "XXX";
    console.log("categoryCode:", categoryCode, "brandCode:", brandCode);

    // Get current max sequence
    console.log("Getting current sequence from: assets table");
    const seqResult = await getAssetSequence(categoryCode, brandCode);
    let currentSequence = seqResult.sequence;
    console.log("Starting sequence:", currentSequence);

    // Process in batches of 500 (Supabase limit is 1000)
    const batchSize = 500;
    let insertedCount = 0;
    const totalBatches = Math.ceil(csvData.length / batchSize);

    for (let i = 0; i < csvData.length; i += batchSize) {
      const batch = csvData.slice(i, i + batchSize);
      const batchNumber = Math.floor(i / batchSize) + 1;
      console.log(`Processing batch ${batchNumber}/${totalBatches}`);

      // Generate asset codes for this batch
      const assetsToInsert = batch.map((row) => {
        const sequence = currentSequence.toString().padStart(4, "0");
        const assetCode = `${categoryCode}-${brandCode}-${sequence}`;
        currentSequence++;

        return {
          models_id: modelId,
          asset_code: assetCode,
          serial_number: row.serial_number || null,
          supplier_name: row.supplier_name || null,
          invoice_number: row.invoice_number || null,
          purchase_date: row.purchase_date || null,
          purchase_price: row.purchase_price ? parseFloat(row.purchase_price) : null,
          condition: row.condition || "good",
          status: row.status || "available",
          description: row.description || null,
        };
      });

      console.log("Inserting batch of:", assetsToInsert.length, "assets");

      // Bulk insert
      const { error: insertError } = await supabase
        .from("assets")
        .insert(assetsToInsert);

      if (insertError) {
        console.error("Error inserting batch:", insertError);
        return { success: false, error: `Error inserting batch ${batchNumber}: ${insertError.message}` };
      }

      insertedCount += batch.length;
      const progress = Math.round((insertedCount / csvData.length) * 100);
      console.log("Progress:", progress, "%");

      if (onProgress) {
        onProgress(progress);
      }
    }

    console.log("Bulk import complete! Total inserted:", insertedCount);
    return { success: true, count: insertedCount };
  } catch (err) {
    console.error("Unexpected error in bulk import:", err);
    return { success: false, error: err.message };
  }
}

// Update asset
export async function updateAsset(assetId, assetData) {
  try {
    const { data, error } = await supabase
      .from("assets")
      .update({
        models_id: assetData.models_id,
        serial_number: assetData.serial_number || null,
        supplier_name: assetData.supplier_name || null,
        invoice_number: assetData.invoice_number || null,
        purchase_date: assetData.purchase_date || null,
        purchase_price: assetData.purchase_price || null,
        condition: assetData.condition || null,
        status: assetData.status || null,
        description: assetData.description || null,
      })
      .eq("id", assetId)
      .select()
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Error updating asset:", error);
      return { success: false, error: error.message };
    }

    return { success: true, asset: data };
  } catch (err) {
    console.error("Unexpected error updating asset:", err);
    return { success: false, error: err.message };
  }
}

// Delete asset
export async function deleteAsset(assetId) {
  try {
    const { error } = await supabase.from("assets").delete().eq("id", assetId);

    if (error) {
      console.error("Error deleting asset:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("Unexpected error deleting asset:", err);
    return { success: false, error: err.message };
  }
}

// Fetch inventory stats (counts)
export async function fetchInventoryStats() {
  try {
    const { data, error } = await supabase.from("assets").select("*");

    if (error) {
      console.error("Error fetching stats:", error);
      return { success: false, error: error.message };
    }

    const total = data?.length || 0;
    // Since there's no status field, we'll just show total
    const available = total;
    const inUse = 0;
    const lowStock = 0;

    return {
      success: true,
      stats: { total, available, inUse, lowStock },
    };
  } catch (err) {
    console.error("Unexpected error fetching stats:", err);
    return {
      success: false,
      error: err.message,
      stats: { total: 0, available: 0, inUse: 0, lowStock: 0 },
    };
  }
}
