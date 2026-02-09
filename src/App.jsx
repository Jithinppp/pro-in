// packs
import { Outlet, Route, Routes } from "react-router-dom";

// pages
import Home from "./pages/Home/Home";
import ProtectedLayout from "./components/layout/ProtectedLayout";

import InventoryDashboard from "./pages/Inventory/InventoryDashboard";
import EditEquipment from "./pages/Inventory/EditEquipment";
import AddEquipment from "./pages/Inventory/AddEquipment";

import PMDashboard from "./pages/ProjectManager/PMDashboard";
import CreateEvent from "./pages/ProjectManager/CreateEvent";
import EquipmentList from "./pages/ProjectManager/EquipmentList";
import PMEvents from "./pages/ProjectManager/PMEvents";
import Reports from "./pages/ProjectManager/Reports";

import TechDashboard from "./pages/Tech/TechDashboard";
import SearchEquipment from "./pages/Tech/SearchEquipment";
import TechEvent from "./pages/Tech/TechEvent";
import TechEvents from "./pages/Tech/TechEvents";

import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* /inventory */}
        <Route element={<ProtectedLayout />}>
          <Route path="inventory">
            <Route index element={<InventoryDashboard />} />
            <Route path="add" element={<AddEquipment />} />
            <Route path="edit" element={<EditEquipment />} />
          </Route>

          {/* /project-manager */}
          <Route path="project-manager">
            <Route index element={<PMDashboard />} />
            <Route path="create" element={<CreateEvent />} />
            <Route path="equipments" element={<EquipmentList />} />
            <Route path="events" element={<PMEvents />} />
            <Route path="reports" element={<Reports />} />
          </Route>

          {/* /tech */}
          <Route path="tech">
            <Route index element={<TechDashboard />} />
            <Route path="events" element={<TechEvents />} />
            <Route path="event" element={<TechEvent />} />
            <Route path="equipment" element={<SearchEquipment />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
