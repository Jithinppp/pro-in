import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { useContext, useEffect } from "react";
import { AuthContext } from "./contexts/AuthContext";
import { roleToRoute } from "./lib/supabase";
import Loader from "./components/common/Loader";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home/Home";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";

// PM Pages
import ProjectManager from "./pages/ProjectManager/ProjectManager";
import CreateEvent from "./pages/ProjectManager/CreateEvent";
import Reports from "./pages/ProjectManager/Reports";
import PMEvents from "./pages/ProjectManager/PMEvents";
import PMEquipments from "./pages/ProjectManager/PMEquipments";

// Tech Pages
import Tech from "./pages/Tech/Tech";
import TechEvents from "./pages/Tech/TechEvents";
import TechEquipments from "./pages/Tech/TechEquipments";

// Inventory Pages
import Inventory from "./pages/Inventory/Inventory";
import InvEquipments from "./pages/Inventory/InvEquipments";
import AddInventory from "./pages/Inventory/AddInventory";
import UpdateInventory from "./pages/Inventory/UpdateInventory";
import DeleteInventory from "./pages/Inventory/DeleteInventory";

function App() {
  const { user, loading, role } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect based on role when user logs in
  useEffect(() => {
    if (user && role && location.pathname === "/") {
      const redirectPath = roleToRoute[role];
      if (redirectPath) {
        navigate(redirectPath, { replace: true });
      }
    }
  }, [user, role, location.pathname, navigate]);

  if (loading) {
    return <Loader />;
  }

  const isAuthenticated = user && role;

  // If trying to access protected route without authentication, redirect to home
  const isProtectedRoute =
    location.pathname.startsWith("/pm") ||
    location.pathname.startsWith("/tech") ||
    location.pathname.startsWith("/inv");

  if (isProtectedRoute && !isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <Routes>
      {/* Home route - only accessible if not authenticated */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to={roleToRoute[role]} replace />
          ) : (
            <Home />
          )
        }
      />

      {/* Unauthorized page */}
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* PM Routes - Only PM can access */}
      <Route element={<Layout />}>
        <Route
          path="/pm"
          element={
            <ProtectedRoute allowedRoles="pm">
              <ProjectManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pm/create-event"
          element={
            <ProtectedRoute allowedRoles="pm">
              <CreateEvent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pm/reports"
          element={
            <ProtectedRoute allowedRoles="pm">
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pm/events"
          element={
            <ProtectedRoute allowedRoles="pm">
              <PMEvents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pm/equipments"
          element={
            <ProtectedRoute allowedRoles="pm">
              <PMEquipments />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Tech Routes - Only Tech can access */}
      <Route element={<Layout />}>
        <Route
          path="/tech"
          element={
            <ProtectedRoute allowedRoles="tech">
              <Tech />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tech/events"
          element={
            <ProtectedRoute allowedRoles="tech">
              <TechEvents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tech/equipments"
          element={
            <ProtectedRoute allowedRoles="tech">
              <TechEquipments />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Inventory Routes - Only Inv can access */}
      <Route element={<Layout />}>
        <Route
          path="/inv"
          element={
            <ProtectedRoute allowedRoles="inv">
              <Inventory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inv/equipments"
          element={
            <ProtectedRoute allowedRoles="inv">
              <InvEquipments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inv/add"
          element={
            <ProtectedRoute allowedRoles="inv">
              <AddInventory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inv/update"
          element={
            <ProtectedRoute allowedRoles="inv">
              <UpdateInventory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inv/delete"
          element={
            <ProtectedRoute allowedRoles="inv">
              <DeleteInventory />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function Root() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
