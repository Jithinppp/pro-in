import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchReportById, fetchEventById } from "../../utils/supabase";

function SingleReport() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [report, setReport] = useState(null);
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadReport = async () => {
            try {
                setLoading(true);
                const reportData = await fetchReportById(id);
                setReport(reportData);

                if (reportData?.event_id) {
                    const eventData = await fetchEventById(reportData.event_id);
                    setEvent(eventData);
                }
            } catch (err) {
                setError(err.message || "Failed to load report");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadReport();
        }
    }, [id]);

    const formatDate = (dateStr) => {
        if (!dateStr) return "—";
        return new Date(dateStr).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatDateOnly = (dateStr) => {
        if (!dateStr) return "—";
        return new Date(dateStr).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={() => navigate("/project-manager/reports")}
                        className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Reports
                    </button>
                </div>
            </div>
        );
    }

    if (!report) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">Report not found</p>
                    <button
                        onClick={() => navigate("/project-manager/reports")}
                        className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Reports
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 px-8 py-6">
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">
                            {report.title}
                        </h1>
                        <p className="text-gray-500 mt-1 text-sm">Report Details</p>
                    </div>
                    <button
                        onClick={() => navigate("/project-manager/reports")}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-150"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back
                    </button>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-8 py-8">
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 space-y-6">
                        {/* Report Type & Date */}
                        <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                            <div className="flex items-center gap-3">
                                <span
                                    className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getReportTypeColor(
                                        report.report_type
                                    )}`}
                                >
                                    {reportTypeLabels[report.report_type] || report.report_type}
                                </span>
                                <span className="text-gray-500 text-sm">
                                    Created: {formatDate(report.created_at)}
                                </span>
                            </div>
                        </div>

                        {/* Event Information */}
                        {event && (
                            <div className="border-b border-gray-100 pb-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <svg
                                        className="w-5 h-5 text-gray-400"
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
                                    <span className="text-gray-400 text-sm font-medium">Event</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-gray-500 text-xs">Event Name</p>
                                        <p className="font-medium text-gray-900">{event.event_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs">Client</p>
                                        <p className="font-medium text-gray-900">{event.client_name || "—"}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs">Date</p>
                                        <p className="font-medium text-gray-900">
                                            {formatDateOnly(event.event_start_date)}
                                            {event.event_end_date &&
                                                event.event_end_date !== event.event_start_date && (
                                                    <>
                                                        {" - "}
                                                        {formatDateOnly(event.event_end_date)}
                                                    </>
                                                )}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs">Venue</p>
                                        <p className="font-medium text-gray-900">
                                            {event.venue || "—"}
                                            {event.hall_name && ` · ${event.hall_name}`}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Report Content */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <svg
                                    className="w-5 h-5 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                                <span className="text-gray-400 text-sm font-medium">Report Content</span>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-gray-700 whitespace-pre-wrap">
                                    {report.content || "No content provided"}
                                </p>
                            </div>
                        </div>

                        {/* Timestamps */}
                        <div className="pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-4 text-xs text-gray-400">
                                <span>Report ID: {report.id}</span>
                                {report.updated_at && report.updated_at !== report.created_at && (
                                    <span>Last updated: {formatDate(report.updated_at)}</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SingleReport;
