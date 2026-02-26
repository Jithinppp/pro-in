import { useState, useContext } from "react";
import Button from "../../components/common/Button";
import { createEvent } from "../../lib/supabase";
import { AuthContext } from "../../contexts/AuthContext";

function CreateEvent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    // Basic information
    job_id: "",
    event_name: "",
    description: "",
    client_name: "",
    client_type: "",
    job_status: "",
    event_type: "",
    project_manager_id: "",

    // Time and Dates
    event_date: "",
    setup_date: "",
    is_multiple_days: false,
    additional_dates: [],
    // Venue details
    is_multiple_venues: false,
    venue_name: "",
    hall_name: "",
    venue_address: "",
    pax: "",
    loading_dock_notes: "",
    safety_precautions: "",
    parking_passes: "",
    security_access: "",
    additional_venues: [],

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

  const { user } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await createEvent(formData, user.id);

      if (result.success) {
        alert("Event created successfully!");
        // Reset form or navigate
        window.history.back();
      } else {
        setError(result.error || "Failed to create event");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
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

  // Venue handlers
  const handleAddVenue = () => {
    setFormData((prev) => ({
      ...prev,
      additional_venues: [
        ...prev.additional_venues,
        {
          venue_name: "",
          hall_name: "",
          venue_address: "",
          pax: "",
          loading_dock_notes: "",
          safety_precautions: "",
          parking_passes: "",
          security_access: "",
        },
      ],
    }));
  };

  const handleVenueChange = (index, field, value, isAdditional = false) => {
    if (isAdditional) {
      setFormData((prev) => {
        const newVenues = [...prev.additional_venues];
        newVenues[index] = { ...newVenues[index], [field]: value };
        return { ...prev, additional_venues: newVenues };
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleRemoveVenue = (index) => {
    setFormData((prev) => ({
      ...prev,
      additional_venues: prev.additional_venues.filter((_, i) => i !== index),
    }));
  };

  const inputClass =
    "w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const requiredLabelClass = "block text-sm font-medium text-gray-700 mb-1";
  const requiredStar = <span className="text-red-500 ml-1">*</span>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">
        Create Event
      </h1>
      <p className="text-gray-500 mb-8">
        Schedule a new project event or meeting
      </p>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {loading && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700">
          Creating event...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* SECTION 1: Basic information */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Basic information
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
              <label className={requiredLabelClass}>
                Event Name{requiredStar}
              </label>
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
            <div className="lg:col-span-3">
              <label className={labelClass}>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Event description or notes"
                className={inputClass}
              />
            </div>
            <div>
              <label className={requiredLabelClass}>
                Client Name{requiredStar}
              </label>
              <input
                type="text"
                name="client_name"
                value={formData.client_name}
                onChange={handleChange}
                required
                placeholder="Client Company Name"
                className={inputClass}
              />
            </div>
            <div>
              <label className={requiredLabelClass}>
                Client Type{requiredStar}
              </label>
              <select
                name="client_type"
                value={formData.client_type}
                onChange={handleChange}
                required
                className={inputClass}
              >
                <option value="">Select Type</option>
                <option value="direct">Direct</option>
                <option value="indirect">Indirect</option>
              </select>
            </div>
            <div>
              <label className={requiredLabelClass}>
                Event Type{requiredStar}
              </label>
              <select
                name="event_type"
                value={formData.event_type}
                onChange={handleChange}
                required
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
              <label className={requiredLabelClass}>
                Project Manager{requiredStar}
              </label>
              <input
                type="text"
                name="project_manager_id"
                value={formData.project_manager_id}
                onChange={handleChange}
                required
                placeholder="Project Manager Name"
                className={inputClass}
              />
            </div>
          </div>
        </section>

        {/* SECTION 3: Time and Dates */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Time and Dates
          </h2>
          <div className="space-y-4">
            {/* Setup Start */}
            <div>
              <label className={requiredLabelClass}>
                Setup Start{requiredStar}
              </label>
              <input
                type="datetime-local"
                name="setup_date"
                value={formData.setup_date}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            {/* Single Day - Default */}
            {!formData.is_multiple_days && (
              <div>
                <label className={requiredLabelClass}>
                  Event Date{requiredStar}
                </label>
                <input
                  type="date"
                  name="event_date"
                  value={formData.event_date}
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
                  <label className={requiredLabelClass}>
                    Event Start Date{requiredStar}
                  </label>
                  <input
                    type="date"
                    name="event_date"
                    value={formData.event_date}
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
                        onChange={(e) =>
                          handleDateChange(index, "date", e.target.value)
                        }
                        className={inputClass}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="danger"
                      onClick={() => handleRemoveDate(index)}
                      className="px-3 shrink-0"
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
                <label
                  htmlFor="is_multiple_days"
                  className="ml-2 text-sm text-gray-700"
                >
                  Multiple Day Event
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Venue details */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Venue details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={requiredLabelClass}>
                Venue Name{requiredStar}
              </label>
              <input
                type="text"
                name="venue_name"
                value={formData.venue_name}
                onChange={handleChange}
                required
                placeholder="Name of Hotel/Convention Center"
                className={inputClass}
              />
            </div>
            <div>
              <label className={requiredLabelClass}>
                Hall Name{requiredStar}
              </label>
              <input
                type="text"
                name="hall_name"
                value={formData.hall_name}
                onChange={handleChange}
                required
                placeholder="Specific Room or Ballroom"
                className={inputClass}
              />
            </div>
            <div className="md:col-span-2">
              <label className={requiredLabelClass}>
                Venue Address{requiredStar}
              </label>
              <input
                type="text"
                name="venue_address"
                value={formData.venue_address}
                onChange={handleChange}
                required
                placeholder="Full physical address"
                className={inputClass}
              />
            </div>
            <div>
              <label className={requiredLabelClass}>
                Pax (Number of Guests){requiredStar}
              </label>
              <input
                type="number"
                name="pax"
                value={formData.pax}
                onChange={handleChange}
                required
                placeholder="Number of guests"
                className={inputClass}
              />
            </div>
            <div>
              <label className={requiredLabelClass}>
                Loading Dock Details{requiredStar}
              </label>
              <textarea
                name="loading_dock_notes"
                value={formData.loading_dock_notes}
                onChange={handleChange}
                required
                rows={2}
                placeholder="Dock height, ramp access, street-load restrictions"
                className={inputClass}
              />
            </div>
            <div>
              <label className={requiredLabelClass}>
                Safety Precautions{requiredStar}
              </label>
              <select
                name="safety_precautions"
                value={formData.safety_precautions}
                onChange={handleChange}
                required
                className={inputClass}
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
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
              <label className={requiredLabelClass}>
                Security Access{requiredStar}
              </label>
              <input
                type="text"
                name="security_access"
                value={formData.security_access}
                onChange={handleChange}
                required
                placeholder="Badge requirements or security clearance"
                className={inputClass}
              />
            </div>

            {/* Multiple Venues Toggle */}
            <div className="md:col-span-2 flex items-center gap-4 pt-4 border-t border-gray-200">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_multiple_venues"
                  id="is_multiple_venues"
                  checked={formData.is_multiple_venues}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="is_multiple_venues"
                  className="ml-2 text-sm text-gray-700"
                >
                  Multiple Venues
                </label>
              </div>
            </div>

            {/* Additional Venues */}
            {formData.is_multiple_venues && (
              <div className="md:col-span-2 space-y-6 pt-4">
                {formData.additional_venues.map((venue, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 rounded-lg space-y-4"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium text-gray-700">
                        Venue {index + 2}
                      </h3>
                      <Button
                        type="button"
                        variant="danger"
                        onClick={() => handleRemoveVenue(index)}
                        className="px-2 py-1 text-sm"
                      >
                        Remove
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Venue Name</label>
                        <input
                          type="text"
                          value={venue.venue_name}
                          onChange={(e) =>
                            handleVenueChange(
                              index,
                              "venue_name",
                              e.target.value,
                              true,
                            )
                          }
                          placeholder="Name of Hotel/Convention Center"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Hall Name</label>
                        <input
                          type="text"
                          value={venue.hall_name}
                          onChange={(e) =>
                            handleVenueChange(
                              index,
                              "hall_name",
                              e.target.value,
                              true,
                            )
                          }
                          placeholder="Specific Room or Ballroom"
                          className={inputClass}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className={labelClass}>Venue Address</label>
                        <input
                          type="text"
                          value={venue.venue_address}
                          onChange={(e) =>
                            handleVenueChange(
                              index,
                              "venue_address",
                              e.target.value,
                              true,
                            )
                          }
                          placeholder="Full physical address"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>
                          Pax (Number of Guests)
                        </label>
                        <input
                          type="number"
                          value={venue.pax}
                          onChange={(e) =>
                            handleVenueChange(
                              index,
                              "pax",
                              e.target.value,
                              true,
                            )
                          }
                          placeholder="Number of guests"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>
                          Loading Dock Details
                        </label>
                        <textarea
                          value={venue.loading_dock_notes}
                          onChange={(e) =>
                            handleVenueChange(
                              index,
                              "loading_dock_notes",
                              e.target.value,
                              true,
                            )
                          }
                          rows={2}
                          placeholder="Dock height, ramp access"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Safety Precautions</label>
                        <select
                          value={venue.safety_precautions}
                          onChange={(e) =>
                            handleVenueChange(
                              index,
                              "safety_precautions",
                              e.target.value,
                              true,
                            )
                          }
                          className={inputClass}
                        >
                          <option value="">Select</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>Parking Passes</label>
                        <input
                          type="number"
                          value={venue.parking_passes}
                          onChange={(e) =>
                            handleVenueChange(
                              index,
                              "parking_passes",
                              e.target.value,
                              true,
                            )
                          }
                          placeholder="Number of truck/crew spots"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Security Access</label>
                        <input
                          type="text"
                          value={venue.security_access}
                          onChange={(e) =>
                            handleVenueChange(
                              index,
                              "security_access",
                              e.target.value,
                              true,
                            )
                          }
                          placeholder="Badge requirements"
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleAddVenue}
                  className="w-full"
                >
                  + Add Another Venue
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* SECTION 4: Contact details */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Contact details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className={requiredLabelClass}>
                Contact Name{requiredStar}
              </label>
              <input
                type="text"
                name="contact_name"
                value={formData.contact_name}
                onChange={handleChange}
                required
                placeholder="Full Name"
                className={inputClass}
              />
            </div>
            <div>
              <label className={requiredLabelClass}>
                Contact Role{requiredStar}
              </label>
              <select
                name="contact_role"
                value={formData.contact_role}
                onChange={handleChange}
                required
                className={inputClass}
              >
                <option value="">Select Role</option>
                <option value="Project Manager">Project Manager</option>
                <option value="AV Guy">AV Guy</option>
                <option value="Tech Lead">Tech Lead</option>
                <option value="Venue Manager">Venue Manager</option>
                <option value="Client Lead">Client Lead</option>
                <option value="Technical Manager">Technical Manager</option>
              </select>
            </div>
            <div>
              <label className={requiredLabelClass}>Phone{requiredStar}</label>
              <input
                type="tel"
                name="contact_mobile"
                value={formData.contact_mobile}
                onChange={handleChange}
                required
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
              <label
                htmlFor="is_on_site"
                className="ml-2 text-sm text-gray-700"
              >
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
