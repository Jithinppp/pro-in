import { useState } from "react";
import Button from "../../components/common/Button";

function CreateEvent() {
    const [formData, setFormData] = useState({
        // Basic informations
        job_id: "",
        event_name: "",
        client_name: "",
        client_type: "",
        job_status: "",
        event_type: "",
        project_manager_id: "",

        // Time and Dates
        event_dates: "",
        setup_start: "",
        is_multiple_days: false,
        additional_dates: [],
        // Venue details
        venue_name: "",
        hall_name: "",
        venue_address: "",
        loading_dock_notes: "",
        safety_precautions: "",
        parking_passes: "",
        security_access: "",

        // Contact details
        contact_name: "",
        contact_role: "",
        contact_mobile: "",
        contact_email: "",
        is_on_site: false,

        // Attachments
        file_floor_plan: "",
        file_run_of_show: "",
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Event created:", formData);
    };

    const handleAddDate = () => {
        setFormData((prev) => ({
            ...prev,
            additional_dates: [...prev.additional_dates, { date: "", notes: "" }],
        }));
    };

    const handleDateChange = (index, field, value) => {
        setFormData((prev) => {
            const newDates = [...prev.additional_dates];
            newDates[index] = { ...newDates[index], [field]: value };
            return { ...prev, additional_dates: newDates };
        });
    };

    const handleRemoveDate = (index) => {
        setFormData((prev) => ({
            ...prev,
            additional_dates: prev.additional_dates.filter((_, i) => i !== index),
        }));
    };

    const inputClass = "w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
    const labelClass = "block text-sm font-medium text-gray-700 mb-1";

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Create Event</h1>
            <p className="text-gray-500 mb-8">Schedule a new project event or meeting</p>

            <form onSubmit={handleSubmit} className="space-y-12">
                {/* SECTION 1: Basic informations */}
                <section>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Basic informations
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <label className={labelClass}>Job ID</label>
                            <input
                                type="text"
                                name="job_id"
                                value={formData.job_id}
                                onChange={handleChange}
                                placeholder="AV-2026-001"
                                className={inputClass}
                            />
                        </div>
                        <div className="lg:col-span-2">
                            <label className={labelClass}>Event Name *</label>
                            <input
                                type="text"
                                name="event_name"
                                value={formData.event_name}
                                onChange={handleChange}
                                required
                                placeholder="Full Title of the Event"
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Client Name</label>
                            <input
                                type="text"
                                name="client_name"
                                value={formData.client_name}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Client Type</label>
                            <select
                                name="client_type"
                                value={formData.client_type}
                                onChange={handleChange}
                                className={inputClass}
                            >
                                <option value="">Select Type</option>
                                <option value="direct">Direct</option>
                                <option value="indirect">Indirect</option>
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Event Type</label>
                            <select
                                name="event_type"
                                value={formData.event_type}
                                onChange={handleChange}
                                className={inputClass}
                            >
                                <option value="">Select Type</option>
                                <option value="SI">SI</option>
                                <option value="RSI">RSI</option>
                                <option value="AV">AV</option>
                                <option value="Broadcast">Broadcast</option>
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Project Manager ID</label>
                            <input
                                type="text"
                                name="project_manager_id"
                                value={formData.project_manager_id}
                                onChange={handleChange}
                                placeholder="FK to Profiles"
                                className={inputClass}
                            />
                        </div>
                    </div>
                </section>

                {/* SECTION 2: Time and Dates */}
                <section>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Time and Dates
                    </h2>
                    <div className="space-y-4">
                        {/* Setup Start */}
                        <div>
                            <label className={labelClass}>Setup Start</label>
                            <input
                                type="datetime-local"
                                name="setup_start"
                                value={formData.setup_start}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </div>

                        {/* Single Day - Default */}
                        {!formData.is_multiple_days && (
                            <div>
                                <label className={labelClass}>Event Date *</label>
                                <input
                                    type="date"
                                    name="event_dates"
                                    value={formData.event_dates}
                                    onChange={handleChange}
                                    required
                                    className={inputClass}
                                />
                            </div>
                        )}

                        {/* Multiple Day */}
                        {formData.is_multiple_days && (
                            <div className="space-y-4">
                                <div>
                                    <label className={labelClass}>Event Start Date *</label>
                                    <input
                                        type="date"
                                        name="event_dates"
                                        value={formData.event_dates}
                                        onChange={handleChange}
                                        required
                                        className={inputClass}
                                    />
                                </div>

                                {/* Additional Dates - Show when button clicked */}
                                {formData.additional_dates.map((additionalDate, index) => (
                                    <div key={index} className="flex gap-2 items-center">
                                        <div className="flex-1">
                                            <input
                                                type="date"
                                                value={additionalDate.date}
                                                onChange={(e) => handleDateChange(index, "date", e.target.value)}
                                                className={inputClass}
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={() => handleRemoveDate(index)}
                                            className="text-red-600 hover:text-red-700 px-3 shrink-0"
                                        >
                                            ✕
                                        </Button>
                                    </div>
                                ))}
                                {/* Add Day Button */}
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={handleAddDate}
                                    className="text-sm"
                                >
                                    + Add Day
                                </Button>
                            </div>
                        )}

                        {/* Single/Multiple Day Toggle */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="is_multiple_days"
                                    id="is_multiple_days"
                                    checked={formData.is_multiple_days}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="is_multiple_days" className="ml-2 text-sm text-gray-700">
                                    Multiple Day Event
                                </label>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 3: Venue details */}
                <section>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Venue details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Venue Name</label>
                            <input
                                type="text"
                                name="venue_name"
                                value={formData.venue_name}
                                onChange={handleChange}
                                placeholder="Name of Hotel/Convention Center"
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Hall Name</label>
                            <input
                                type="text"
                                name="hall_name"
                                value={formData.hall_name}
                                onChange={handleChange}
                                placeholder="Specific Room or Ballroom"
                                className={inputClass}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className={labelClass}>Venue Address</label>
                            <input
                                type="text"
                                name="venue_address"
                                value={formData.venue_address}
                                onChange={handleChange}
                                placeholder="Full physical address"
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Loading Dock Notes</label>
                            <textarea
                                name="loading_dock_notes"
                                value={formData.loading_dock_notes}
                                onChange={handleChange}
                                rows={2}
                                placeholder="Dock height, ramp access, street-load restrictions"
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Safety Precautions</label>
                            <textarea
                                name="safety_precautions"
                                value={formData.safety_precautions}
                                onChange={handleChange}
                                rows={2}
                                placeholder="Boot, vest, helmet required or not?"
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Parking Passes</label>
                            <input
                                type="number"
                                name="parking_passes"
                                value={formData.parking_passes}
                                onChange={handleChange}
                                placeholder="Number of truck/crew spots"
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Security Access</label>
                            <input
                                type="text"
                                name="security_access"
                                value={formData.security_access}
                                onChange={handleChange}
                                placeholder="Badge requirements or security clearance"
                                className={inputClass}
                            />
                        </div>
                    </div>
                </section>

                {/* SECTION 4: Contact details */}
                <section>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Contact details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <label className={labelClass}>Contact Name</label>
                            <input
                                type="text"
                                name="contact_name"
                                value={formData.contact_name}
                                onChange={handleChange}
                                placeholder="Full Name"
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Contact Role</label>
                            <select
                                name="contact_role"
                                value={formData.contact_role}
                                onChange={handleChange}
                                className={inputClass}
                            >
                                <option value="">Select Role</option>
                                <option value="Client Lead">Client Lead</option>
                                <option value="Venue Manager">Venue Manager</option>
                                <option value="Technical Director">Technical Director</option>
                                <option value="Caterer">Caterer</option>
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Contact Mobile</label>
                            <input
                                type="tel"
                                name="contact_mobile"
                                value={formData.contact_mobile}
                                onChange={handleChange}
                                placeholder="Phone number"
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Contact Email</label>
                            <input
                                type="email"
                                name="contact_email"
                                value={formData.contact_email}
                                onChange={handleChange}
                                placeholder="Email address"
                                className={inputClass}
                            />
                        </div>
                        <div className="flex items-center pt-6">
                            <input
                                type="checkbox"
                                name="is_on_site"
                                id="is_on_site"
                                checked={formData.is_on_site}
                                onChange={handleChange}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="is_on_site" className="ml-2 text-sm text-gray-700">
                                Is On Site
                            </label>
                        </div>
                    </div>
                </section>

                {/* SECTION 5: Attachments */}
                <section>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Attachments
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Floor Plan File</label>
                            <input
                                type="url"
                                name="file_floor_plan"
                                value={formData.file_floor_plan}
                                onChange={handleChange}
                                placeholder="Link to CAD/PDF/IMG of room layout"
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Run of Show File</label>
                            <input
                                type="url"
                                name="file_run_of_show"
                                value={formData.file_run_of_show}
                                onChange={handleChange}
                                placeholder="Link to schedule/AGENDA"
                                className={inputClass}
                            />
                        </div>
                    </div>
                </section>

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-4 ">
                    <Button type="submit" variant="primary">
                        Create Event
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => window.history.back()}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default CreateEvent;
