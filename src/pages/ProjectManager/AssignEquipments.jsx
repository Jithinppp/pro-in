import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    fetchEventWithEquipment,
    fetchAvailableEquipment,
    fetchProductItemsWithEvents,
    assignEquipmentToEvent,
    removeEquipmentFromEvent,
} from "../../utils/supabase";

function AssignEquipments() {
    const { eventId } = useParams();
    const navigate = useNavigate();

    const [event, setEvent] = useState(null);
    const [availableItems, setAvailableItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [assigning, setAssigning] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [showAvailable, setShowAvailable] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        loadData();
    }, [eventId]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [eventData, availableData] = await Promise.all([
                fetchEventWithEquipment(eventId),
                fetchAvailableEquipment(),
            ]);
            setEvent(eventData);
            setAvailableItems(availableData);
        } catch (err) {
            setError(err.message || "Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
    };

    const handleAssign = async () => {
        if (selectedItems.length === 0) return;

        setAssigning(true);
        setError(null);

        try {
            for (const itemId of selectedItems) {
                await assignEquipmentToEvent(eventId, itemId);
            }
            setSelectedItems([]);
            setShowAvailable(false);
            await loadData();
        } catch (err) {
            setError(err.message || "Failed to assign equipment");
        } finally {
            setAssigning(false);
        }
    };

    const handleRemove = async (assignmentId, itemId) => {
        try {
            await removeEquipmentFromEvent(assignmentId, itemId);
            await loadData();
        } catch (err) {
            setError(err.message || "Failed to remove equipment");
        }
    };

    const toggleItemSelection = (itemId) => {
        setSelectedItems((prev) =>
            prev.includes(itemId)
                ? prev.filter((id) => id !== itemId)
                : [...prev, itemId]
        );
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "—";
        return new Date(dateStr).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error && !event) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={() => navigate("/project-manager/events")}
                        className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Events
                    </button>
                </div>
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
                            Assign Equipment
                        </h1>
                        <p className="text-gray-500 mt-1 text-sm">
                            {event?.event_name} • {formatDate(event?.event_start_date)}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowAvailable(!showAvailable)}
                            className={`flex items-center gap-1 px-4 py-2 rounded-lg transition-colors ${showAvailable
                                ? "bg-gray-100 text-gray-600"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                                }`}
                        >
                            {showAvailable ? "Hide Available" : "Add Equipment"}
                        </button>
                        <button
                            onClick={() => navigate("/project-manager/events")}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-150"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-8 py-6">
                {/* Error */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        {error}
                    </div>
                )}

                {/* Available Equipment Panel */}
                {showAvailable && (
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Available Equipment
                            </h2>
                            {selectedItems.length > 0 && (
                                <button
                                    onClick={handleAssign}
                                    disabled={assigning}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                                >
                                    {assigning
                                        ? "Assigning..."
                                        : `Assign ${selectedItems.length} Item${selectedItems.length > 1 ? "s" : ""}`}
                                </button>
                            )}
                        </div>

                        {/* Search Input */}
                        <div className="mb-4">
                            <div className="relative">
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
                                <input
                                    type="text"
                                    placeholder="Search by brand, model, category, asset code, or serial number..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {availableItems.length === 0 ? (
                            <div className="text-center py-8 text-gray-400">
                                <p>No available equipment</p>
                                <p className="text-sm mt-1">
                                    All equipment is currently assigned or in maintenance
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {availableItems.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => toggleItemSelection(item.id)}
                                        className={`p-4 rounded-lg border cursor-pointer transition-colors ${selectedItems.includes(item.id)
                                            ? "border-green-500 bg-green-50"
                                            : "border-gray-200 hover:border-gray-300 bg-gray-50"
                                            }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {item.product?.brand} {item.product?.model}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {item.product?.category?.name}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {item.asset_code}
                                                    {item.serial_number && ` • ${item.serial_number}`}
                                                </p>
                                            </div>
                                            {selectedItems.includes(item.id) && (
                                                <span className="text-green-600">
                                                    <svg
                                                        className="w-6 h-6"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M5 13l4 4L19 7"
                                                        />
                                                    </svg>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Assigned Equipment */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Assigned Equipment{" "}
                        {event?.assigned_items?.length > 0 && (
                            <span className="text-gray-400 font-normal">
                                ({event.assigned_items.length})
                            </span>
                        )}
                    </h2>

                    {event?.assigned_items?.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">
                            <svg
                                className="w-12 h-12 mx-auto mb-3 text-gray-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                />
                            </svg>
                            <p>No equipment assigned yet</p>
                            <p className="text-sm mt-1">
                                Click "Add Equipment" to assign equipment to this event
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {event?.assigned_items?.map((assignment) => (
                                <div
                                    key={assignment.id}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <svg
                                                className="w-5 h-5 text-blue-600"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {assignment.item?.product?.brand}{" "}
                                                {assignment.item?.product?.model}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {assignment.item?.product?.category?.name}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {assignment.item?.asset_code}
                                                {assignment.item?.serial_number &&
                                                    ` • ${assignment.item.serial_number}`}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() =>
                                            handleRemove(assignment.id, assignment.item?.id)
                                        }
                                        className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AssignEquipments;
