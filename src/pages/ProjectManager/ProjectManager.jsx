import { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import Button from "../../components/common/Button";
import { fetchRecentEvents } from "../../lib/supabase";

function ProjectManager() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadEvents = async () => {
    setLoading(true);
    setError(null);
    const result = await fetchRecentEvents(5);
    if (result.success) {
      setEvents(result.events);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      await loadEvents();
    };
    fetchData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700";
      case "completed":
        return "bg-blue-100 text-blue-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      case "pending":
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="p-6">
      {/* Quick Stats - Top */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Active Projects</p>
          <p className="text-2xl font-semibold text-gray-900">12</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Pending Tasks</p>
          <p className="text-2xl font-semibold text-gray-900">24</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Team Members</p>
          <p className="text-2xl font-semibold text-gray-900">8</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Equipment Available</p>
          <p className="text-2xl font-semibold text-gray-900">156</p>
        </div>
      </div>

      {/* Action Buttons - Compact horizontal row */}
      <div className="flex flex-wrap gap-3 mb-6">
        {/* Create Event */}
        <Link to="create-event">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <svg
              className="w-4 h-4 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="text-sm font-medium text-gray-700">
              Create Event
            </span>
          </button>
        </Link>

        {/* Reports */}
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <svg
            className="w-4 h-4 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <span className="text-sm font-medium text-gray-700">Reports</span>
        </button>

        {/* Search Equipment */}
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <svg
            className="w-4 h-4 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <span className="text-sm font-medium text-gray-700">
            Search Equipment
          </span>
        </button>
      </div>

      {/* Task List Section */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4">
          {loading ? (
            <p className="text-gray-500 text-center py-4">Loading events...</p>
          ) : error ? (
            <p className="text-red-500 text-center py-4">Error: {error}</p>
          ) : events.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No events found</p>
          ) : (
            <div className="space-y-3">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-1 h-12 rounded-full bg-blue-500"></div>
                    <div>
                      <p className="text-base font-semibold text-gray-900">
                        {event.event_name || event.job_id}
                      </p>
                      <p className="text-sm text-gray-500">
                        {event.event_date || "No date set"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1.5 text-sm font-medium rounded-full ${getStatusColor(event.job_status)}`}
                    >
                      {event.job_status || "pending"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* See More Button */}
        <div className="border-t border-gray-200 p-4">
          <Link to="events">
            <button className="w-full py-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
              See More →
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProjectManager;
