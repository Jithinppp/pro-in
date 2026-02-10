import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";

function InventoryDashboard() {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const logoutHandler = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  const stats = [
    {
      label: "Total Equipment",
      value: "156",
      icon: "🔧",
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Available",
      value: "124",
      icon: "✅",
      color: "bg-green-50 text-green-600",
    },
    {
      label: "In Use",
      value: "28",
      icon: "📦",
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Maintenance",
      value: "4",
      icon: "⚙️",
      color: "bg-red-50 text-red-600",
    },
  ];

  const quickActions = [
    {
      label: "Add Equipment",
      icon: "+",
      path: "/inventory/add",
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      label: "View All",
      icon: "📋",
      path: "/inventory",
      color: "bg-gray-100 hover:bg-gray-200 text-gray-700",
    },
    {
      label: "Edit Equipment",
      icon: "✏️",
      path: "/inventory/edit",
      color: "bg-gray-100 hover:bg-gray-200 text-gray-700",
    },
  ];

  const recentItems = [
    {
      id: 1,
      name: 'MacBook Pro 16"',
      category: "Laptop",
      status: "Available",
      location: "Tech Room A",
    },
    {
      id: 2,
      name: "Sony Camera X",
      category: "Camera",
      status: "In Use",
      location: "Event Hall",
    },
    {
      id: 3,
      name: "Wireless Mic",
      category: "Audio",
      status: "Available",
      location: "Tech Room B",
    },
    {
      id: 4,
      name: "Projector 4K",
      category: "Display",
      status: "Maintenance",
      location: "Repair Shop",
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
              {currentUser?.user?.email?.split("@")[0] || "Inventory Manager"}
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              Manage your equipment inventory.
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
              <div className="grid grid-cols-3 gap-3">
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

          {/* Recent Activity */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Recent Items
                </h2>
                <button
                  onClick={() => navigate("/inventory")}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View all
                </button>
              </div>
              <div className="space-y-3">
                {recentItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-150 cursor-pointer"
                  >
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {item.category} • {item.location}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full ${
                        item.status === "Available"
                          ? "bg-green-100 text-green-700"
                          : item.status === "In Use"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.status}
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

export default InventoryDashboard;
