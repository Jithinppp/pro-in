import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import Loader from "./common/Loader";

/**
 * ProtectedRoute - Protects routes based on authentication and roles
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render
 * @param {string|string[]} [props.allowedRoles] - Role(s) allowed to access this route
 */
function ProtectedRoute({ children, allowedRoles }) {
  const { user, role, loading } = useContext(AuthContext);
  const location = useLocation();

  // Show loader while checking auth status
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Role is required but user has none - redirect to unauthorized
  if (!role) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check if user has allowed role
  if (allowedRoles) {
    const allowed = Array.isArray(allowedRoles)
      ? allowedRoles.includes(role)
      : allowedRoles === role;

    if (!allowed) {
      // User doesn't have the right role - redirect to their dashboard
      const roleRoutes = {
        pm: "/pm",
        tech: "/tech",
        inv: "/inv",
      };
      return <Navigate to={roleRoutes[role] || "/"} replace />;
    }
  }

  return children;
}

export default ProtectedRoute;
