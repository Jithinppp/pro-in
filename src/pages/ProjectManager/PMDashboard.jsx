import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";
import {
  fetchEventsCount,
  fetchEvents,
  fetchAvailableEquipmentCount,
} from "../../utils/supabase";

function PMDashboard() {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [eventsCount, setEventsCount] = useState(0);
  const [availableEquipment, setAvailableEquipment] = useState(0);
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Load events count
      const totalEvents = await fetchEventsCount();
      setEventsCount(totalEvents);

      // Load available equipment count
      const available = await fetchAvailableEquipmentCount();
      setAvailableEquipment(available);

      // Load recent 5 events
      const events = await fetchEvents(5);
      setRecentEvents(events || []);
    } catch {
      // Silent catch - error state already set
    } finally {
      setLoading(false);
    }
  };

  const logoutHandler = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getEventStatus = (event) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = event.event_start_date
      ? new Date(event.event_start_date)
      : null;
    const endDate = event.event_end_date
      ? new Date(event.event_end_date)
      : startDate;

    if (endDate < today) {
      return { label: "Completed", class: "bg-gray-100 text-gray-700" };
    }
    if (startDate && startDate >= today && endDate >= today) {
      return { label: "Upcoming", class: "bg-blue-100 text-blue-700" };
    }
    if (startDate && startDate <= today && endDate >= today) {
      return { label: "Ongoing", class: "bg-green-100 text-green-700" };
    }
    return { label: "Planning", class: "bg-amber-100 text-amber-700" };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-8 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Welcome back,{" "}
              {currentUser?.user?.email?.split("@")[0] || "Project Manager"}
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              Here's what's happening with your projects today.
            </p>
          </div>
          <button
            onClick={logoutHandler}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-150"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Total Events
                    </p>
                    <p className="text-2xl font-semibold text-gray-900 mt-1">
                      {eventsCount}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center text-xl bg-blue-50 text-blue-600">
                    📅
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Equipment Available
                    </p>
                    <p className="text-2xl font-semibold text-gray-900 mt-1">
                      {availableEquipment}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center text-xl bg-green-50 text-green-600">
                    🔧
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Upcoming Events
                    </p>
                    <p className="text-2xl font-semibold text-gray-900 mt-1">
                      {
                        recentEvents.filter((e) => {
                          const status = getEventStatus(e);
                          return status.label === "Upcoming";
                        }).length
                      }
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center text-xl bg-purple-50 text-purple-600">
                    🚀
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Completed
                    </p>
                    <p className="text-2xl font-semibold text-gray-900 mt-1">
                      {
                        recentEvents.filter((e) => {
                          const status = getEventStatus(e);
                          return status.label === "Completed";
                        }).length
                      }
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center text-xl bg-amber-50 text-amber-600">
                    ✅
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Quick Actions */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Quick Actions
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <button
                      onClick={() => navigate("/project-manager/create")}
                      className="flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-200 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <span className="text-2xl mb-2">+</span>
                      <span className="text-sm font-medium">Create Event</span>
                    </button>
                    <button
                      onClick={() => navigate("/project-manager/events")}
                      className="flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-200 bg-gray-100 hover:bg-gray-200 text-gray-700"
                    >
                      <span className="text-2xl mb-2">📅</span>
                      <span className="text-sm font-medium">View Events</span>
                    </button>
                    <button
                      onClick={() => navigate("/project-manager/equipments")}
                      className="flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-200 bg-gray-100 hover:bg-gray-200 text-gray-700"
                    >
                      <span className="text-2xl mb-2">🔧</span>
                      <span className="text-sm font-medium">Equipment</span>
                    </button>
                    <button
                      onClick={() => navigate("/project-manager/reports")}
                      className="flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-200 bg-gray-100 hover:bg-gray-200 text-gray-700"
                    >
                      <span className="text-2xl mb-2">📊</span>
                      <span className="text-sm font-medium">Reports</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Events */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Recent Events
                    </h2>
                    <button
                      onClick={() => navigate("/project-manager/events")}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View all
                    </button>
                  </div>

                  {recentEvents.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <p className="text-sm">No events yet</p>
                      <button
                        onClick={() => navigate("/project-manager/create")}
                        className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Create your first event
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recentEvents.map((event) => {
                        const status = getEventStatus(event);
                        return (
                          <div
                            key={event.id}
                            onClick={() => navigate("/project-manager/events")}
                            className="flex items-start justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-150 cursor-pointer"
                          >
                            <div>
                              <p className="font-medium text-gray-900 text-sm">
                                {event.event_name || "Untitled Event"}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {event.client_name &&
                                  `Client: ${event.client_name} · `}
                                {formatDate(event.event_start_date)}
                              </p>
                              <span
                                className={`inline-block mt-2 px-2 py-0.5 text-xs rounded-full ${status.class}`}
                              >
                                {status.label}
                              </span>
                            </div>
                            {event.audience_size && (
                              <span className="text-xs text-gray-500">
                                {event.audience_size} pax
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default PMDashboard;
