import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import Button from "../../components/common/Button";

function ProjectManager() {
    const [activeTab, setActiveTab] = useState("upcoming");

    // Sample data - replace with actual data from database
    const tasks = {
        upcoming: [
            { id: 1, title: "Team Meeting", date: "Feb 27, 2026", time: "10:00 AM", status: "upcoming" },
            { id: 2, title: "Project Review", date: "Feb 28, 2026", time: "2:00 PM", status: "upcoming" },
            { id: 3, title: "Client Presentation", date: "Mar 1, 2026", time: "11:00 AM", status: "upcoming" },
        ],
        done: [
            { id: 4, title: "Sprint Planning", date: "Feb 20, 2026", time: "9:00 AM", status: "done" },
            { id: 5, title: "Budget Review", date: "Feb 18, 2026", time: "3:00 PM", status: "done" },
        ],
        pending: [
            { id: 6, title: "Equipment Maintenance", date: "Due: Mar 5, 2026", time: "", status: "pending" },
            { id: 7, title: "Report Submission", date: "Due: Mar 10, 2026", time: "", status: "pending" },
        ],
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "upcoming":
                return "bg-blue-100 text-blue-700";
            case "done":
                return "bg-green-100 text-green-700";
            case "pending":
                return "bg-yellow-100 text-yellow-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="p-6">
            {/* Quick Stats - Top */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <p className="text-sm text-gray-500">Active Projects</p>
                    <p className="text-2xl font-semibold text-gray-900">12</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <p className="text-sm text-gray-500">Pending Tasks</p>
                    <p className="text-2xl font-semibold text-gray-900">24</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <p className="text-sm text-gray-500">Team Members</p>
                    <p className="text-2xl font-semibold text-gray-900">8</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <p className="text-sm text-gray-500">Equipment Available</p>
                    <p className="text-2xl font-semibold text-gray-900">156</p>
                </div>
            </div>

            {/* Action Buttons - Compact horizontal row */}
            <div className="flex flex-wrap gap-3 mb-6">
                {/* Create Event */}
                <Link to="create">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">Create Event</span>
                    </button>
                </Link>

                {/* Reports */}
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">Reports</span>
                </button>

                {/* Search Equipment */}
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">Search Equipment</span>
                </button>
            </div>

            {/* Task List Section */}
            <div className="bg-white rounded-lg border border-gray-200">
                {/* Tabs */}
                <div className="flex border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab("upcoming")}
                        className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === "upcoming"
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        Upcoming
                    </button>
                    <button
                        onClick={() => setActiveTab("done")}
                        className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === "done"
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        Done
                    </button>
                    <button
                        onClick={() => setActiveTab("pending")}
                        className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === "pending"
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        Pending
                    </button>
                </div>

                {/* Task List */}
                <div className="p-4">
                    {tasks[activeTab].length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No tasks found</p>
                    ) : (
                        <div className="space-y-3">
                            {tasks[activeTab].map((task) => (
                                <div
                                    key={task.id}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${task.status === "upcoming" ? "bg-blue-500" :
                                            task.status === "done" ? "bg-green-500" : "bg-yellow-500"
                                            }`}></div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{task.title}</p>
                                            <p className="text-xs text-gray-500">
                                                {task.date} {task.time && `• ${task.time}`}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                                        {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProjectManager;
