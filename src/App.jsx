// packs
import { Outlet, Route, Routes } from "react-router-dom";

// pages
import Home from "./pages/Home/Home";
import ProtectedLayout from "./components/layout/ProtectedLayout";

import InventoryDashboard from "./pages/Inventory/InventoryDashboard";
import EditEquipment from "./pages/Inventory/EditEquipment";
import AddEquipment from "./pages/Inventory/AddEquipment";
import Equipments from "./pages/Inventory/Equipments";

import PMDashboard from "./pages/ProjectManager/PMDashboard";
import CreateEvent from "./pages/ProjectManager/CreateEvent";
import EquipmentList from "./pages/ProjectManager/EquipmentList";
import Equipment from "./pages/ProjectManager/Equipment";
import PMEvents from "./pages/ProjectManager/PMEvents";
import SingleEvent from "./pages/ProjectManager/SingleEvent";
import AssignEquipments from "./pages/ProjectManager/AssignEquipments";
import Reports from "./pages/ProjectManager/Reports";
import SingleReport from "./pages/ProjectManager/SingleReport";

import TechDashboard from "./pages/Tech/TechDashboard";
import SearchEquipment from "./pages/Tech/SearchEquipment";
import TechEvent from "./pages/Tech/TechEvent";
import TechEvents from "./pages/Tech/TechEvents";
import NotFound from "./pages/NotFound";

import { AuthProvider } from "./contexts/AuthContext";
import { EquipmentProvider } from "./contexts/EquipmentContext";

function App() {
  return (
    <AuthProvider>
      <EquipmentProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* /inventory - only accessible by "inv" role */}
          <Route element={<ProtectedLayout allowedRoles={["inv"]} />}>
            <Route path="inventory">
              <Route index element={<InventoryDashboard />} />
              <Route path="equipments" element={<Equipments />} />
              <Route path="equipment/:id" element={<EditEquipment />} />
              <Route path="add" element={<AddEquipment />} />
              <Route path="edit" element={<EditEquipment />} />
            </Route>
          </Route>

          {/* /project-manager - only accessible by "pm" role */}
          <Route element={<ProtectedLayout allowedRoles={["pm"]} />}>
            <Route path="project-manager">
              <Route index element={<PMDashboard />} />
              <Route path="create" element={<CreateEvent />} />
              <Route path="equipments" element={<EquipmentList />} />
              <Route path="equipment/:id" element={<Equipment />} />
              <Route path="events" element={<PMEvents />} />
              <Route path="event/:id" element={<SingleEvent />} />
              <Route path="events/:eventId/assign" element={<AssignEquipments />} />
              <Route path="reports" element={<Reports />} />
              <Route path="report/:id" element={<SingleReport />} />
            </Route>
          </Route>

          {/* /tech - only accessible by "tech" role */}
          <Route element={<ProtectedLayout allowedRoles={["tech"]} />}>
            <Route path="tech">
              <Route index element={<TechDashboard />} />
              <Route path="events" element={<TechEvents />} />
              <Route path="event/:id" element={<TechEvent />} />
              <Route path="equipment/:id" element={<SearchEquipment />} />
              <Route path="equipment" element={<SearchEquipment />} />
            </Route>
          </Route>

          {/* 404 - Catch all unmatched routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </EquipmentProvider>
    </AuthProvider>
  );
}

export default App;
