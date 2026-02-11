import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchEvents } from "../../utils/supabase";

function PMEvents() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const eventTypeLabels = {
    interpretation: "Interpretation",
    rsi: "RSI",
    av: "AV",
    combined: "Combined",
  };

  // Helper function to get event status based on dates
  const getEventStatus = (event) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = event.event_start_date ? new Date(event.event_start_date) : null;
    const endDate = event.event_end_date ? new Date(event.event_end_date) : null;

    if (!startDate || !endDate) return null;

    if (endDate < today) {
      return { label: "Passed", color: "bg-gray-100 text-gray-600" };
    } else if (startDate > today) {
      return { label: "Upcoming", color: "bg-yellow-50 text-yellow-700" };
    } else {
      return { label: "Ongoing", color: "bg-green-50 text-green-700" };
    }
  };

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
              Manage all your events.
            </p>
          </div>
          <button
            onClick={() => navigate("/project-manager")}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-150"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
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

        {/* Status Legend */}
        <div className="flex items-center gap-4 mb-4 text-sm">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
            <span className="text-gray-600">Upcoming</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span className="text-gray-600">Ongoing</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-gray-400"></span>
            <span className="text-gray-600">Passed</span>
          </div>
        </div>

        {/* Events List */}
        {events.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg">No events yet</p>
            <p className="text-sm mt-1">
              Create your first event to get started.
            </p>
            <button
              onClick={() => navigate("/project-manager/create")}
              className="mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-150"
            >
              + Create Event
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => {
              const status = getEventStatus(event);
              return (
                <div
                  key={event.id}
                  onClick={() => navigate(`/project-manager/event/${event.id}`)}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                            {event.event_name}
                          </h3>
                          {status && (
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${status.color}`}>
                              {status.label}
                            </span>
                          )}
                          {event.event_type && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-full">
                              {eventTypeLabels[event.event_type] ||
                                event.event_type}
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
                                event.event_end_date !==
                                event.event_start_date &&
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

                      <div className="ml-4 shrink-0">
                        <span className="text-xs text-gray-400 hover:text-blue-600 transition-colors cursor-pointer">
                          Read more
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default PMEvents;
