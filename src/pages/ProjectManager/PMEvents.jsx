import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchEvents, fetchEventTypes } from "../../lib/supabase";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";

const EVENTS_PER_PAGE = 20;

function PMEvents() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      setLoading(true);

      const [eventsResult, eventTypesResult] = await Promise.all([
        fetchEvents(1, EVENTS_PER_PAGE),
        fetchEventTypes(),
      ]);

      if (isMounted) {
        if (eventsResult.success) {
          setEvents(eventsResult.events);
          setTotal(eventsResult.total);
          setHasMore(eventsResult.events.length < eventsResult.total);
        } else {
          setError(eventsResult.error);
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
  }, []);

  async function loadMore() {
    setLoadingMore(true);
    const nextPage = page + 1;
    const result = await fetchEvents(nextPage, EVENTS_PER_PAGE);

    if (result.success) {
      setEvents([...events, ...result.events]);
      setPage(nextPage);
      setHasMore(events.length + result.events.length < total);
    }
    setLoadingMore(false);
  }

  function getEventTypeName(eventTypeId) {
    if (!eventTypeId) return "N/A";
    const id = Number(eventTypeId);
    const eventType = eventTypes.find((type) => type.id === id);
    return eventType?.name || eventTypeId;
  }

  function handleEventClick(eventId) {
    navigate(`/pm/events/${eventId}`);
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Events</h1>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {events.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No events found.</p>
        </div>
      ) : (
        <>
          <div className="grid gap-3">
            {events.map((event) => (
              <div
                key={event.id}
                onClick={() => handleEventClick(event.id)}
                className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 cursor-pointer transition-colors"
              >
                {/* Mobile layout - each detail on separate line */}
                <div className="sm:hidden space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">
                      {event.event_name}
                    </h3>
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(
                        event.job_status,
                      )}`}
                    >
                      {event.job_status || "pending"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Job: {event.job_id || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Client: {event.client_name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Date: {formatDate(event.event_date)}
                  </p>
                  <p className="text-sm text-gray-500">
                    Type: {getEventTypeName(event.event_type)}
                  </p>
                </div>

                {/* Desktop layout */}
                <div className="hidden sm:flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900 truncate">
                        {event.event_name}
                      </h3>
                      <span
                        className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(
                          event.job_status,
                        )}`}
                      >
                        {event.job_status || "pending"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{event.client_name}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-medium text-gray-900">
                      {formatDate(event.event_date)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {getEventTypeName(event.event_type)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-6">
              <Button
                onClick={loadMore}
                disabled={loadingMore}
                variant="secondary"
              >
                {loadingMore
                  ? "Loading..."
                  : `See More (${total - events.length} remaining)`}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default PMEvents;
