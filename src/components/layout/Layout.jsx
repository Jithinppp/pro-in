import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Button from "../common/Button";

function Layout() {
    const { user, loading, role, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [checking, setChecking] = useState(true);

    // If no user is logged in, redirect to home
    if (!user) {
        return null;
    }

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    const getRoleDisplay = (role) => {
        const roleNames = {
            pm: "Project Manager",
            tech: "Tech",
            inv: "Inventory Manager"
        };
        return roleNames[role] || role;
    };

    // Get current date
    const getCurrentDate = () => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date().toLocaleDateString('en-US', options);
    };

    return (
        <div className="min-h-screen">
            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Left side - Welcome message and Date */}
                        <div className="flex-shrink-0">
                            <div>
                                <span className="text-xl font-medium text-gray-900">
                                    Welcome back, {role ? getRoleDisplay(role) : "User"}
                                </span>
                            </div>
                            <div>
                                <span className="text-sm text-gray-500">
                                    {getCurrentDate()}
                                </span>
                            </div>
                        </div>

                        {/* Right side - Logout button */}
                        <div className="flex-shrink-0">
                            <Button onClick={handleLogout} variant="secondary">
                                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main content */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;
