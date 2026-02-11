import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchEventById, updateEvent, deleteEvent } from "../../utils/supabase";

function SingleEvent() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        if (id) {
            loadEvent();
        }
    }, [id]);

    const loadEvent = async () => {
        try {
            setLoading(true);
            const data = await fetchEventById(id);
            setEvent(data);
            setEditForm({
                event_name: data?.event_name || "",
                client_name: data?.client_name || "",
                event_start_date: data?.event_start_date || "",
                event_end_date: data?.event_end_date || "",
                event_location: data?.event_location || "",
                venue: data?.venue || "",
                hall_name: data?.hall_name || "",
                event_type: data?.event_type || "",
                setup_date_time: data?.setup_date_time || "",
                audience_size: data?.audience_size || "",
                event_desc: data?.event_desc || "",
            });
        } catch (err) {
            setError(err.message || "Failed to load event");
        } finally {
            setLoading(false);
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            await updateEvent(id, {
                ...editForm,
                audience_size: editForm.audience_size ? parseInt(editForm.audience_size, 10) : null,
            });
            setSuccess("Event updated successfully!");
            setIsEditing(false);
            loadEvent();
        } catch (err) {
            setError(err.message || "Failed to update event");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        setShowDeleteModal(false);
        try {
            setLoading(true);
            await deleteEvent(id);
            navigate("/project-manager/events");
        } catch (err) {
            setError(err.message || "Failed to delete event");
            setLoading(false);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "—";
        return new Date(dateStr).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const formatDateTime = (dateStr) => {
        if (!dateStr) return "—";
        return new Date(dateStr).toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const eventTypeLabels = {
        interpretation: "Interpretation",
        rsi: "RSI",
        av: "AV",
        combined: "Combined",
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

    if (!event) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">Event not found</p>
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

    if (isEditing) {
        return (
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white border-b border-gray-100 px-8 py-6">
                    <div className="max-w-5xl mx-auto flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">Edit Event</h1>
                            <p className="text-gray-500 mt-1 text-sm">Update event details</p>
                        </div>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-150"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Cancel
                        </button>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto px-8 py-6">
                    {/* Success/Error Messages */}
                    {success && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                            {success}
                        </div>
                    )}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleUpdate} className="space-y-6">
                        {/* Event Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Event Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="event_name"
                                value={editForm.event_name}
                                onChange={handleEditChange}
                                required
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Client Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Client Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="client_name"
                                value={editForm.client_name}
                                onChange={handleEditChange}
                                required
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Event Date */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Start Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="event_start_date"
                                    value={editForm.event_start_date}
                                    onChange={handleEditChange}
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    name="event_end_date"
                                    value={editForm.event_end_date}
                                    onChange={handleEditChange}
                                    min={editForm.event_start_date}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Event Location & Venue */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Event Location <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="event_location"
                                    value={editForm.event_location}
                                    onChange={handleEditChange}
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Venue <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="venue"
                                    value={editForm.venue}
                                    onChange={handleEditChange}
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Hall Name & Event Type */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Hall Name
                                </label>
                                <input
                                    type="text"
                                    name="hall_name"
                                    value={editForm.hall_name}
                                    onChange={handleEditChange}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Event Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="event_type"
                                    value={editForm.event_type}
                                    onChange={handleEditChange}
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                >
                                    <option value="">Select event type</option>
                                    <option value="interpretation">Interpretation</option>
                                    <option value="rsi">RSI</option>
                                    <option value="av">AV</option>
                                    <option value="combined">Combined</option>
                                </select>
                            </div>
                        </div>

                        {/* Setup Date Time & Audience */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Setup Date Time
                                </label>
                                <input
                                    type="datetime-local"
                                    name="setup_date_time"
                                    value={editForm.setup_date_time}
                                    onChange={handleEditChange}
                                    step="60"
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Audience Size (pax)
                                </label>
                                <input
                                    type="number"
                                    name="audience_size"
                                    value={editForm.audience_size}
                                    onChange={handleEditChange}
                                    min="0"
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Event Description
                            </label>
                            <textarea
                                name="event_desc"
                                value={editForm.event_desc}
                                onChange={handleEditChange}
                                rows={4}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-6 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-150"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-150 disabled:opacity-50"
                            >
                                {loading ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
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
                        <h1 className="text-2xl font-semibold text-gray-900">{event.event_name}</h1>
                        <p className="text-gray-500 mt-1 text-sm">Event Details</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-150"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                        </button>
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-150"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
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
                {/* Success/Error Messages */}
                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                        {success}
                    </div>
                )}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        {error}
                    </div>
                )}

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 space-y-6">
                        {/* Event Name & Client */}
                        <div className="border-b border-gray-100 pb-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-gray-400 text-sm">Client</span>
                                    </div>
                                    <p className="text-lg font-medium text-gray-900">
                                        {event.client_name || "—"}
                                    </p>
                                </div>
                                {event.event_type && (
                                    <span className="px-3 py-1 text-sm font-medium bg-blue-50 text-blue-700 rounded-full">
                                        {eventTypeLabels[event.event_type] || event.event_type}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Date & Time */}
                        <div className="border-b border-gray-100 pb-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <svg
                                            className="w-4 h-4 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                        <span className="text-gray-400 text-sm">Date</span>
                                    </div>
                                    <p className="text-gray-900">
                                        {formatDate(event.event_start_date)}
                                        {event.event_end_date &&
                                            event.event_end_date !== event.event_start_date && (
                                                <>
                                                    {" — "}
                                                    {formatDate(event.event_end_date)}
                                                </>
                                            )}
                                    </p>
                                </div>
                                {event.setup_date_time && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <svg
                                                className="w-4 h-4 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            <span className="text-gray-400 text-sm">Setup Time</span>
                                        </div>
                                        <p className="text-gray-900">{formatDateTime(event.setup_date_time)}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Location */}
                        <div className="border-b border-gray-100 pb-6">
                            <div className="flex items-start gap-3">
                                <svg
                                    className="w-5 h-5 text-gray-400 mt-0.5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-gray-400 text-sm">Location</span>
                                    </div>
                                    <p className="text-gray-900 font-medium">{event.event_location || "—"}</p>
                                    {(event.venue || event.hall_name) && (
                                        <p className="text-gray-600 text-sm mt-1">
                                            {event.venue}
                                            {event.hall_name && ` · ${event.hall_name}`}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Audience */}
                        {event.audience_size && (
                            <div className="border-b border-gray-100 pb-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <svg
                                        className="w-4 h-4 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                        />
                                    </svg>
                                    <span className="text-gray-400 text-sm">Audience Size</span>
                                </div>
                                <p className="text-gray-900">{event.audience_size} pax</p>
                            </div>
                        )}

                        {/* Description */}
                        {event.event_desc && (
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <svg
                                        className="w-4 h-4 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 6h16M4 12h16M4 18h7"
                                        />
                                    </svg>
                                    <span className="text-gray-400 text-sm">Description</span>
                                </div>
                                <p className="text-gray-700 whitespace-pre-wrap">{event.event_desc}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setShowDeleteModal(false)}
                    />

                    {/* Modal Content */}
                    <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6 animate-in fade-in zoom-in duration-200">
                        <div className="text-center">
                            {/* Warning Icon */}
                            <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>

                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Event</h3>
                            <p className="text-gray-500 mb-6">
                                Are you sure you want to delete <span className="font-medium text-gray-700">{event.event_name}</span>? This action cannot be undone.
                            </p>

                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={loading}
                                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {loading ? "Deleting..." : "Delete Event"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SingleEvent;
