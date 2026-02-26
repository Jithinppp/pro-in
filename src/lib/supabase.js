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
        setup_date: eventData.setup_date,
        event_date: eventData.event_date,
        is_multiple_days: eventData.is_multiple_days,
        contact_name: eventData.contact_name,
        contact_role: eventData.contact_role,
        contact_mobile: eventData.contact_mobile,
        contact_email: eventData.contact_email,
        is_on_site: eventData.is_on_site,
        file_floor_plan: eventData.file_floor_plan,
        file_run_of_show: eventData.file_run_of_show,
        user_id: userId,
        created_by: userId,
      })
      .select()
      .single();

    if (eventError) {
      console.error("Error creating event:", eventError);
      return { success: false, error: eventError.message };
    }

    const eventId = event.id;

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
      parking_passes: eventData.parking_passes
        ? parseInt(eventData.parking_passes)
        : null,
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
          parking_passes: venue.parking_passes
            ? parseInt(venue.parking_passes)
            : null,
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

    // Insert additional dates for multi-day events
    if (
      eventData.is_multiple_days &&
      eventData.additional_dates &&
      eventData.additional_dates.length > 0
    ) {
      const datesToInsert = eventData.additional_dates.map((date, index) => ({
        event_id: eventId,
        date_order: index + 2,
        event_date: date.date,
        notes: date.notes,
      }));

      const { error: datesError } = await supabase
        .from("event_dates")
        .insert(datesToInsert);

      if (datesError) {
        console.error("Error creating additional dates:", datesError);
        return { success: false, error: datesError.message };
      }
    }

    return { success: true, event };
  } catch (err) {
    console.error("Unexpected error creating event:", err);
    return { success: false, error: err.message };
  }
}
