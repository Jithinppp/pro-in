import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";
import { useEquipment } from "../../contexts/EquipmentContext";
import Card from "../../components/Card";

function EquipmentList() {
  const { loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const { searchTerm, setSearchTerm, results, loading, search } =
    useEquipment();

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      search(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, search]);

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
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Equipment List
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              Browse and search for equipment.
            </p>
          </div>
          <button
            onClick={() => navigate("/project-manager")}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-150"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-6 space-y-4">
        {/* Navigation */}
        <div className="flex gap-2 flex-wrap items-center">
          <button
            onClick={() => navigate("/project-manager/events")}
            className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-150"
          >
            Events
          </button>
          <button
            onClick={() => navigate("/project-manager/reports")}
            className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-150"
          >
            Reports
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
              placeholder="Search by brand, model, or category..."
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
                  <Card
                    key={item.id}
                    item={item}
                    basePath="/project-manager/equipment"
                  />
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

export default EquipmentList;
