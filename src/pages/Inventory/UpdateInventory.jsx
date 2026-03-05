import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCategories, fetchModelsByCategory, fetchAssetById, updateAsset } from "../../lib/supabase";

function UpdateInventory() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [models, setModels] = useState([]);
    const [formData, setFormData] = useState({
        category_id: "",
        models_id: "",
        serial_number: "",
        supplier_name: "",
        invoice_number: "",
        purchase_date: "",
        purchase_price: "",
        condition: "good",
        status: "available",
        description: "",
    });
    const [error, setError] = useState("");

    useEffect(() => {
        loadInitialData();
    }, [id]);

    const loadInitialData = async () => {
        // Load categories
        const catResult = await fetchCategories();
        if (catResult.success) {
            setCategories(catResult.categories);
        }

        // Load asset
        const assetResult = await fetchAssetById(id);
        if (assetResult.success && assetResult.asset) {
            const asset = assetResult.asset;
            setFormData({
                category_id: asset.models?.categories?.id || "",
                models_id: asset.models_id || "",
                serial_number: asset.serial_number || "",
                supplier_name: asset.supplier_name || "",
                invoice_number: asset.invoice_number || "",
                purchase_date: asset.purchase_date || "",
                purchase_price: asset.purchase_price || "",
                condition: asset.condition || "good",
                status: asset.status || "available",
                description: asset.description || "",
            });

            // Load models for the selected category
            if (asset.models?.categories?.id) {
                const modelResult = await fetchModelsByCategory(asset.models.categories.id);
                if (modelResult.success) {
                    setModels(modelResult.models);
                }
            }
        }

        setInitialLoading(false);
    };

    const handleCategoryChange = async (categoryId) => {
        setFormData({ ...formData, category_id: categoryId, models_id: "" });
        setModels([]);

        if (categoryId) {
            const result = await fetchModelsByCategory(categoryId);
            if (result.success) {
                setModels(result.models);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (!formData.category_id || !formData.models_id) {
            setError("Please select both category and model");
            setLoading(false);
            return;
        }

        const result = await updateAsset(id, formData);

        if (result.success) {
            navigate("/inv/equipments");
        } else {
            setError(result.error || "Failed to update asset");
        }

        setLoading(false);
    };

    if (initialLoading) {
        return (
            <div className="p-4 md:p-6 flex items-center justify-center min-h-[400px]">
                <p className="text-gray-500">Loading...</p>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6">
            <div className="bg-white rounded-lg border border-gray-200 max-w-4xl mx-auto">
                <div className="p-4 border-b border-gray-200">
                    <h1 className="text-xl font-semibold text-gray-900">Update Inventory Item</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Edit item details below
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    {/* Category Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.category_id}
                            onChange={(e) => handleCategoryChange(e.target.value)}
                            className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            required
                        >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name} ({cat.code})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Model Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Model <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.models_id}
                            onChange={(e) => setFormData({ ...formData, models_id: e.target.value })}
                            disabled={!formData.category_id}
                            className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            required
                        >
                            <option value="">Select Model</option>
                            {models.map((model) => (
                                <option key={model.id} value={model.id}>
                                    {model.brand} - {model.name} ({model.brand_code})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Serial Number */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Serial Number
                        </label>
                        <input
                            type="text"
                            value={formData.serial_number}
                            onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
                            className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            placeholder="Enter serial number"
                        />
                    </div>

                    {/* Supplier Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Supplier Name
                        </label>
                        <input
                            type="text"
                            value={formData.supplier_name}
                            onChange={(e) => setFormData({ ...formData, supplier_name: e.target.value })}
                            className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            placeholder="Enter supplier name"
                        />
                    </div>

                    {/* Invoice Number */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Invoice Number
                        </label>
                        <input
                            type="text"
                            value={formData.invoice_number}
                            onChange={(e) => setFormData({ ...formData, invoice_number: e.target.value })}
                            className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            placeholder="Enter invoice number"
                        />
                    </div>

                    {/* Purchase Date & Purchase Price - Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Purchase Date
                            </label>
                            <input
                                type="date"
                                value={formData.purchase_date}
                                onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
                                className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Purchase Price
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.purchase_price}
                                onChange={(e) => setFormData({ ...formData, purchase_price: e.target.value })}
                                className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                placeholder="Enter purchase price"
                            />
                        </div>
                    </div>

                    {/* Condition */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Condition
                        </label>
                        <select
                            value={formData.condition}
                            onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                            className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        >
                            <option value="good">Good</option>
                            <option value="damaged">Damaged</option>
                            <option value="under_repair">Under Repair</option>
                        </select>
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Status
                        </label>
                        <select
                            value={formData.status}
                            disabled
                            className="w-full px-3 py-2.5 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:cursor-not-allowed"
                        >
                            <option value="available">Available</option>
                            <option value="assigned">Assigned</option>
                        </select>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                            placeholder="Additional description..."
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate("/inv/equipments")}
                            className="flex-1 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50"
                        >
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UpdateInventory;
