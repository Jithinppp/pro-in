import { useState, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import DatePicker from "../../components/common/DatePicker";
import DateTimePicker from "../../components/common/DateTimePicker";
import {
  createEvent,
  fetchProjectManagers,
  fetchEventTypes,
  fetchLastJobId,
  uploadEventAttachments,
} from "../../lib/supabase";
import { AuthContext } from "../../contexts/AuthContext";

function CreateEvent() {
  const [loading, setLoading] = useState(false);
  const [formMessage, setFormMessage] = useState(null);
  const [projectManagers, setProjectManagers] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [baseJobId, setBaseJobId] = useState(""); // Stores job_id with XX placeholder

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError: setFormError,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
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

      // Attachments
      floor_plans: [],
      agendas: [],
    },
  });

  // Watch certain fields for conditional rendering
  const isMultipleDays = watch("is_multiple_days");
  const isMultipleVenues = watch("is_multiple_venues");
  const additionalDates = watch("additional_dates");
  const additionalVenues = watch("additional_venues");
  const watchedEventType = watch("event_type");

  // Update job_id when event_type changes
  useEffect(() => {
    if (watchedEventType && baseJobId && eventTypes.length > 0) {
      // Convert watchedEventType to number for comparison since dropdown value is string
      const selectedTypeId = Number(watchedEventType);
      const selectedType = eventTypes.find(
        (type) => type.id === selectedTypeId,
      );
      if (selectedType) {
        // Use the event type name as the code (SI, RSI, AV, SI-AV, BC)
        const eventTypeCode = selectedType.name;
        const updatedJobId = baseJobId.replace("XX", eventTypeCode);
        setValue("job_id", updatedJobId);
      }
    }
  }, [watchedEventType, eventTypes, baseJobId, setValue]);

  // Watch date fields for validation
  const watchedSetupDate = watch("setup_date");
  const watchedEventDate = watch("event_date");
  const watchedIsMultipleDays = watch("is_multiple_days");
  const watchedAdditionalDates = watch("additional_dates");

  // Date validation - setup before event, additional dates in order, no duplicates
  useEffect(() => {
    if (!watchedSetupDate || !watchedEventDate) return;

    const setupDate = new Date(watchedSetupDate);
    const eventDate = new Date(watchedEventDate);
    let lastEventDate = eventDate;

    // For multi-day events, validate against the last date
    if (watchedIsMultipleDays && watchedAdditionalDates?.length > 0) {
      // Find the last additional date
      const validDates = watchedAdditionalDates
        .filter((d) => d?.date)
        .map((d) => new Date(d.date));

      if (validDates.length > 0) {
        lastEventDate = new Date(Math.max(...validDates));
      }
    }

    // Setup must be before event (or last event date for multi-day)
    if (setupDate >= lastEventDate) {
      setFormError("setup_date", {
        type: "manual",
        message: "Setup must be before event date",
      });
    } else {
      clearErrors("setup_date");
    }

    // Validate additional dates - chronological order + no duplicates
    if (watchedIsMultipleDays && watchedAdditionalDates?.length > 0) {
      let prevDate = eventDate;
      let hasError = false;
      let errorMessage = "";

      // Check for duplicates with event_date
      const allDates = [
        eventDate,
        ...watchedAdditionalDates
          .filter((d) => d?.date)
          .map((d) => new Date(d.date)),
      ];
      const uniqueDates = new Set(allDates.map((d) => d.toDateString()));
      if (uniqueDates.size !== allDates.length) {
        hasError = true;
        errorMessage = "Cannot add same date twice";
      }

      // Check chronological order
      if (!hasError) {
        for (const addDate of watchedAdditionalDates) {
          if (addDate?.date) {
            const currentDate = new Date(addDate.date);
            if (currentDate <= prevDate) {
              hasError = true;
              errorMessage = "Each date must be after the previous";
              break;
            }
            prevDate = currentDate;
          }
        }
      }

      if (hasError) {
        setFormError("additional_dates", {
          type: "manual",
          message: errorMessage,
        });
      } else {
        clearErrors("additional_dates");
      }
    }
  }, [
    watchedSetupDate,
    watchedEventDate,
    watchedIsMultipleDays,
    watchedAdditionalDates,
    setFormError,
    clearErrors,
  ]);

  // Fetch project managers, event types and last job_id on component mount
  useEffect(() => {
    async function loadData() {
      const [pmResult, etResult, lastJobIdResult] = await Promise.all([
        fetchProjectManagers(),
        fetchEventTypes(),
        fetchLastJobId(),
      ]);

      if (pmResult.success) {
        setProjectManagers(pmResult.managers);
      }
      if (etResult.success) {
        setEventTypes(etResult.eventTypes);
      }

      // Generate auto job_id
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");
      const currentDate = `${yyyy}${mm}${dd}`;

      let nextSequence = 1;
      if (lastJobIdResult.success && lastJobIdResult.jobId) {
        // Parse last job_id: YYYYMMDD-EVENT_TYPE-SEQUENCE
        // Example: 20260227-SI-01
        const lastJobId = lastJobIdResult.jobId;
        const parts = lastJobId.split("-");
        if (parts.length >= 3) {
          const lastDate = parts[0];
          const lastSequence = parseInt(parts[2], 10);
          // Validate parsing succeeded and check if last event is from today
          if (!isNaN(lastSequence) && lastDate === currentDate) {
            nextSequence = lastSequence + 1;
          }
        }
      }

      // Format: YYYYMMDD-XX-SEQUENCE (XX is placeholder until event type is selected)
      const sequenceStr = String(nextSequence).padStart(2, "0");
      const defaultJobId = `${currentDate}-XX-${sequenceStr}`;
      setBaseJobId(defaultJobId);
      setValue("job_id", defaultJobId);
    }
    loadData();
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    setFormMessage(null);

    // Validate additional venues if there are any additional venues
    if (data.additional_venues && data.additional_venues.length > 0) {
      const requiredVenueFields = [
        "venue_name",
        "hall_name",
        "venue_address",
        "pax",
        "loading_dock_notes",
        "safety_precautions",
        "security_access",
      ];

      for (let i = 0; i < data.additional_venues.length; i++) {
        const venue = data.additional_venues[i];
        for (const field of requiredVenueFields) {
          if (!venue[field] || venue[field].toString().trim() === "") {
            setFormMessage(
              `Venue ${i + 2}: ${field.replace(/_/g, " ")} is required`,
            );
            setLoading(false);
            return;
          }
        }
      }
    }

    try {
      const result = await createEvent(data, user.id);

      if (result.success) {
        const eventId = result.event.id;
        const jobId = result.event.job_id;
        let uploadError = null;

        // Upload floor plans
        if (data.floor_plans && data.floor_plans.length > 0) {
          const floorPlanResult = await uploadEventAttachments(
            eventId,
            data.floor_plans,
            "floor_plan",
            jobId,
          );
          if (!floorPlanResult.success) {
            uploadError = "Failed to upload floor plan files";
          }
        }

        // Upload agendas (run of show) - only if floor plans succeeded
        if (!uploadError && data.agendas && data.agendas.length > 0) {
          const agendaResult = await uploadEventAttachments(
            eventId,
            data.agendas,
            "agenda",
            jobId,
          );
          if (!agendaResult.success) {
            uploadError = "Failed to upload agenda files";
          }
        }

        if (uploadError) {
          setFormMessage(
            uploadError +
            ". Event was created but attachments failed to upload.",
          );
          return;
        }

        window.history.back();
      } else {
        setFormMessage(result.error || "Failed to create event");
      }
    } catch (err) {
      setFormMessage("An unexpected error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDate = () => {
    const currentDates = watch("additional_dates") || [];
    setValue("additional_dates", [...currentDates, { date: "" }]);
  };

  const handleDateChange = (index, value) => {
    const currentDates = watch("additional_dates") || [];
    const newDates = [...currentDates];
    newDates[index] = { ...newDates[index], date: value };
    setValue("additional_dates", newDates);
  };

  const handleRemoveDate = (index) => {
    const currentDates = watch("additional_dates") || [];
    setValue(
      "additional_dates",
      currentDates.filter((_, i) => i !== index),
    );
  };

  // Venue handlers
  const handleAddVenue = () => {
    const currentVenues = watch("additional_venues") || [];
    setValue("additional_venues", [
      ...currentVenues,
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
    ]);
  };

  const handleVenueChange = (index, field, value) => {
    const currentVenues = watch("additional_venues") || [];
    const newVenues = [...currentVenues];
    newVenues[index] = { ...newVenues[index], [field]: value };
    setValue("additional_venues", newVenues);
  };

  const handleRemoveVenue = (index) => {
    const currentVenues = watch("additional_venues") || [];
    setValue(
      "additional_venues",
      currentVenues.filter((_, i) => i !== index),
    );
  };

  const inputClass =
    "w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm";
  const errorInputClass =
    "w-full px-3 py-2.5 bg-white border border-red-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const requiredLabelClass = "block text-sm font-medium text-gray-700 mb-1";
  const requiredStar = <span className="text-red-500">*</span>;
  const errorClass = "text-red-500 text-xs mt-1";

  return (
    <div className="p-4 md:p-6">
      <div className="bg-white rounded-lg border border-gray-200 max-w-full">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">Create Event</h1>
          <p className="text-sm text-gray-500 mt-1">
            Schedule a new project event or meeting
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-12">
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
                  {...register("job_id")}
                  placeholder="Auto-generated (e.g., 20260227-SI-01)"
                  className={`${inputClass} bg-gray-100 cursor-not-allowed`}
                  readOnly
                />
                <p className="text-xs text-gray-500 mt-1">
                  Job ID is auto-generated based on date and event type
                </p>
              </div>
              <div className="lg:col-span-2">
                <label className={requiredLabelClass}>
                  Event Name{requiredStar}
                </label>
                <input
                  type="text"
                  {...register("event_name", {
                    required: "Event name is required",
                  })}
                  placeholder="Full Title of the Event"
                  className={errors.event_name ? errorInputClass : inputClass}
                />
                {errors.event_name && (
                  <p className={errorClass}>{errors.event_name.message}</p>
                )}
              </div>
              <div className="lg:col-span-3">
                <label className={labelClass}>Description</label>
                <textarea
                  {...register("description")}
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
                  {...register("client_name", {
                    required: "Client name is required",
                  })}
                  placeholder="Client Company Name"
                  className={errors.client_name ? errorInputClass : inputClass}
                />
                {errors.client_name && (
                  <p className={errorClass}>{errors.client_name.message}</p>
                )}
              </div>
              <div>
                <label className={requiredLabelClass}>
                  Client Type{requiredStar}
                </label>
                <select
                  {...register("client_type", {
                    required: "Client type is required",
                  })}
                  className={errors.client_type ? errorInputClass : inputClass}
                >
                  <option value="">Select Type</option>
                  <option value="direct">Direct</option>
                  <option value="indirect">Indirect</option>
                </select>
                {errors.client_type && (
                  <p className={errorClass}>{errors.client_type.message}</p>
                )}
              </div>
              <div>
                <label className={requiredLabelClass}>
                  Event Type{requiredStar}
                </label>
                <select
                  {...register("event_type", {
                    required: "Event type is required",
                  })}
                  className={errors.event_type ? errorInputClass : inputClass}
                >
                  <option value="">Select Type</option>
                  {eventTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => navigate("/pm/event-types")}
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline mt-1"
                >
                  Add event type
                </button>
                {errors.event_type && (
                  <p className={errorClass}>{errors.event_type.message}</p>
                )}
              </div>
              <div>
                <label className={requiredLabelClass}>
                  Job Status{requiredStar}
                </label>
                <select
                  {...register("job_status", {
                    required: "Job status is required",
                  })}
                  className={errors.job_status ? errorInputClass : inputClass}
                >
                  <option value="">Select Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                {errors.job_status && (
                  <p className={errorClass}>{errors.job_status.message}</p>
                )}
              </div>
              <div>
                <label className={requiredLabelClass}>
                  Project Manager{requiredStar}
                </label>
                <select
                  {...register("project_manager_id", {
                    required: "Project manager is required",
                  })}
                  className={
                    errors.project_manager_id ? errorInputClass : inputClass
                  }
                >
                  <option value="">Select Project Manager</option>
                  {projectManagers.map((manager) => (
                    <option key={manager.id} value={manager.id}>
                      {manager.name}
                    </option>
                  ))}
                </select>
                {errors.project_manager_id && (
                  <p className={errorClass}>
                    {errors.project_manager_id.message}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* SECTION 3: Time and Dates */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Time and Dates
            </h2>
            <div className="space-y-4">
              {/* Event Date - Always visible */}
              <div>
                <label className={requiredLabelClass}>
                  Event Date{requiredStar}
                </label>
                <DatePicker
                  value={watch("event_date")}
                  onChange={(date) => setValue("event_date", date)}
                  placeholder="Select event date"
                  className={errors.event_date ? errorInputClass : inputClass}
                />
                {errors.event_date && (
                  <p className={errorClass}>{errors.event_date.message}</p>
                )}
              </div>

              {/* Additional Dates - Show when button clicked */}
              {(additionalDates || []).map((additionalDate, index) => {
                // Get event_date from form for min date calculation
                const eventDateVal = watch("event_date");
                // Calculate min date - each additional date must be AFTER the previous date (not same day)
                const prevDate =
                  index === 0
                    ? eventDateVal
                    : additionalDates[index - 1]?.date;

                // Add 1 day to previous date to require next day
                let minDateStr = prevDate || eventDateVal;
                if (minDateStr) {
                  const prev = new Date(minDateStr);
                  prev.setDate(prev.getDate() + 1);
                  minDateStr = prev.toISOString().split("T")[0];
                }

                return (
                  <div key={index} className="space-y-2">
                    <div className="flex gap-2 items-center">
                      <div className="flex-1">
                        <DatePicker
                          value={additionalDate?.date || ""}
                          onChange={(date) => handleDateChange(index, date)}
                          minDate={minDateStr}
                          placeholder="Select date"
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
                  </div>
                );
              })}
              {/* Add Day Button - Full width, always visible */}
              <Button
                type="button"
                variant="secondary"
                onClick={handleAddDate}
                className="w-full text-sm mt-6"
              >
                + Add Another Day
              </Button>

              {/* Setup date - Disabled until event_date is filled */}
              <div>
                <label className={requiredLabelClass}>
                  Setup date{requiredStar}
                </label>
                <DateTimePicker
                  value={watch("setup_date")}
                  onChange={(val) =>
                    setValue("setup_date", val, { shouldValidate: true })
                  }
                  disabled={!watch("event_date")}
                  maxDate={
                    watch("event_date")
                      ? new Date(watch("event_date"))
                      : undefined
                  }
                  className={`${errors.setup_date ? errorInputClass : inputClass} ${!watch("event_date") ? "bg-gray-100 cursor-not-allowed" : ""}`}
                />
                {!watch("event_date") && (
                  <p className="text-xs text-gray-500 mt-1">
                    Please select an event date first
                  </p>
                )}
                {errors.setup_date && (
                  <p className={errorClass}>{errors.setup_date.message}</p>
                )}
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
                  {...register("venue_name", {
                    required: "Venue name is required",
                  })}
                  placeholder="Name of Hotel/Convention Center"
                  className={errors.venue_name ? errorInputClass : inputClass}
                />
                {errors.venue_name && (
                  <p className={errorClass}>{errors.venue_name.message}</p>
                )}
              </div>
              <div>
                <label className={requiredLabelClass}>
                  Hall Name{requiredStar}
                </label>
                <input
                  type="text"
                  {...register("hall_name", {
                    required: "Hall name is required",
                  })}
                  placeholder="Specific Room or Ballroom"
                  className={errors.hall_name ? errorInputClass : inputClass}
                />
                {errors.hall_name && (
                  <p className={errorClass}>{errors.hall_name.message}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className={requiredLabelClass}>
                  Venue Address{requiredStar}
                </label>
                <input
                  type="text"
                  {...register("venue_address", {
                    required: "Venue address is required",
                  })}
                  placeholder="Full physical address"
                  className={
                    errors.venue_address ? errorInputClass : inputClass
                  }
                />
                {errors.venue_address && (
                  <p className={errorClass}>{errors.venue_address.message}</p>
                )}
              </div>
              <div>
                <label className={requiredLabelClass}>
                  Pax (Number of Guests){requiredStar}
                </label>
                <input
                  type="number"
                  min="0"
                  {...register("pax", {
                    required: "Pax is required",
                    min: { value: 1, message: "Pax must be at least 1" },
                  })}
                  placeholder="Number of guests"
                  className={errors.pax ? errorInputClass : inputClass}
                />
                {errors.pax && (
                  <p className={errorClass}>{errors.pax.message}</p>
                )}
              </div>
              <div>
                <label className={requiredLabelClass}>
                  Loading Dock Details{requiredStar}
                </label>
                <textarea
                  {...register("loading_dock_notes", {
                    required: "Loading dock details are required",
                  })}
                  rows={2}
                  placeholder="Dock height, ramp access, street-load restrictions"
                  className={
                    errors.loading_dock_notes ? errorInputClass : inputClass
                  }
                />
                {errors.loading_dock_notes && (
                  <p className={errorClass}>
                    {errors.loading_dock_notes.message}
                  </p>
                )}
              </div>
              <div>
                <label className={requiredLabelClass}>
                  Safety Equipments{requiredStar}
                </label>
                <select
                  {...register("safety_precautions", {
                    required: "Safety equipments is required",
                  })}
                  className={
                    errors.safety_precautions ? errorInputClass : inputClass
                  }
                >
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
                {errors.safety_precautions && (
                  <p className={errorClass}>
                    {errors.safety_precautions.message}
                  </p>
                )}
              </div>
              <div>
                <label className={labelClass}>Parking Passes</label>
                <select {...register("parking_passes")} className={inputClass}>
                  <option value="">Select Option</option>
                  <option value="available">Available</option>
                  <option value="not_available">Not Available</option>
                </select>
              </div>
              <div>
                <label className={requiredLabelClass}>
                  ID/Pass needed{requiredStar}
                </label>
                <select
                  {...register("security_access", {
                    required: "ID/Pass needed is required",
                  })}
                  className={
                    errors.security_access ? errorInputClass : inputClass
                  }
                >
                  <option value="">Select Option</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
                {errors.security_access && (
                  <p className={errorClass}>{errors.security_access.message}</p>
                )}
              </div>

              {/* Additional Venues - Always visible */}
              <div className="md:col-span-2 space-y-6 pt-4">
                {(additionalVenues || []).map((venue, index) => (
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
                        <label className={requiredLabelClass}>
                          Venue Name{requiredStar}
                        </label>
                        <input
                          type="text"
                          value={venue?.venue_name || ""}
                          onChange={(e) =>
                            handleVenueChange(
                              index,
                              "venue_name",
                              e.target.value,
                            )
                          }
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
                          value={venue?.hall_name || ""}
                          onChange={(e) =>
                            handleVenueChange(
                              index,
                              "hall_name",
                              e.target.value,
                            )
                          }
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
                          value={venue?.venue_address || ""}
                          onChange={(e) =>
                            handleVenueChange(
                              index,
                              "venue_address",
                              e.target.value,
                            )
                          }
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
                          value={venue?.pax || ""}
                          onChange={(e) =>
                            handleVenueChange(index, "pax", e.target.value)
                          }
                          placeholder="Number of guests"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={requiredLabelClass}>
                          Loading Dock Details{requiredStar}
                        </label>
                        <textarea
                          value={venue?.loading_dock_notes || ""}
                          onChange={(e) =>
                            handleVenueChange(
                              index,
                              "loading_dock_notes",
                              e.target.value,
                            )
                          }
                          rows={2}
                          placeholder="Dock height, ramp access"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={requiredLabelClass}>
                          Safety Equipments{requiredStar}
                        </label>
                        <select
                          value={venue?.safety_precautions || ""}
                          onChange={(e) =>
                            handleVenueChange(
                              index,
                              "safety_precautions",
                              e.target.value,
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
                        <select
                          value={venue?.parking_passes || ""}
                          onChange={(e) =>
                            handleVenueChange(
                              index,
                              "parking_passes",
                              e.target.value,
                            )
                          }
                          className={inputClass}
                        >
                          <option value="">Select Option</option>
                          <option value="available">Available</option>
                          <option value="not_available">Not Available</option>
                        </select>
                      </div>
                      <div>
                        <label className={requiredLabelClass}>
                          ID/Pass needed{requiredStar}
                        </label>
                        <select
                          value={venue?.security_access || ""}
                          onChange={(e) =>
                            handleVenueChange(
                              index,
                              "security_access",
                              e.target.value,
                            )
                          }
                          className={inputClass}
                        >
                          <option value="">Select Option</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
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
                  {...register("contact_name", {
                    required: "Contact name is required",
                  })}
                  placeholder="Full Name"
                  className={errors.contact_name ? errorInputClass : inputClass}
                />
                {errors.contact_name && (
                  <p className={errorClass}>{errors.contact_name.message}</p>
                )}
              </div>
              <div>
                <label className={requiredLabelClass}>
                  Contact Role{requiredStar}
                </label>
                <select
                  {...register("contact_role", {
                    required: "Contact role is required",
                  })}
                  className={errors.contact_role ? errorInputClass : inputClass}
                >
                  <option value="">Select Role</option>
                  <option value="Project Manager">Project Manager</option>
                  <option value="AV Guy">AV Guy</option>
                  <option value="Tech Lead">Tech Lead</option>
                  <option value="Venue Manager">Venue Manager</option>
                  <option value="Client Lead">Client Lead</option>
                  <option value="Technical Manager">Technical Manager</option>
                </select>
                {errors.contact_role && (
                  <p className={errorClass}>{errors.contact_role.message}</p>
                )}
              </div>
              <div>
                <label className={requiredLabelClass}>
                  Phone{requiredStar}
                </label>
                <input
                  type="tel"
                  {...register("contact_mobile", {
                    required: "Phone number is required",
                  })}
                  placeholder="Phone number"
                  className={
                    errors.contact_mobile ? errorInputClass : inputClass
                  }
                />
                {errors.contact_mobile && (
                  <p className={errorClass}>{errors.contact_mobile.message}</p>
                )}
              </div>
              <div>
                <label className={labelClass}>Contact Email</label>
                <input
                  type="email"
                  {...register("contact_email", {
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  placeholder="Email address"
                  className={
                    errors.contact_email ? errorInputClass : inputClass
                  }
                />
                {errors.contact_email && (
                  <p className={errorClass}>{errors.contact_email.message}</p>
                )}
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
                <label className={labelClass}>Floor Plan Files</label>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.dwg"
                  onChange={(e) => {
                    setValue("floor_plans", Array.from(e.target.files));
                  }}
                  className={inputClass}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Select multiple files (PDF, images, CAD)
                </p>
              </div>
              <div>
                <label className={labelClass}>Agenda / Run of Show Files</label>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    setValue("agendas", Array.from(e.target.files));
                  }}
                  className={inputClass}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Select multiple files (PDF, documents)
                </p>
              </div>
            </div>
          </section>

          {/* Status Message - Above Buttons */}
          {(loading || formMessage) && (
            <div
              className={`p-3 rounded-lg border ${formMessage ? "bg-red-50 border-red-200" : "bg-blue-50 border-blue-200"}`}
            >
              <p
                className={`text-sm text-center ${formMessage ? "text-red-700" : "text-blue-700"}`}
              >
                {loading
                  ? "Creating event and uploading attachments..."
                  : formMessage}
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="flex-1 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div >
  );
}

export default CreateEvent;
