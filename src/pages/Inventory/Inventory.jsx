import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchAssets, fetchInventoryStats } from "../../lib/supabase";

function Inventory() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
    });
    const [recentItems, setRecentItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);

        // Load stats
        const statsResult = await fetchInventoryStats();
        if (statsResult.success) {
            setStats(statsResult.stats);
        }

        // Load recent assets
        const assetsResult = await fetchAssets(1, 5, "");
        if (assetsResult.success) {
            setRecentItems(assetsResult.assets);
        }

        setLoading(false);
    };

    const handleSearch = async (query) => {
        setSearchQuery(query);
        setLoading(true);

        const assetsResult = await fetchAssets(1, 5, query);
        if (assetsResult.success) {
            setRecentItems(assetsResult.assets);
        }

        setLoading(false);
    };

    return (
        <div className="p-4 md:p-6">
            {/* Quick Stats - Top */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs md:text-sm text-gray-500">Total Items</p>
                            <p className="text-xl md:text-2xl font-semibold text-gray-900">{stats.total}</p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 md:gap-3 mb-6">
                <Link to="add-inventory">
                    <button className="flex items-center gap-2 px-3 md:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="font-medium">Add Item</span>
                    </button>
                </Link>

                <Link to="equipments">
                    <button className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                        <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        <span className="font-medium text-gray-700">View All Equipment</span>
                    </button>
                </Link>

                <button className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                    <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="font-medium text-gray-700">Reports</span>
                </button>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative">
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search by asset code, serial number, or invoice..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                </div>
            </div>

            {/* Recent Inventory List */}
            <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Inventory</h2>
                </div>

                <div className="p-4">
                    {loading ? (
                        <p className="text-gray-500 text-center py-4">Loading inventory...</p>
                    ) : recentItems.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No items found</p>
                    ) : (
                        <div className="space-y-3">
                            {recentItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between p-3 md:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                                >
                                    <div className="flex items-center gap-3 md:gap-4 min-w-0">
                                        <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                                            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                            </svg>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm md:text-base font-semibold text-gray-900 truncate">
                                                {item.asset_code}
                                            </p>
                                            <p className="text-xs md:text-sm text-gray-500 truncate">
                                                {item.models?.name || "Unknown Model"} • {item.models?.brand || ""} • {item.serial_number || "No S/N"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <span className="text-xs text-gray-500">
                                            {item.supplier_name || "-"}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* See More Button */}
                <div className="border-t border-gray-200 p-4">
                    <Link to="equipments">
                        <button className="w-full py-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
                            View All Inventory →
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Inventory;
