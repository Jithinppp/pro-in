import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { supabase, fetchCategories } from "../../lib/supabase";

function AddModel() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchCategories();
      if (result.success) {
        setCategories(result.categories);
      }
    };
    fetchData();
  }, []);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setError("");

    const { error: insertError } = await supabase.from("models").insert([
      {
        category_id: parseInt(data.category_id),
        name: data.name,
        brand: data.brand,
        brand_code: data.brand_code,
        description: data.description || null,
        model_number: data.model_number || null,
      },
    ]);

    if (insertError) {
      setError(insertError.message);
      setIsSubmitting(false);
    } else {
      setSuccess(true);
      setTimeout(() => {
        navigate(-1);
      }, 1000);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="bg-white rounded-lg border border-gray-200 max-w-full">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">Add New Model</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              {...register("category_id", { required: "Category is required" })}
              className={`w-full px-3 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${errors.category_id ? "border-red-500" : "border-gray-200"}`}
            >
              <option value="">Select Category</option>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Brand <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("brand", {
                required: "Brand is required",
                maxLength: { value: 50, message: "Brand must be less than 50 characters" }
              })}
              className={`w-full px-3 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${errors.brand ? "border-red-500" : "border-gray-200"}`}
              placeholder="e.g., BOSCH"
            />
            {errors.brand && (
              <p className="text-red-500 text-xs mt-1">
                {errors.brand.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Model Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("name", {
                required: "Model name is required",
                maxLength: { value: 100, message: "Model name must be less than 100 characters" }
              })}
              className={`w-full px-3 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${errors.name ? "border-red-500" : "border-gray-200"}`}
              placeholder="e.g., DCN CCU 2"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Brand Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("brand_code", {
                required: "Brand code is required",
                maxLength: { value: 10, message: "Brand code must be less than 10 characters" },
                pattern: {
                  value: /^[A-Za-z0-9]+$/,
                  message: "Only letters and numbers allowed"
                }
              })}
              className={`w-full px-3 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${errors.brand_code ? "border-red-500" : "border-gray-200"}`}
              placeholder="e.g., BSH"
            />
            {errors.brand_code && (
              <p className="text-red-500 text-xs mt-1">
                {errors.brand_code.message}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Used in asset code generation
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Model Number
            </label>
            <input
              type="text"
              {...register("model_number")}
              className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="e.g., MODEL-123"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              {...register("description")}
              rows={3}
              className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
              placeholder="Model description..."
            />
          </div>

          {/* Status Message - Above Buttons */}
          {(error || success) && (
            <div
              className={`p-3 rounded-lg ${success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
            >
              <p
                className={`text-sm ${success ? "text-green-700" : "text-red-700"}`}
              >
                {success ? "Model created successfully!" : error}
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddModel;
