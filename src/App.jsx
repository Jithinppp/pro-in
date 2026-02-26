import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Loader from "./components/common/Loader";
import Layout from "./components/layout/Layout";

import Home from "./pages/Home/Home";
import NotFound from "./pages/NotFound";

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
  const { user, loading, role, getRedirectRoute } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader />;
  }

  const isAuthenticated = user && role;
  const redirectPath = isAuthenticated ? getRedirectRoute() : null;

  // If on home page and authenticated, redirect to role-based route
  if (location.pathname === "/" && redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }

  return (
    <Routes>
      {/* Home route - only accessible if not authenticated */}
      <Route
        path="/"
        element={isAuthenticated ? <Navigate to={redirectPath} replace /> : <Home />}
      />

      {/* PM Routes */}
      <Route element={<Layout />}>
        <Route path="/pm" element={<ProjectManager />} />
        <Route path="/pm/create" element={<CreateEvent />} />
        <Route path="/pm/reports" element={<Reports />} />
        <Route path="/pm/events" element={<PMEvents />} />
        <Route path="/pm/equipments" element={<PMEquipments />} />
      </Route>

      {/* Tech Routes */}
      <Route element={<Layout />}>
        <Route path="/tech" element={<Tech />} />
        <Route path="/tech/events" element={<TechEvents />} />
        <Route path="/tech/equipments" element={<TechEquipments />} />
      </Route>

      {/* Inventory Routes */}
      <Route element={<Layout />}>
        <Route path="/inv" element={<Inventory />} />
        <Route path="/inv/equipments" element={<InvEquipments />} />
        <Route path="/inv/add" element={<AddInventory />} />
        <Route path="/inv/update" element={<UpdateInventory />} />
        <Route path="/inv/delete" element={<DeleteInventory />} />
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
