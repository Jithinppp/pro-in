import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";
import {
  fetchTotalEquipmentCount,
  fetchAvailableEquipmentCount,
  fetchInUseEquipmentCount,
  fetchMaintenanceEquipmentCount,
  fetchRecentInventoryItems,
} from "../../utils/supabase";

function InventoryDashboard() {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [stats, setStats] = useState([
    { label: "Total Equipment", value: 0, icon: "🔧", color: "bg-blue-50 text-blue-600" },
    { label: "Available", value: 0, icon: "✅", color: "bg-green-50 text-green-600" },
    { label: "In Use", value: 0, icon: "📦", color: "bg-amber-50 text-amber-600" },
    { label: "Maintenance", value: 0, icon: "⚙️", color: "bg-red-50 text-red-600" },
  ]);

  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching inventory data...");
        const [total, available, inUse, maintenance, recent] = await Promise.all([
          fetchTotalEquipmentCount(),
          fetchAvailableEquipmentCount(),
          fetchInUseEquipmentCount(),
          fetchMaintenanceEquipmentCount(),
          fetchRecentInventoryItems(3),
        ]);

        console.log("Data fetched:", { total, available, inUse, maintenance, recent });

        setStats([
          { label: "Total Equipment", value: total, icon: "🔧", color: "bg-blue-50 text-blue-600" },
          { label: "Available", value: available, icon: "✅", color: "bg-green-50 text-green-600" },
          { label: "In Use", value: inUse, icon: "📦", color: "bg-amber-50 text-amber-600" },
          { label: "Maintenance", value: maintenance, icon: "⚙️", color: "bg-red-50 text-red-600" },
        ]);

        // Transform recent items to match the expected format
        const transformedRecent = recent.map((item) => ({
          id: item.id,
          name: item.product ? `${item.product.brand} ${item.product.model}` : "Unknown",
          category: item.product?.category?.name || "Unknown",
          status: item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1).replace(/_/g, " ") : "Unknown",
          location: "Warehouse",
        }));

        setRecentItems(transformedRecent);
        setError(null);
      } catch (err) {
        console.error("Error fetching inventory data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const logoutHandler = async () => {
    await logout();
    navigate("/", { replace: true });
  };

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
      path: "/inventory/equipments",
      color: "bg-gray-100 hover:bg-gray-200 text-gray-700",
    },
    {
      label: "Edit Equipment",
      icon: "✏️",
      path: "/inventory/edit",
      color: "bg-gray-100 hover:bg-gray-200 text-gray-700",
    },
  ];

  const formatStatus = (status) => {
    if (!status) return "Unknown";
    return status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, " ");
  };

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
        {/* Error Display */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            Error loading data: {error}
          </div>
        )}

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
                    {loading ? "..." : stat.value}
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
                  onClick={() => navigate("/inventory/equipments")}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View all
                </button>
              </div>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-gray-400">Loading...</div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-red-400 text-sm">Failed to load data</div>
                </div>
              ) : recentItems.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-gray-400 text-sm">No items found</div>
                </div>
              ) : (
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
                        className={`px-2 py-0.5 text-xs rounded-full ${item.status === "Available"
                          ? "bg-green-100 text-green-700"
                          : item.status === "In Use"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-red-100 text-red-700"
                          }`}
                      >
                        {formatStatus(item.status)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InventoryDashboard;
