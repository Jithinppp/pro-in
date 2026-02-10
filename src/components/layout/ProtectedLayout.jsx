// src/components/layout/ProtectedLayout.jsx
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useContext, useEffect } from "react";
import AuthContext from "../../contexts/AuthContext";

function ProtectedLayout({ allowedRoles }) {
  const { currentUser, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !currentUser?.isLoggedIn) {
      navigate("/", { replace: true });
      return;
    }

    // Check role-based access
    if (!loading && currentUser?.isLoggedIn && allowedRoles) {
      const userRole = currentUser.roleData;
      if (!allowedRoles.includes(userRole)) {
        // Redirect based on user's role
        switch (userRole) {
          case "pm":
            navigate("/project-manager", { replace: true });
            break;
          case "tech":
            navigate("/tech", { replace: true });
            break;
          case "inv":
            navigate("/inventory", { replace: true });
            break;
          default:
            navigate("/", { replace: true });
        }
      }
    }
  }, [loading, currentUser, navigate, allowedRoles, location]);

  // Show nothing while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  // Don't render protected content if not logged in
  if (!currentUser?.isLoggedIn) {
    return null;
  }

  // If roles are specified and user doesn't have required role, don't render
  if (allowedRoles && !allowedRoles.includes(currentUser.roleData)) {
    return null;
  }

  return <Outlet />;
}

export default ProtectedLayout;
