import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCategories, fetchProductsByCategory, generateAssetCode, createProduct, createItem } from "../../utils/supabase";

function AddEquipment() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // Product details
    brand: "",
    brand_code: "",
    model: "",
    category_id: "",
    product_id: "",
    description: "",
    // Item details
    serial_number: "",
    status: "available",
    location: "warehouse",
    // Additional item info
    supplier_name: "",
    weight: "",
    invoice_number: "",
    tag_number: "",
    purchase_date: "",
    purchase_price: "",
    notes: "",
  });

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showNewProductForm, setShowNewProductForm] = useState(false);
  const [assetCodePreview, setAssetCodePreview] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const locations = [
    { value: "warehouse", label: "Warehouse" },
    { value: "office", label: "Office" },
  ];

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await fetchCategories();
        setCategories(cats);
      } catch (err) {
        console.error("Error loading categories:", err);
        setError("Failed to load categories");
      }
    };
    loadCategories();
  }, []);

  // Fetch products when category changes
  useEffect(() => {
    const loadProducts = async () => {
      if (formData.category_id) {
        try {
          const prods = await fetchProductsByCategory(parseInt(formData.category_id));
          setProducts(prods);

          // Find selected category for asset code preview
          const cat = categories.find(c => c.id === parseInt(formData.category_id));
          setSelectedCategory(cat || null);
        } catch (err) {
          console.error("Error loading products:", err);
          setError("Failed to load products");
        }
      } else {
        setProducts([]);
        setSelectedCategory(null);
        setAssetCodePreview(null);
      }
    };
    loadProducts();
  }, [formData.category_id, categories]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle category change
    if (name === "category_id") {
      setFormData((prev) => ({
        ...prev,
        category_id: value,
        product_id: "", // Reset product selection
      }));
      setShowNewProductForm(false);
      setAssetCodePreview(null);
      return;
    }

    // Handle product selection
    if (name === "product_id") {
      if (value === "new") {
        setShowNewProductForm(true);
        setAssetCodePreview(null);
        // Clear product fields for new product
        setFormData((prev) => ({
          ...prev,
          product_id: "",
          brand: "",
          brand_code: "",
          model: "",
          description: "",
        }));
      } else {
        setShowNewProductForm(false);
        // Set product details from selected product
        const selectedProd = products.find(p => p.id === parseInt(value));
        if (selectedProd) {
          setFormData((prev) => ({
            ...prev,
            product_id: value,
            brand: selectedProd.brand,
            brand_code: selectedProd.brand_code,
            model: selectedProd.model,
          }));
          // Generate asset code preview
          generatePreview(value);
        }
      }
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const generatePreview = async (productId) => {
    try {
      const code = await generateAssetCode(parseInt(productId));
      setAssetCodePreview(code);
    } catch (err) {
      console.error("Error generating asset code preview:", err);
      setAssetCodePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      let productId = formData.product_id;

      // If creating a new product, create it first
      if (showNewProductForm || !productId) {
        const product = await createProduct({
          brand: formData.brand,
          brand_code: formData.brand_code.toUpperCase(),
          model: formData.model,
          category_id: parseInt(formData.category_id) || null,
          description: formData.description || null,
        });
        productId = product.id;
      }

      // Generate asset code based on the created/selected product
      const assetCode = await generateAssetCode(productId);

      // Then create the item with the generated asset code
      await createItem({
        product_id: productId,
        asset_code: assetCode,
        serial_number: formData.serial_number || null,
        status: formData.status,
        location: formData.location,
        supplier_name: formData.supplier_name || null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        invoice_number: formData.invoice_number || null,
        tag_number: formData.tag_number || null,
        purchase_date: formData.purchase_date || null,
        purchase_price: formData.purchase_price ? parseFloat(formData.purchase_price) : null,
        notes: formData.notes || null,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate("/inventory");
      }, 2000);
    } catch (err) {
      console.error("Error creating equipment:", err);
      setError(err.message || "Failed to create equipment");
    } finally {
      setSubmitting(false);
    }
  };

  // Generate preview for new product form
  const generateNewProductPreview = () => {
    if (formData.brand_code && formData.category_id && selectedCategory?.code) {
      const prefix = `${selectedCategory.code}-${formData.brand_code.toUpperCase()}-`;
      setAssetCodePreview(`${prefix}XXX`);
    }
  };

  // Update formData when new product fields change
  const handleNewProductChange = (e) => {
    handleChange(e);
    // Generate preview after a short delay for new product
    setTimeout(generateNewProductPreview, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/inventory")}
            className="text-blue-600 hover:text-blue-700 mb-4 flex items-center gap-2"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">Add New Equipment</h1>
          <p className="text-gray-500 mt-1">Enter all the details for the new equipment</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            Equipment added successfully! Redirecting to dashboard...
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Information */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Information</h2>

            {/* Category Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} {cat.code ? `(${cat.code})` : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Product Selection */}
            {formData.category_id && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product *
                </label>
                <select
                  name="product_id"
                  value={formData.product_id}
                  onChange={handleChange}
                  required={!showNewProductForm}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a product</option>
                  {products.map((prod) => (
                    <option key={prod.id} value={prod.id}>
                      {prod.brand} {prod.model} ({prod.brand_code})
                    </option>
                  ))}
                  <option value="new">+ Add new product</option>
                </select>
              </div>
            )}

            {/* New Product Form */}
            {showNewProductForm && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">New Product Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Brand *
                    </label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleNewProductChange}
                      required
                      placeholder="e.g., Sony, Apple, Dell"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Brand Code *
                    </label>
                    <input
                      type="text"
                      name="brand_code"
                      value={formData.brand_code}
                      onChange={handleNewProductChange}
                      required
                      maxLength={3}
                      placeholder="e.g., BSH, SNH"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Model *
                    </label>
                    <input
                      type="text"
                      name="model"
                      value={formData.model}
                      onChange={handleNewProductChange}
                      required
                      placeholder="e.g., MacBook Pro, Xperia 1"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleNewProductChange}
                      rows={2}
                      placeholder="Additional product details..."
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Asset Code Preview */}
            {assetCodePreview && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700">Asset Code Preview</p>
                    <p className="text-xs text-blue-500 mt-1">This code will be assigned to the equipment</p>
                  </div>
                  <div className="text-2xl font-mono font-bold text-blue-700">
                    {assetCodePreview}
                  </div>
                </div>
              </div>
            )}

            {/* Selected Product Display (when not creating new) */}
            {!showNewProductForm && formData.product_id && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Brand</p>
                    <p className="font-medium text-gray-900">{formData.brand}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Model</p>
                    <p className="font-medium text-gray-900">{formData.model}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Brand Code</p>
                    <p className="font-medium text-gray-900">{formData.brand_code}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Item Details */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Item Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Serial Number
                </label>
                <input
                  type="text"
                  name="serial_number"
                  value={formData.serial_number}
                  onChange={handleChange}
                  placeholder="e.g., SN123456789"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tag Number
                </label>
                <input
                  type="text"
                  name="tag_number"
                  value={formData.tag_number}
                  onChange={handleChange}
                  placeholder="e.g., TAG-001"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="available">Available</option>
                  <option value="in_use">In Use</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {locations.map((loc) => (
                    <option key={loc.value} value={loc.value}>
                      {loc.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Supplier Name
                </label>
                <input
                  type="text"
                  name="supplier_name"
                  value={formData.supplier_name}
                  onChange={handleChange}
                  placeholder="e.g., Tech Supplies Inc."
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Invoice/Quote Number
                </label>
                <input
                  type="text"
                  name="invoice_number"
                  value={formData.invoice_number}
                  onChange={handleChange}
                  placeholder="e.g., INV-2024-001"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Purchase Date
                </label>
                <input
                  type="date"
                  name="purchase_date"
                  value={formData.purchase_date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Purchase Price
                </label>
                <input
                  type="number"
                  name="purchase_price"
                  value={formData.purchase_price}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Additional notes or comments..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/inventory")}
              className="px-6 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Adding..." : "Add Equipment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddEquipment;
