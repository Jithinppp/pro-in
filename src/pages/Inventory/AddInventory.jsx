import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import {
  fetchCategories,
  fetchModelsByCategory,
  createAsset,
  getAssetSequence,
} from "../../lib/supabase";
import "react-day-picker/style.css";

function AddInventory() {
  const navigate = useNavigate();
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [models, setModels] = useState([]);
  const [previewCode, setPreviewCode] = useState("");
  const [showPurchaseDatePicker, setShowPurchaseDatePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      category_id: "",
      models_id: "",
      serial_number: "",
      supplier_name: "",
      invoice_number: "",
      purchase_date: null,
      purchase_price: "",
      condition: "good",
      status: "available",
      description: "",
    },
  });

  const selectedCategoryId = watch("category_id");
  const purchaseDate = watch("purchase_date");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setCategoriesLoading(true);
    console.log("=== FETCHING FROM: categories table ===");
    const result = await fetchCategories();
    console.log("categories table result:", result);
    if (result.success) {
      setCategories(result.categories);
    }
    setCategoriesLoading(false);
  };

  const handleCategoryChange = async (categoryId) => {
    const categoryIdNum = parseInt(categoryId);
    setValue("category_id", categoryId);
    setValue("models_id", "");
    setModels([]);
    setPreviewCode("");

    if (categoryId) {
      console.log("=== FETCHING FROM: models table ===");
      console.log("category_id:", categoryId);
      const result = await fetchModelsByCategory(categoryIdNum);
      console.log("models table result:", result);
      if (result.success) {
        setModels(result.models);
      }
      const selectedCategory = categories.find(
        (c) => c.id === categoryIdNum || c.id === categoryId,
      );
      if (selectedCategory) {
        setPreviewCode(`${selectedCategory.code}-XX-XX`);
      }
    }
  };

  const handleModelChange = async (modelId) => {
    setValue("models_id", modelId);

    if (modelId && selectedCategoryId) {
      const categoryIdNum = parseInt(selectedCategoryId);
      const modelIdNum = parseInt(modelId);
      const selectedCategory = categories.find(
        (c) => c.id === categoryIdNum || c.id === selectedCategoryId,
      );
      const selectedModel = models.find(
        (m) => m.id === modelIdNum || m.id === modelId,
      );

      if (selectedCategory && selectedModel) {
        console.log("=== FETCHING SEQUENCE FROM: assets table ===");
        console.log("category_code:", selectedCategory.code);
        console.log("brand_code:", selectedModel.brand_code);

        const seqResult = await getAssetSequence(
          selectedCategory.code,
          selectedModel.brand_code,
        );
        console.log("getAssetSequence result:", seqResult);

        const nextSequence = seqResult.sequence
          .toString()
          .padStart(4, "0");
        const fullCode = `${selectedCategory.code}-${selectedModel.brand_code}-${nextSequence}`;
        setPreviewCode(fullCode);
        console.log("Generated asset_code:", fullCode);
      }
    } else {
      setPreviewCode("");
    }
  };

  const onSubmit = async (data) => {
    console.log("=== CREATING NEW ASSET ===");
    console.log("Form data:", data);
    setIsSubmitting(true);
    setSubmitError("");

    // Additional validation check
    if (!data.category_id || data.category_id === "") {
      setSubmitError("Please select a category");
      setIsSubmitting(false);
      return;
    }

    if (!data.models_id || data.models_id === "") {
      setSubmitError("Please select a model");
      setIsSubmitting(false);
      return;
    }

    const assetData = {
      models_id: parseInt(data.models_id),
      serial_number: data.serial_number?.trim() || null,
      supplier_name: data.supplier_name?.trim() || null,
      invoice_number: data.invoice_number?.trim() || null,
      purchase_date: data.purchase_date
        ? format(data.purchase_date, "yyyy-MM-dd")
        : null,
      purchase_price: data.purchase_price ? parseFloat(data.purchase_price) : null,
      description: data.description?.trim() || null,
    };

    console.log("Asset data to create:", assetData);
    console.log("=== CALLING: createAsset (uses models table for category info, then assets table for insert) ===");

    const result = await createAsset(assetData);
    console.log("createAsset result:", result);

    if (result.success) {
      navigate("/inv/equipments");
    } else {
      setSubmitError(result.error || "Failed to create asset");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="p-4 md:p-6">
      <div className="bg-white rounded-lg border border-gray-200 max-w-full">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Add New Inventory Item
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Select category and model to auto-generate asset code
              </p>
            </div>
            <Link
              to="/inv/bulk-import"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
            >
              Import from CSV
            </Link>
          </div>
          {previewCode && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                <span className="font-medium">Next Asset Code:</span>{" "}
                {previewCode}
              </p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
          {/* Category Selection */}
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <Link
                to="/inv/add-category"
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                + Add New Category
              </Link>
            </div>
            <select
              {...register("category_id", { required: "Category is required" })}
              onChange={(e) => handleCategoryChange(e.target.value)}
              disabled={categoriesLoading}
              className={`w-full px-3 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:opacity-50 ${errors.category_id ? "border-red-500" : "border-gray-200"}`}
            >
              <option value="">
                {categoriesLoading ? "Loading..." : "Select Category"}
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} ({cat.code})
                </option>
              ))}
            </select>
            {errors.category_id && (
              <p className="text-red-500 text-xs mt-1">
                {errors.category_id.message}
              </p>
            )}
          </div>

          {/* Model Selection */}
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Model <span className="text-red-500">*</span>
              </label>
              <Link
                to="/inv/add-model"
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                + Add New Model
              </Link>
            </div>
            <select
              {...register("models_id", { required: "Model is required" })}
              onChange={(e) => handleModelChange(e.target.value)}
              disabled={!selectedCategoryId}
              className={`w-full px-3 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:opacity-50 disabled:cursor-not-allowed ${errors.models_id ? "border-red-500" : "border-gray-200"}`}
            >
              <option value="">Select Model</option>
              {models.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.brand} - {model.name} ({model.brand_code})
                </option>
              ))}
            </select>
            {errors.models_id && (
              <p className="text-red-500 text-xs mt-1">
                {errors.models_id.message}
              </p>
            )}
          </div>

          {/* Serial Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Serial Number
            </label>
            <input
              type="text"
              {...register("serial_number")}
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
              {...register("supplier_name")}
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
              {...register("invoice_number")}
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
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value={
                    purchaseDate ? format(purchaseDate, "MMM dd, yyyy") : ""
                  }
                  onClick={() =>
                    setShowPurchaseDatePicker(!showPurchaseDatePicker)
                  }
                  className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm cursor-pointer"
                  placeholder="Select purchase date"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPurchaseDatePicker(!showPurchaseDatePicker)
                  }
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </button>
              </div>
              {showPurchaseDatePicker && (
                <div className="absolute z-10 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2">
                  <DayPicker
                    mode="single"
                    selected={purchaseDate}
                    onSelect={(date) => {
                      setValue("purchase_date", date);
                      setShowPurchaseDatePicker(false);
                    }}
                    className="font-sans!"
                  />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Purchase Price
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                {...register("purchase_price", {
                  validate: (value) =>
                    !value || parseFloat(value) >= 0 || "Price must be positive",
                })}
                className={`w-full px-3 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${errors.purchase_price ? "border-red-500" : "border-gray-200"}`}
                placeholder="Enter purchase price"
              />
              {errors.purchase_price && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.purchase_price.message}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              {...register("description")}
              rows={3}
              className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
              placeholder="Additional description..."
            />
          </div>

          {/* Condition */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Condition
            </label>
            <select
              {...register("condition")}
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
              {...register("status")}
              disabled
              className="w-full px-3 py-2.5 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:cursor-not-allowed"
            >
              <option value="available">Available</option>
              <option value="assigned">Assigned</option>
            </select>
          </div>

          {/* Status Message */}
          {(isSubmitting || submitError) && (
            <div
              className={`p-3 rounded-lg border ${submitError ? "bg-red-50 border-red-200" : "bg-blue-50 border-blue-200"}`}
            >
              <p
                className={`text-sm text-center ${submitError ? "text-red-700" : "text-blue-700"}`}
              >
                {isSubmitting ? "Creating inventory item..." : submitError}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate("/inv")}
              className="flex-1 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddInventory;
