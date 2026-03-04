import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Button from "../../components/common/Button";
import { createEventType, fetchEventTypes } from "../../lib/supabase";

function AddEventType() {
    const [loading, setLoading] = useState(false);
    const [formMessage, setFormMessage] = useState(null);
    const [eventTypes, setEventTypes] = useState([]);
    const [loadingTypes, setLoadingTypes] = useState(true);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    // Fetch event types on mount
    useEffect(() => {
        async function loadEventTypes() {
            const result = await fetchEventTypes();
            if (result.success) {
                setEventTypes(result.eventTypes);
            }
            setLoadingTypes(false);
        }
        loadEventTypes();
    }, []);

    const onSubmit = async (data) => {
        setLoading(true);
        setFormMessage(null);

        try {
            const result = await createEventType(data.name, data.description);

            if (result.success) {
                setFormMessage({ type: "success", text: "Event type created successfully!" });
                reset();
                // Refresh the list
                const refreshResult = await fetchEventTypes();
                if (refreshResult.success) {
                    setEventTypes(refreshResult.eventTypes);
                }
            } else {
                setFormMessage({ type: "error", text: result.error || "Failed to create event type" });
            }
        } catch (err) {
            setFormMessage({ type: "error", text: "An unexpected error occurred" });
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        "w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm";
    const errorInputClass =
        "w-full px-3 py-2.5 bg-white border border-red-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm";
    const labelClass = "block text-sm font-medium text-gray-700 mb-1";
    const requiredStar = <span className="text-red-500">*</span>;
    const errorClass = "text-red-500 text-xs mt-1";

    return (
        <div className="p-4 md:p-6">
            <div className="bg-white rounded-lg border border-gray-200 max-w-full">
                <div className="p-4 border-b border-gray-200">
                    <h1 className="text-xl font-semibold text-gray-900">Event Types</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Add and manage event types for your projects
                    </p>
                </div>

                <div className="p-4">
                    {/* Add Event Type Form */}
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Add New Event Type
                        </h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
                            {formMessage && (
                                <div
                                    className={`p-3 rounded-lg text-sm ${formMessage.type === "success"
                                            ? "bg-green-50 text-green-700 border border-green-200"
                                            : "bg-red-50 text-red-700 border border-red-200"
                                        }`}
                                >
                                    {formMessage.text}
                                </div>
                            )}

                            <div>
                                <label className={labelClass}>
                                    Event Type Name{requiredStar}
                                </label>
                                <input
                                    type="text"
                                    {...register("name", {
                                        required: "Event type name is required",
                                        maxLength: {
                                            value: 50,
                                            message: "Event type name must be 50 characters or less",
                                        },
                                    })}
                                    placeholder="e.g., SI, RSI, AV, SI-AV, BC"
                                    className={errors.name ? errorInputClass : inputClass}
                                />
                                {errors.name && (
                                    <p className={errorClass}>{errors.name.message}</p>
                                )}
                            </div>

                            <div>
                                <label className={labelClass}>Description</label>
                                <textarea
                                    {...register("description")}
                                    rows={3}
                                    placeholder="Description of this event type (optional)"
                                    className={inputClass}
                                />
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                disabled={loading}
                                className="w-full"
                            >
                                {loading ? "Creating..." : "Add Event Type"}
                            </Button>
                        </form>
                    </div>

                    {/* Existing Event Types List */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Existing Event Types
                        </h2>
                        {loadingTypes ? (
                            <p className="text-sm text-gray-500">Loading...</p>
                        ) : eventTypes.length === 0 ? (
                            <p className="text-sm text-gray-500">
                                No event types found. Add one above.
                            </p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Name
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Description
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Created At
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {eventTypes.map((type) => (
                                            <tr key={type.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                                    {type.name}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-500">
                                                    {type.description || "-"}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-500">
                                                    {type.created_at
                                                        ? new Date(type.created_at).toLocaleDateString()
                                                        : "-"}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddEventType;
