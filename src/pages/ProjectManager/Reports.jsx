import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchEvents, createReport, fetchReports, deleteReport } from "../../utils/supabase";

function Reports() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [reports, setReports] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    report_type: "general",
    content: "",
  });

  useEffect(() => {
    loadEvents();
    loadReports();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await fetchEvents();
      setEvents(data || []);
    } catch (err) {
      console.error("Error loading events:", err);
    }
  };

  const loadReports = async () => {
    try {
      setLoading(true);
      const data = await fetchReports();
      setReports(data || []);
    } catch (err) {
      console.error("Error loading reports:", err);
      setError("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    if (!selectedEvent) {
      setError("Please select an event");
      setSubmitting(false);
      return;
    }

    try {
      await createReport({
        event_id: selectedEvent,
        title: formData.title,
        report_type: formData.report_type,
        content: formData.content,
      });

      setSuccess("Report created successfully!");
      setFormData({ title: "", report_type: "general", content: "" });
      setSelectedEvent("");
      loadReports();
    } catch (err) {
      setError(err.message || "Failed to create report");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (!window.confirm("Are you sure you want to delete this report?")) {
      return;
    }

    try {
      await deleteReport(reportId);
      loadReports();
    } catch (err) {
      setError(err.message || "Failed to delete report");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const reportTypeLabels = {
    general: "General",
    technical: "Technical",
    incident: "Incident",
    feedback: "Feedback",
    summary: "Summary",
  };

  const getReportTypeColor = (type) => {
    const colors = {
      general: "bg-gray-100 text-gray-700",
      technical: "bg-blue-100 text-blue-700",
      incident: "bg-red-100 text-red-700",
      feedback: "bg-green-100 text-green-700",
      summary: "bg-purple-100 text-purple-700",
    };
    return colors[type] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-8 py-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
            <p className="text-gray-500 mt-1 text-sm">
              Create and view event reports
            </p>
          </div>
          <button
            onClick={() => navigate("/project-manager")}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-150"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-6 space-y-6">
        {/* Navigation */}
        <div className="flex gap-2 flex-wrap items-center">
          <button
            onClick={() => navigate("/project-manager/events")}
            className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-150"
          >
            Events
          </button>
          <button
            onClick={() => navigate("/project-manager/equipment")}
            className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-150"
          >
            Equipment
          </button>
        </div>

        {/* Success Message */}
        {success && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Create Report Form */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Create New Report
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Event Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Event <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="">Select an event</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.event_name} - {event.client_name} ({formatDate(event.event_start_date)})
                  </option>
                ))}
              </select>
            </div>

            {/* Report Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Report Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Enter report title"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Report Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Report Type <span className="text-red-500">*</span>
              </label>
              <select
                name="report_type"
                value={formData.report_type}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="general">General</option>
                <option value="technical">Technical</option>
                <option value="incident">Incident</option>
                <option value="feedback">Feedback</option>
                <option value="summary">Summary</option>
              </select>
            </div>

            {/* Report Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Report Content
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={5}
                placeholder="Enter report details..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Creating..." : "Create Report"}
              </button>
            </div>
          </form>
        </div>

        {/* Reports List */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            All Reports
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>No reports yet</p>
              <p className="text-sm mt-1">Create a report using the form above</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/project-manager/report/${report.id}`)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium text-gray-900 hover:text-blue-600 transition-colors">
                          {report.title}
                        </h3>
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded-full ${getReportTypeColor(
                            report.report_type
                          )}`}
                        >
                          {reportTypeLabels[report.report_type] || report.report_type}
                        </span>
                      </div>
                      {report.event && (
                        <p className="text-sm text-gray-500 mb-2">
                          Event: {report.event.event_name} - {report.event.client_name}
                        </p>
                      )}
                      {report.content && (
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {report.content}
                        </p>
                      )}
                      <p className="text-xs text-gray-400">
                        Created: {formatDate(report.created_at)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteReport(report.id)}
                      className="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-150"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Reports;
