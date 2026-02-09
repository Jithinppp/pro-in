import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";
import { searchEquipments } from "../../utils/supabase";
import Card from "../../components/Card";

function TechDashboard() {
  const { currentUser, loading: authLoading, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

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
      path: "/tech/equipment",
      color: "bg-blue-600 hover:bg-blue-700 text-white",
    },
  ];

  // Debounced search
  useEffect(() => {
    const trimmed = searchTerm.trim();

    if (trimmed === "") {
      setResults([]);
      setSearchLoading(false);
      return;
    }
    setSearchLoading(true);

    const timer = setTimeout(async () => {
      try {
        const data = await searchEquipments(searchTerm);
        setResults(data);
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setSearchLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

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
        <div className="max-w-6xl mx-auto flex items-center justify-between">
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
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-150"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Search & Quick Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => navigate(action.path)}
                    className={`flex items-center gap-3 p-4 rounded-xl transition-all duration-200 ${action.color}`}
                  >
                    <span className="text-xl">{action.icon}</span>
                    <span className="text-sm font-medium">{action.label}</span>
                  </button>
                ))}
              </div>
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
                {searchLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : results.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {results.map((item) => (
                      <Card key={item.id} item={item} />
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

          {/* Recent Activity / Events */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Upcoming Events
                </h2>
                <button
                  onClick={() => navigate("/tech/events")}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View all
                </button>
              </div>
              <div className="space-y-4">
                {[
                  {
                    name: "Tech Conference",
                    date: "Mar 15, 2024",
                    time: "9:00 AM",
                    status: "Assigned",
                  },
                  {
                    name: "Product Demo",
                    date: "Mar 18, 2024",
                    time: "2:00 PM",
                    status: "Pending",
                  },
                  {
                    name: "Workshop Setup",
                    date: "Mar 22, 2024",
                    time: "8:00 AM",
                    status: "Confirmed",
                  },
                ].map((event, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-150 cursor-pointer"
                  >
                    <p className="font-medium text-gray-900 text-sm">
                      {event.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {event.date} at {event.time}
                    </p>
                    <span className="inline-block mt-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">
                      {event.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TechDashboard;
