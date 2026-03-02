import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { supabase } from "../../lib/supabase";

function AddCategory() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setError("");

    const { error: insertError } = await supabase.from("categories").insert([
      {
        name: data.name,
        code: data.code,
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
          <h1 className="text-xl font-semibold text-gray-900">
            Add New Category
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="e.g., Control Unit"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("code", { required: "Code is required" })}
              className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="e.g., CCU"
            />
            {errors.code && (
              <p className="text-red-500 text-xs mt-1">{errors.code.message}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Used in asset code generation
            </p>
          </div>

          {/* Status Message - Above Buttons */}
          {(error || success) && (
            <div
              className={`p-3 rounded-lg ${success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
            >
              <p
                className={`text-sm ${success ? "text-green-700" : "text-red-700"}`}
              >
                {success ? "Category created successfully!" : error}
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

export default AddCategory;
