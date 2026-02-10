import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchItemById } from "../../utils/supabase";

function SearchEquipment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      const loadItem = async () => {
        try {
          setLoading(true);
          const data = await fetchItemById(id);
          setItem(data);
        } catch (err) {
          setError(err.message || "Failed to load equipment");
        } finally {
          setLoading(false);
        }
      };
      loadItem();
    } else {
      setLoading(false);
    }
  }, [id]);

  const statusColors = {
    available: "bg-green-100 text-green-700",
    assigned: "bg-blue-100 text-blue-700",
    maintenance: "bg-yellow-100 text-yellow-700",
    damaged: "bg-red-100 text-red-700",
  };

  if (id) {
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
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => navigate("/tech")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      );
    }

    if (!item) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Equipment not found</p>
            <button
              onClick={() => navigate("/tech")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      );
    }

    const product = item.product;

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-100 px-8 py-6">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {product?.brand} {product?.model}
              </h1>
              <p className="text-gray-500 mt-1 text-sm">Equipment Details</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/tech")}
                className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-150"
              >
                ← Back
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-8 py-8">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 space-y-6">
              <div className="border-b border-gray-100 pb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-gray-400 text-sm">Product</span>
                </div>
                <p className="text-2xl font-semibold text-gray-900">
                  {product?.brand} {product?.model}
                </p>
                {product?.category && (
                  <p className="text-gray-500 mt-1">
                    Category: {product.category.name}
                  </p>
                )}
              </div>

              <div className="border-b border-gray-100 pb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-gray-400 text-sm">Status</span>
                </div>
                <span
                  className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                    statusColors[item.status] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  {item.status
                    ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
                    : "—"}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-gray-400 text-sm">Item ID</span>
                </div>
                <p className="text-gray-700 font-mono text-sm">{item.id}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-8 py-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Search Equipment
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              Search for equipment from the dashboard.
            </p>
          </div>
          <button
            onClick={() => navigate("/tech")}
            className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-150"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-8 py-8">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
          <svg
            className="w-16 h-16 mx-auto text-gray-300 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <h2 className="text-lg font-medium text-gray-900 mb-2">
            Search from Dashboard
          </h2>
          <p className="text-gray-500 mb-4">
            Use the search bar on your dashboard to find equipment.
          </p>
          <button
            onClick={() => navigate("/tech")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchEquipment;
