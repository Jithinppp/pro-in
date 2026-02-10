import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchEvents, updateEvent } from "../../utils/supabase";

function PMEvents() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);

  const eventTypeLabels = {
    interpretation: "Interpretation",
    rsi: "RSI",
    av: "AV",
    combined: "Combined",
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

  const startEditing = (event) => {
    setEditingId(event.id);
    setEditData({
      event_name: event.event_name || "",
      client_name: event.client_name || "",
      event_start_date: event.event_start_date || "",
      event_end_date: event.event_end_date || "",
      event_location: event.event_location || "",
      venue: event.venue || "",
      hall_name: event.hall_name || "",
      event_desc: event.event_desc || "",
      event_type: event.event_type || "",
      setup_date_time: event.setup_date_time || "",
      audience_size: event.audience_size || "",
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const saveEdit = async () => {
    setSaving(true);
    try {
      const payload = {
        ...editData,
        audience_size: editData.audience_size
          ? parseInt(editData.audience_size, 10)
          : null,
      };
      await updateEvent(editingId, payload);
      // Refresh events list
      await loadEvents();
      setEditingId(null);
      setEditData({});
    } catch (err) {
      setError(err.message || "Failed to update event");
    } finally {
      setSaving(false);
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
            className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-150"
          >
            ← Back
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
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
              >
                {editingId === event.id ? (
                  /* Edit Mode */
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                        Editing Event
                      </h3>
                      <div className="flex gap-2">
                        <button
                          onClick={cancelEditing}
                          disabled={saving}
                          className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={saveEdit}
                          disabled={saving}
                          className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {saving ? "Saving..." : "Save"}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Event Name
                        </label>
                        <input
                          type="text"
                          name="event_name"
                          value={editData.event_name}
                          onChange={handleEditChange}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Client Name
                        </label>
                        <input
                          type="text"
                          name="client_name"
                          value={editData.client_name}
                          onChange={handleEditChange}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Start Date
                        </label>
                        <input
                          type="date"
                          name="event_start_date"
                          value={editData.event_start_date}
                          onChange={handleEditChange}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          End Date
                        </label>
                        <input
                          type="date"
                          name="event_end_date"
                          value={editData.event_end_date}
                          onChange={handleEditChange}
                          min={editData.event_start_date}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          name="event_location"
                          value={editData.event_location}
                          onChange={handleEditChange}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Venue
                        </label>
                        <input
                          type="text"
                          name="venue"
                          value={editData.venue}
                          onChange={handleEditChange}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Hall Name
                        </label>
                        <input
                          type="text"
                          name="hall_name"
                          value={editData.hall_name}
                          onChange={handleEditChange}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Event Type
                        </label>
                        <select
                          name="event_type"
                          value={editData.event_type}
                          onChange={handleEditChange}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                          <option value="">Select type</option>
                          <option value="interpretation">Interpretation</option>
                          <option value="rsi">RSI</option>
                          <option value="av">AV</option>
                          <option value="combined">Combined</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Setup Date Time
                        </label>
                        <input
                          type="datetime-local"
                          name="setup_date_time"
                          value={editData.setup_date_time}
                          onChange={handleEditChange}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Audience Size (pax)
                        </label>
                        <input
                          type="number"
                          name="audience_size"
                          value={editData.audience_size}
                          onChange={handleEditChange}
                          min="0"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Description
                      </label>
                      <textarea
                        name="event_desc"
                        value={editData.event_desc}
                        onChange={handleEditChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                    </div>
                  </div>
                ) : (
                  /* View Mode */
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {event.event_name}
                          </h3>
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

                        {event.setup_date_time && (
                          <p className="text-xs text-gray-400 mt-2">
                            Setup:{" "}
                            {new Date(event.setup_date_time).toLocaleString()}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => startEditing(event)}
                        className="ml-4 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-150 shrink-0"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PMEvents;
