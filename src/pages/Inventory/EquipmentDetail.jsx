import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchAssetById, deleteAsset } from "../../lib/supabase";
import { format } from "date-fns";

function EquipmentDetail() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [asset, setAsset] = useState(null);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      setLoading(true);
      const result = await fetchAssetById(id);
      if (isMounted) {
        if (result.success) {
          setAsset(result.asset);
        } else {
          setError(result.error);
        }
        setLoading(false);
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleDelete = async () => {
    const result = await deleteAsset(id);
    if (result.success) {
      window.location.href = "/inv/equipments";
    } else {
      setError(result.error);
    }
    setDeleteConfirm(false);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading equipment details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">Error: {error}</p>
          <Link
            to="/inv/equipments"
            className="text-blue-600 hover:underline mt-2 inline-block"
          >
            Back to Equipment List
          </Link>
        </div>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="p-6">
        <div className="text-gray-500">Equipment not found</div>
        <Link
          to="/inv/equipments"
          className="text-blue-600 hover:underline mt-2 inline-block"
        >
          Back to Equipment List
        </Link>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return "-";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      USD: "USD",
    }).format(amount);
  };

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <Link
            to="/inv/equipments"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {asset.asset_code}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {asset.models?.name || "Unknown Model"} -{" "}
              {asset.models?.brand || "Unknown Brand"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            to={`/inv/update-inventory/${asset.id}`}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit
          </Link>
          <button
            onClick={() => setDeleteConfirm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors text-sm"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Equipment Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Equipment Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Asset Code</p>
                <p className="font-medium text-gray-900">{asset.asset_code}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Serial Number</p>
                <p className="font-medium text-gray-900">
                  {asset.serial_number || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-medium text-gray-900">
                  {asset.models?.categories?.name || "-"} (
                  {asset.models?.categories?.code || "-"})
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Model</p>
                <p className="font-medium text-gray-900">
                  {asset.models?.name || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Brand</p>
                <p className="font-medium text-gray-900">
                  {asset.models?.brand || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Brand Code</p>
                <p className="font-medium text-gray-900">
                  {asset.models?.brand_code || "-"}
                </p>
              </div>
            </div>
          </div>

          {/* Purchase Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Purchase Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Supplier</p>
                <p className="font-medium text-gray-900">
                  {asset.supplier_name || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Invoice Number</p>
                <p className="font-medium text-gray-900">
                  {asset.invoice_number || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Purchase Date</p>
                <p className="font-medium text-gray-900">
                  {formatDate(asset.purchase_date)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Purchase Price</p>
                <p className="font-medium text-gray-900">
                  {formatCurrency(asset.purchase_price)}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          {asset.description && (
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Description
              </h2>
              <p className="text-gray-700 whitespace-pre-wrap">
                {asset.description}
              </p>
            </div>
          )}
        </div>

        {/* Right Column - Meta Information */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Status</h2>
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  asset.status === "available"
                    ? "bg-green-50 text-green-700"
                    : asset.status === "assigned"
                      ? "bg-blue-50 text-blue-700"
                      : asset.status === "maintenance"
                        ? "bg-yellow-50 text-yellow-700"
                        : "bg-gray-50 text-gray-700"
                }`}
              >
                {asset.status || "available"}
              </span>
            </div>
          </div>

          {/* Timestamps */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              History
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Created</p>
                <p className="text-sm text-gray-900">
                  {formatDate(asset.created_at)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="text-sm text-gray-900">
                  {formatDate(asset.updated_at)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Confirm Delete
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this equipment? This action cannot
              be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EquipmentDetail;
