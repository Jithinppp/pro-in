import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../../utils/supabase";

function CreateEvent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSingleDay, setIsSingleDay] = useState(false);

  const [formData, setFormData] = useState({
    event_name: "",
    client_name: "",
    event_start_date: "",
    event_end_date: "",
    event_location: "",
    venue: "",
    hall_name: "",
    event_desc: "",
    event_type: "",
    setup_date_time: "",
    audience_size: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSingleDayToggle = (e) => {
    const checked = e.target.checked;
    setIsSingleDay(checked);
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        event_end_date: prev.event_start_date,
      }));
    }
  };

  const handleStartDateChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      event_start_date: value,
      ...(isSingleDay ? { event_end_date: value } : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const eventPayload = {
        ...formData,
        audience_size: formData.audience_size
          ? parseInt(formData.audience_size, 10)
          : null,
      };

      // If single day, ensure end date matches start date
      if (isSingleDay) {
        eventPayload.event_end_date = eventPayload.event_start_date;
      }

      await createEvent(eventPayload);
      navigate("/project-manager", { replace: true });
    } catch (err) {
      setError(err.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  const eventTypes = [
    { value: "interpretation", label: "Interpretation" },
    { value: "rsi", label: "RSI" },
    { value: "av", label: "AV" },
    { value: "combined", label: "Combined" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-8 py-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Create Event
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              Fill in the details to create a new event.
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
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-800">
              {error}
            </div>
          )}

          {/* Event Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="event_name"
              value={formData.event_name}
              onChange={handleChange}
              required
              placeholder="Enter event name"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Client Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="client_name"
              value={formData.client_name}
              onChange={handleChange}
              required
              placeholder="Enter client name"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Event Date */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <label className="block text-sm font-medium text-gray-700">
                Event Date <span className="text-red-500">*</span>
              </label>
              <label className="flex items-center gap-1.5 text-sm text-gray-500 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isSingleDay}
                  onChange={handleSingleDayToggle}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Single day event
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  {isSingleDay ? "Event Date" : "Start Date"}
                </label>
                <input
                  type="date"
                  name="event_start_date"
                  value={formData.event_start_date}
                  onChange={handleStartDateChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              {!isSingleDay && (
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="event_end_date"
                    value={formData.event_end_date}
                    onChange={handleChange}
                    required
                    min={formData.event_start_date}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Event Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="event_location"
              value={formData.event_location}
              onChange={handleChange}
              required
              placeholder="Enter event location"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Venue & Hall Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Venue <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                required
                placeholder="Enter venue"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hall Name
              </label>
              <input
                type="text"
                name="hall_name"
                value={formData.hall_name}
                onChange={handleChange}
                placeholder="Enter hall name"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Event Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Type <span className="text-red-500">*</span>
            </label>
            <select
              name="event_type"
              value={formData.event_type}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="">Select event type</option>
              {eventTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Setup Date Time & Audience Size */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Setup Date Time
              </label>
              <input
                type="datetime-local"
                name="setup_date_time"
                value={formData.setup_date_time}
                onChange={handleChange}
                step="60"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Audience Size (pax)
              </label>
              <input
                type="number"
                name="audience_size"
                value={formData.audience_size}
                onChange={handleChange}
                placeholder="e.g. 200"
                min="0"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Event Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Description
            </label>
            <textarea
              name="event_desc"
              value={formData.event_desc}
              onChange={handleChange}
              rows={4}
              placeholder="Describe the event..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={() => navigate("/project-manager")}
              className="px-6 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-150 mr-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateEvent;

