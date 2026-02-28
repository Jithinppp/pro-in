import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchEventById, fetchEventTypes } from "../../lib/supabase";
import Loader from "../../components/common/Loader";

function EventDetail() {
  const { event_id } = useParams();
  const [event, setEvent] = useState(null);
  const [eventTypes, setEventTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      setLoading(true);

      const [eventResult, eventTypesResult] = await Promise.all([
        fetchEventById(event_id),
        fetchEventTypes(),
      ]);

      if (isMounted) {
        if (eventResult.success) {
          setEvent(eventResult.event);
        } else {
          setError(eventResult.error);
        }

        if (eventTypesResult.success) {
          setEventTypes(eventTypesResult.eventTypes);
        }

        setLoading(false);
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [event_id]);

  function getEventTypeName(eventTypeId) {
    if (!eventTypeId) return "N/A";
    const id = Number(eventTypeId);
    const eventType = eventTypes.find((type) => type.id === id);
    return eventType?.name || eventTypeId;
  }

  function formatDate(dateString) {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function formatDateTime(dateString) {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getStatusColor(status) {
    switch (status) {
      case "confirmed":
        return "bg-emerald-500/10 text-emerald-600";
      case "completed":
        return "bg-blue-500/10 text-blue-600";
      case "cancelled":
        return "bg-red-500/10 text-red-600";
      case "pending":
      default:
        return "bg-amber-500/10 text-amber-600";
    }
  }

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="p-4 bg-red-50 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Event not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {event.event_name}
            </h1>
            <p className="text-gray-500 mt-1">
              Job ID: {event.job_id || "N/A"}
            </p>
          </div>
          <span
            className={`px-4 py-1.5 text-sm font-medium rounded-full ${getStatusColor(
              event.job_status,
            )}`}
          >
            {event.job_status || "pending"}
          </span>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Basic Info */}
          <div className="bg-gray-50 rounded-xl p-5">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
              Event Details
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-400">Event Type</p>
                <p className="text-gray-900 font-medium">
                  {getEventTypeName(event.event_type)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Client Type</p>
                <p className="text-gray-900 capitalize">{event.client_type}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Client Name</p>
                <p className="text-gray-900">{event.client_name}</p>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="bg-gray-50 rounded-xl p-5">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
              Schedule
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-400">Event Date</p>
                <p className="text-gray-900 font-medium">
                  {formatDate(event.event_date)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Setup Date</p>
                <p className="text-gray-900">
                  {formatDateTime(event.setup_date)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Multiple Days</p>
                <p className="text-gray-900">
                  {event.is_multiple_days ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-gray-50 rounded-xl p-5">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
              Contact
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-400">Name</p>
                <p className="text-gray-900 font-medium">
                  {event.contact_name}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Role</p>
                <p className="text-gray-900">{event.contact_role}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Mobile</p>
                <p className="text-gray-900">{event.contact_mobile}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {event.description && (
          <div className="bg-gray-50 rounded-xl p-5">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">
              Description
            </h3>
            <p className="text-gray-700">{event.description}</p>
          </div>
        )}

        {/* Attachments */}
        <div className="bg-gray-50 rounded-xl p-5">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
            Attachments
          </h3>
          <div className="flex gap-6">
            <div>
              <p className="text-xs text-gray-400 mb-1">Floor Plan</p>
              {event.file_floor_plan ? (
                <a
                  href={event.file_floor_plan}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View File
                </a>
              ) : (
                <p className="text-gray-400">None</p>
              )}
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Run of Show</p>
              {event.file_run_of_show ? (
                <a
                  href={event.file_run_of_show}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View File
                </a>
              ) : (
                <p className="text-gray-400">None</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-sm text-gray-400 text-center">
          Created {formatDateTime(event.created_at)} • Updated{" "}
          {formatDateTime(event.updated_at)}
        </p>
      </div>
    </div>
  );
}

export default EventDetail;
