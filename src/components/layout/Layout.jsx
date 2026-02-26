import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import Button from "../common/Button";

function Layout() {
  const { user, loading, role, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Show nothing while loading or if no user
  if (loading || !user) {
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
      inv: "Inventory Manager",
    };
    return roleNames[role] || role;
  };

  // Get current date with short month
  const getCurrentDate = () => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date().toLocaleDateString("en-US", options);
  };

  // Check if in nested route
  const isNestedRoute = () => {
    const path = location.pathname;
    const baseRoutes = ["/pm", "/tech", "/inv"];
    const base = baseRoutes.find((route) => path.startsWith(route));
    if (!base) return false;
    return path.split("/").length > base.split("/").length;
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center h-auto sm:h-20 py-3 sm:py-0">
            {/* Left side - Welcome message and Date */}
            <div className="shrink-0">
              <div>
                <span className="text-xl font-medium text-gray-900">
                  Hello, {role ? getRoleDisplay(role) : "User"}
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-500">
                  {getCurrentDate()}
                </span>
              </div>
            </div>

            {/* Right side - Back button and Logout (stacks on mobile) */}
            <div className="shrink-0 flex flex-row items-center gap-3 mt-3 sm:mt-0">
              {isNestedRoute() && (
                <Button
                  onClick={handleGoBack}
                  variant="secondary"
                  className="py-2! px-4!"
                >
                  <svg
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Back
                </Button>
              )}
              <Button
                onClick={handleLogout}
                variant="danger"
                className="py-2! px-4!"
              >
                <svg
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
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
