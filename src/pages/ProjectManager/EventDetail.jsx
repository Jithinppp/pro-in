import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  fetchEventById,
  fetchEventTypes,
  fetchProjectManagers,
  fetchEventAttachments,
} from "../../lib/supabase";
import Loader from "../../components/common/Loader";
import { capitalizeFirstLetter } from "../../utils/utils";

function EventDetail() {
  const { event_id } = useParams();
  const [event, setEvent] = useState(null);
  const [eventTypes, setEventTypes] = useState([]);
  const [projectManagers, setProjectManagers] = useState([]);
  const [attachments, setAttachments] = useState({
    floor_plan: [],
    agenda: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      setLoading(true);

      const [eventResult, eventTypesResult, pmResult] = await Promise.all([
        fetchEventById(event_id),
        fetchEventTypes(),
        fetchProjectManagers(),
      ]);

      if (isMounted) {
        if (eventResult.success) {
          setEvent(eventResult.event);

          // Fetch attachments after event is loaded
          if (isMounted) {
            const attachmentsResult = await fetchEventAttachments(event_id);
            if (isMounted) {
              if (attachmentsResult.success) {
                const floorPlans = attachmentsResult.attachments.filter(
                  (a) => a.file_type === "floor_plan",
                );
                const agendas = attachmentsResult.attachments.filter(
                  (a) => a.file_type === "agenda",
                );
                setAttachments({ floor_plan: floorPlans, agenda: agendas });
              } else {
                console.error(
                  "Failed to load attachments:",
                  attachmentsResult.error,
                );
              }
            }
          }
        } else {
          setError(eventResult.error);
        }

        if (eventTypesResult.success) {
          setEventTypes(eventTypesResult.eventTypes);
        }

        if (pmResult.success) {
          setProjectManagers(pmResult.managers);
        }

        setLoading(false);
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [event_id]);

  function getEventType(eventTypeId) {
    if (!eventTypeId) return { name: "N/A", description: "" };
    const id = Number(eventTypeId);
    const eventType = eventTypes.find((type) => type.id === id);
    return eventType
      ? { name: eventType.name, description: eventType.description || "" }
      : { name: eventTypeId, description: "" };
  }

  function getProjectManagerName(pmId) {
    if (!pmId) return "N/A";
    const pm = projectManagers.find((manager) => manager.id === pmId);
    return pm?.name || "N/A";
  }

  function formatDate(dateString) {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function formatDateTime(dateString) {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
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
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Event not found</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-gray-900">
            {event.event_name}
          </h1>
          <span
            className={`px-2.5 py-1 text-sm font-medium rounded-full ${getStatusColor(
              event.job_status,
            )}`}
          >
            {event.job_status || "pending"}
          </span>
        </div>
        <p className="text-base text-gray-500">
          {event.job_id || "No Job ID"} • Created{" "}
          {formatDateTime(event.created_at)}
        </p>
      </div>

      {/* Project Manager */}
      <div className="p-4">
        <p className="text-sm text-gray-500">PM in Charge</p>
        <p className="text-base font-medium text-gray-900">
          {getProjectManagerName(event.project_manager_id)}
        </p>
      </div>

      {/* Venues */}
      <div className="bg-gray-50 rounded-xl p-5">
        <p className="text-base font-medium text-gray-900 mb-3">Venues</p>
        {event.event_venues && event.event_venues.length > 0 ? (
          <div className="space-y-4">
            {event.event_venues.map((venue, index) => (
              <div key={venue.id || index} className="py-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">
                    {venue.venue_name || `Venue ${venue.venue_order}`}
                  </span>
                  <span className="text-sm text-gray-400">
                    Venue {venue.venue_order}
                  </span>
                </div>
                {venue.hall_name && (
                  <p className="text-sm text-gray-500 mb-2">
                    {capitalizeFirstLetter(venue.hall_name)}
                  </p>
                )}
                {venue.venue_address && (
                  <div className="mb-2">
                    <p className="text-xs text-gray-500 mb-3">
                      {venue.venue_address}
                    </p>
                    <div className="flex items-center gap-2">
                      <a
                        href={venue.venue_address}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                        Open in Google Maps
                      </a>
                      <button
                        type="button"
                        onClick={() =>
                          navigator.clipboard.writeText(venue.venue_address)
                        }
                        className="p-1.5 text-gray-500 hover:text-gray-700"
                        title="Copy address"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
                {venue.pax && (
                  <div className="flex items-center gap-1.5 mt-5">
                    <span className="px-2.5 py-1 text-sm font-medium border-b">
                      {venue.pax} Guests (PAX)
                    </span>
                    {/* <p className="text-md  text-gray-700">{venue.pax}</p> */}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No venues added</p>
        )}
      </div>

      {/* Info Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Event Type */}
        <div className="bg-gray-50 rounded-xl p-5">
          <p className="text-sm text-gray-500 mb-1">Event Type</p>
          <p className="text-base font-medium text-gray-900">
            {getEventType(event.event_type).name}
          </p>
          {getEventType(event.event_type).description && (
            <p className="text-sm text-gray-500 mt-1">
              {getEventType(event.event_type).description}
            </p>
          )}
        </div>

        {/* Client */}
        <div className="bg-gray-50 rounded-xl p-5">
          <p className="text-sm text-gray-500 mb-1">Client</p>
          <p className="text-base font-medium text-gray-900">
            {event.client_name}
          </p>
          <p className="text-sm text-gray-500 capitalize">
            {event.client_type}
          </p>
        </div>

        {/* Contact */}
        <div className="bg-gray-50 rounded-xl p-5">
          <p className="text-sm text-gray-500 mb-1">Contact</p>
          <p className="text-base font-medium text-gray-900">
            {event.contact_name}
          </p>
          <p className="text-sm text-gray-500">{event.contact_role}</p>
        </div>

        {/* Phone */}
        <div className="bg-gray-50 rounded-xl p-5">
          <p className="text-sm text-gray-500 mb-1">Phone</p>
          <p className="text-base font-medium text-gray-900">
            {event.contact_mobile}
          </p>
          {event.contact_email && (
            <p className="text-sm text-gray-500 truncate">
              {event.contact_email}
            </p>
          )}
        </div>
      </div>

      {/* Dates */}
      <div className="bg-gray-50 rounded-xl p-5">
        <p className="text-base font-medium text-gray-900 mb-3">Dates</p>
        <div className="space-y-2">
          {event.event_dates && event.event_dates.length > 0 ? (
            event.event_dates.map((date, index) => (
              <div
                key={date.id || index}
                className="flex items-center justify-between py-2"
              >
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 text-sm font-medium bg-gray-200 text-gray-700 rounded">
                    Day {date.date_order}
                  </span>
                  <span className="text-base text-gray-700">
                    {formatDate(date.event_date)}
                  </span>
                </div>
                <span className="text-sm text-gray-400">{date.notes}</span>
              </div>
            ))
          ) : (
            <div className="flex items-center gap-2 py-2">
              <span className="px-2.5 py-1 text-sm font-medium bg-gray-200 text-gray-700 rounded">
                Day 1
              </span>
              <span className="text-base text-gray-700">
                {formatDate(event.event_date)}
              </span>
            </div>
          )}
          {event.setup_date && (
            <div className="flex items-center gap-2 py-2">
              <span className="px-2.5 py-1 text-sm font-medium bg-amber-100 text-amber-700 rounded">
                SET
              </span>
              <span className="text-base text-gray-500">
                Setup: {formatDateTime(event.setup_date)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {event.description && (
        <div className="bg-gray-50 rounded-xl p-5">
          <p className="text-base font-medium text-gray-900 mb-2">
            Description
          </p>
          <p className="text-base text-gray-600 leading-relaxed">
            {event.description}
          </p>
        </div>
      )}

      {/* Attachments */}
      <div className="bg-gray-50 rounded-xl p-5">
        <p className="text-base font-medium text-gray-900 mb-3">Attachments</p>

        {/* Floor Plans */}
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Floor Plans</p>
          <div className="flex flex-wrap gap-2">
            {attachments.floor_plan.length > 0 ? (
              attachments.floor_plan.map((attachment) => (
                <a
                  key={attachment.id}
                  href={attachment.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-base text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {attachment.file_name}
                </a>
              ))
            ) : (
              <span className="px-4 py-2 text-base text-gray-400 bg-gray-100 border border-gray-200 rounded-lg">
                No floor plans uploaded
              </span>
            )}
          </div>
        </div>

        {/* Agendas */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">
            Agenda / Run of Show
          </p>
          <div className="flex flex-wrap gap-2">
            {attachments.agenda.length > 0 ? (
              attachments.agenda.map((attachment) => (
                <a
                  key={attachment.id}
                  href={attachment.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-base text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {attachment.file_name}
                </a>
              ))
            ) : (
              <span className="px-4 py-2 text-base text-gray-400 bg-gray-100 border border-gray-200 rounded-lg">
                No agendas uploaded
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetail;
