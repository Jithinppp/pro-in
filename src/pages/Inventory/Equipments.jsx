import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { searchEquipments, fetchCategories } from "../../utils/supabase";

function Equipments() {
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");

    // Load categories
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const cats = await fetchCategories();
                setCategories(cats);
            } catch (err) {
                console.error("Error loading categories:", err);
            }
        };
        loadCategories();
    }, []);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            performSearch();
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm, selectedCategory]);

    const performSearch = async () => {
        setLoading(true);
        setError(null);

        try {
            if (!searchTerm.trim() && !selectedCategory) {
                setResults([]);
                return;
            }

            // Search by term
            const data = await searchEquipments(searchTerm);
            setResults(data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const statusColors = {
        available: "bg-green-100 text-green-700",
        in_use: "bg-amber-100 text-amber-700",
        maintenance: "bg-red-100 text-red-700",
    };

    const formatStatus = (status) => {
        if (!status) return "Unknown";
        return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 px-8 py-6">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">
                            All Equipment
                        </h1>
                        <p className="text-gray-500 mt-1 text-sm">
                            Browse and search all equipment inventory
                        </p>
                    </div>
                    <button
                        onClick={() => navigate("/inventory")}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-150"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back
                    </button>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-8 py-6">
                {/* Search and Filters */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search Input */}
                        <div className="flex-1 relative">
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

                        {/* Filter Toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`px-4 py-3 border rounded-lg transition-colors flex items-center gap-2 ${showFilters || selectedCategory
                                ? "bg-blue-50 border-blue-200 text-blue-700"
                                : "border-gray-200 text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                                />
                            </svg>
                            Filters
                            {selectedCategory && (
                                <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                                    1
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Filter Options */}
                    {showFilters && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category
                            </label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full md:w-64 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">All Categories</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            {selectedCategory && (
                                <button
                                    onClick={() => setSelectedCategory("")}
                                    className="ml-2 text-sm text-blue-600 hover:text-blue-700"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Results */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : results.length > 0 ? (
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Product
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Category
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Quantity
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {results.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {product.brand} {product.model}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {product.category?.name}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {product.category?.name || "—"}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                                    {product.quantity} units
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {product.quantity > 0 ? (
                                                    <span
                                                        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors.available
                                                            }`}
                                                    >
                                                        Available
                                                    </span>
                                                ) : (
                                                    <span
                                                        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors.maintenance
                                                            }`}
                                                    >
                                                        Out of Stock
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() =>
                                                        navigate(`/inventory/equipment/${product.id}`)
                                                    }
                                                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : searchTerm.trim() || selectedCategory ? (
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
                                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No results found
                        </h3>
                        <p className="text-gray-500">
                            No equipment found for "{searchTerm}"
                        </p>
                    </div>
                ) : (
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
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Start searching
                        </h3>
                        <p className="text-gray-500">
                            Search by brand, model, or category to find equipment
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Equipments;
