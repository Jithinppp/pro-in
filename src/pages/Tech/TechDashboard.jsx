import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";
import { useEquipment } from "../../contexts/EquipmentContext";
import Card from "../../components/Card";
import { fetchEvents } from "../../utils/supabase";

function TechDashboard() {
  const { currentUser, loading: authLoading, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { searchTerm, setSearchTerm, results, loading, search } =
    useEquipment();
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);

  const logoutHandler = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  const quickActions = [
    {
      label: "My Events",
      icon: "📅",
      path: "/tech/events",
      color: "bg-gray-100 hover:bg-gray-200 text-gray-700",
    },
    {
      label: "Search Equipment",
      icon: "🔍",
      color: "bg-blue-600 hover:bg-blue-700 text-white",
    },
  ];

  // Fetch upcoming events
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setEventsLoading(true);
        const today = new Date().toISOString().split("T")[0];
        const data = await fetchEvents(5);
        // Filter to upcoming events (from today onwards) and take up to 5
        const filtered = data
          ?.filter((event) => event.event_start_date >= today)
          .slice(0, 5);
        setUpcomingEvents(filtered || []);
      } catch (err) {
        console.error("Failed to load events:", err);
      } finally {
        setEventsLoading(false);
      }
    };

    loadEvents();
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      search(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, search]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-8 py-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Welcome back,{" "}
              {currentUser?.user?.email?.split("@")[0] || "Technician"}
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              Manage your equipment and events.
            </p>
          </div>
          <button
            onClick={logoutHandler}
            className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-150"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-6 space-y-4">
        {/* Quick Actions & Events - Same Line, Vertical & Small */}
        <div className="flex gap-2 flex-wrap items-center">
          {quickActions.map((action, index) => (
            <button
              key={`action-${index}`}
              onClick={() => navigate(action.path)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 ${action.color}`}
            >
              <span className="text-sm">{action.icon}</span>
              <span className="text-xs font-medium">{action.label}</span>
            </button>
          ))}
          {eventsLoading ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-400"></div>
              <span className="text-xs text-gray-500">Loading events...</span>
            </div>
          ) : upcomingEvents.length > 0 ? (
            upcomingEvents.map((event) => (
              <button
                key={event.id}
                onClick={() => navigate(`/tech/event/${event.id}`)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-150"
              >
                <span className="text-xs font-medium text-gray-700">
                  {event.event_name}
                </span>
                <span className="text-xs text-gray-500">
                  {formatDate(event.event_start_date)}
                </span>
              </button>
            ))
          ) : (
            <span className="text-xs text-gray-500">No upcoming events</span>
          )}
          <button
            onClick={() => navigate("/tech/events")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-150"
          >
            <span className="text-xs font-medium text-gray-600">
              See All Events
            </span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Search Equipment
          </h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by category or sub-category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Search Results */}
          <div className="mt-6">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {results.map((item) => (
                  <Card key={item.id} item={item} basePath="/tech/equipment" />
                ))}
              </div>
            ) : searchTerm.trim() ? (
              <div className="text-center py-8 text-gray-500">
                <p>No equipment found for "{searchTerm}"</p>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p>Start typing to search equipment...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TechDashboard;
