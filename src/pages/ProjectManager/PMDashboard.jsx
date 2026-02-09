import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";

function PMDashboard() {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const logoutHandler = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  const stats = [
    {
      label: "Total Events",
      value: "12",
      icon: "📅",
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Active Projects",
      value: "5",
      icon: "🚀",
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Pending Tasks",
      value: "8",
      icon: "✅",
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Equipment Available",
      value: "24",
      icon: "🔧",
      color: "bg-purple-50 text-purple-600",
    },
  ];

  const quickActions = [
    {
      label: "Create Event",
      icon: "+",
      path: "/project-manager/create",
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      label: "View Events",
      icon: "📅",
      path: "/project-manager/events",
      color: "bg-gray-100 hover:bg-gray-200 text-gray-700",
    },
    {
      label: "Equipment List",
      icon: "🔧",
      path: "/project-manager/equipments",
      color: "bg-gray-100 hover:bg-gray-200 text-gray-700",
    },
    {
      label: "Reports",
      icon: "📊",
      path: "/project-manager/reports",
      color: "bg-gray-100 hover:bg-gray-200 text-gray-700",
    },
  ];

  const recentEvents = [
    {
      id: 1,
      name: "Tech Conference 2024",
      date: "Mar 15, 2024",
      status: "Active",
      attendees: 150,
    },
    {
      id: 2,
      name: "Product Launch",
      date: "Mar 20, 2024",
      status: "Planning",
      attendees: 80,
    },
    {
      id: 3,
      name: "Team Building",
      date: "Mar 25, 2024",
      status: "Confirmed",
      attendees: 45,
    },
  ];

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
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl ${stat.color}`}
                >
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => navigate(action.path)}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-200 ${action.color}`}
                  >
                    <span className="text-2xl mb-2">{action.icon}</span>
                    <span className="text-sm font-medium">{action.label}</span>
                  </button>
                ))}
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
              <div className="space-y-4">
                {recentEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-150 cursor-pointer"
                  >
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {event.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{event.date}</p>
                      <span
                        className={`inline-block mt-2 px-2 py-0.5 text-xs rounded-full ${
                          event.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : event.status === "Planning"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {event.status}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {event.attendees} attendees
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

export default PMDashboard;
