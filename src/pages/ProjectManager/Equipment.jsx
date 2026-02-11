import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";
import { fetchProductById, fetchProductItemsWithEvents } from "../../utils/supabase";

function Equipment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loading: authLoading } = useContext(AuthContext);
  const [equipment, setEquipment] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productData, itemsData] = await Promise.all([
          fetchProductById(id),
          fetchProductItemsWithEvents(id),
        ]);
        setEquipment(productData);
        setItems(itemsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!equipment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Equipment not found</div>
      </div>
    );
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Group items by status
  const availableItems = items.filter(item => item.status === "available");
  const inUseItems = items.filter(item => item.status === "in_use");
  const maintenanceItems = items.filter(item => item.status === "maintenance");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-8 py-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {equipment.brand} {equipment.model}
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              Category: {equipment.category?.name}
            </p>
          </div>
          <button
            onClick={() => navigate("/project-manager/equipments")}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-150"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-6">
        {/* Status Summary Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-green-50 rounded-xl border border-green-100 p-4">
            <p className="text-sm text-green-600 font-medium">Available</p>
            <p className="text-3xl font-bold text-green-700 mt-1">{availableItems.length}</p>
          </div>
          <div className="bg-blue-50 rounded-xl border border-blue-100 p-4">
            <p className="text-sm text-blue-600 font-medium">In Use</p>
            <p className="text-3xl font-bold text-blue-700 mt-1">{inUseItems.length}</p>
          </div>
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-600 font-medium">Maintenance</p>
            <p className="text-3xl font-bold text-gray-700 mt-1">{maintenanceItems.length}</p>
          </div>
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-600 font-medium">Total</p>
            <p className="text-3xl font-bold text-gray-700 mt-1">{items.length}</p>
          </div>
        </div>

        {/* Items List */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            All Items ({items.length})
          </h2>

          {items.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>No items for this product yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500 border-b border-gray-100">
                    <th className="pb-3 font-medium">Item ID</th>
                    <th className="pb-3 font-medium">Asset Code</th>
                    <th className="pb-3 font-medium">Serial Number</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Assigned Event</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="py-3 text-gray-700">{item.id}</td>
                      <td className="py-3 font-mono text-sm text-gray-700">
                        {item.asset_code || "—"}
                      </td>
                      <td className="py-3 font-mono text-sm text-gray-700">
                        {item.serial_number || "—"}
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${item.status === "available"
                            ? "bg-green-100 text-green-700"
                            : item.status === "in_use"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                            }`}
                        >
                          {item.status?.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-3">
                        {item.event_assignment?.event ? (
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {item.event_assignment.event.event_name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDate(item.event_assignment.event.event_start_date)}
                              {item.event_assignment.event.event_end_date &&
                                item.event_assignment.event.event_end_date !== item.event_assignment.event.event_start_date &&
                                ` — ${formatDate(item.event_assignment.event.event_end_date)}`}
                            </p>
                            <p className="text-xs text-gray-500">
                              {item.event_assignment.event.venue}
                            </p>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Equipment;
