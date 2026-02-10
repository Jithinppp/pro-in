import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";
import { fetchProductById } from "../../utils/supabase";

function Equipment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loading: authLoading } = useContext(AuthContext);
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        setLoading(true);
        const data = await fetchProductById(id);
        setEquipment(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEquipment();
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

  const availableCount = equipment.items?.filter(
    (item) => item.status === "available",
  ).length;
  const totalCount = equipment.items?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-8 py-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Equipment Details
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              View equipment information.
            </p>
          </div>
          <button
            onClick={() => navigate("/project-manager/equipments")}
            className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-150"
          >
            ← Back to Equipment List
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-6">
        {/* Equipment Details Card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {equipment.brand}
              </h2>
              <p className="text-lg text-gray-500 mt-1">{equipment.model}</p>
              <p className="text-sm text-gray-400 mt-2">
                Category: {equipment.category?.name}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Product ID</p>
              <p className="font-mono text-lg text-gray-700">{equipment.id}</p>
            </div>
          </div>

          {/* Inventory Stats */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h3 className="text-sm font-medium text-gray-700 mb-4">
              Inventory Status
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-green-600 font-medium">Available</p>
                <p className="text-3xl font-bold text-green-700 mt-1">
                  {availableCount}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 font-medium">Total Items</p>
                <p className="text-3xl font-bold text-gray-700 mt-1">
                  {totalCount}
                </p>
              </div>
            </div>
          </div>

          {/* Items List */}
          {equipment.items && equipment.items.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h3 className="text-sm font-medium text-gray-700 mb-4">
                Individual Items
              </h3>
              <div className="space-y-2">
                {equipment.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-mono text-sm text-gray-700">
                        ID: {item.id}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        item.status === "available"
                          ? "bg-green-100 text-green-700"
                          : item.status === "in-use"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Equipment;
