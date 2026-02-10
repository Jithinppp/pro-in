import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchEvents } from "../../utils/supabase";

function TechEvents() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await fetchEvents();
      setEvents(data || []);
    } catch (err) {
      setError(err.message || "Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-8 py-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Events</h1>
            <p className="text-gray-500 mt-1 text-sm">
              View all your assigned events.
            </p>
          </div>
          <button
            onClick={() => navigate("/tech")}
            className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-150"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-6">
        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-800 mb-4">
            {error}
            <button
              onClick={() => setError("")}
              className="ml-2 text-red-600 hover:text-red-800 font-medium"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Events List */}
        {events.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg">No events yet</p>
            <p className="text-sm mt-1">
              Events will appear here when they are assigned to you.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-200"
                onClick={() => navigate(`/tech/event/${event.id}`)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {event.event_name}
                        </h3>
                        {event.event_type && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-full">
                            {event.event_type.charAt(0).toUpperCase() +
                              event.event_type.slice(1)}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mb-3">
                        Client: {event.client_name || "—"}
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                        <div>
                          <span className="text-gray-400 text-xs block">
                            Date
                          </span>
                          <span className="text-gray-700">
                            {formatDate(event.event_start_date)}
                            {event.event_end_date &&
                              event.event_end_date !== event.event_start_date &&
                              ` — ${formatDate(event.event_end_date)}`}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400 text-xs block">
                            Location
                          </span>
                          <span className="text-gray-700">
                            {event.event_location || "—"}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400 text-xs block">
                            Venue
                          </span>
                          <span className="text-gray-700">
                            {event.venue || "—"}
                            {event.hall_name && ` · ${event.hall_name}`}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400 text-xs block">
                            Audience
                          </span>
                          <span className="text-gray-700">
                            {event.audience_size
                              ? `${event.audience_size} pax`
                              : "—"}
                          </span>
                        </div>
                      </div>

                      {event.event_desc && (
                        <p className="text-sm text-gray-500 mt-3 line-clamp-2">
                          {event.event_desc}
                        </p>
                      )}
                    </div>

                    <div className="ml-4 flex flex-col items-end gap-2">
                      <span className="text-xs text-blue-600 font-medium">
                        View Details →
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TechEvents;
