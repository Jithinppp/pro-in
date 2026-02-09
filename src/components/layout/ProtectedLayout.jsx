// src/components/layout/NavbarLayout.jsx
import { Outlet, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import AuthContext from "../../contexts/AuthContext";

function ProtectedLayout() {
  // protected route logic here
  const { currentUser, loading } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !currentUser?.isLoggedIn) {
      navigate("/", { replace: true });
    }
  }, [loading, currentUser, navigate]);

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

  return <Outlet />;
}

export default ProtectedLayout;
