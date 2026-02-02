import Home from "./pages/Home";
import Inventory from "./pages//inventory-manager/Inventory";
import Technicians from "./pages/technician/TechniciansDashboard";
import ProjectManager from "./pages/project-manager/project-manager";
import Events from "./pages/Events/Events";
import { Route, Routes } from "react-router-dom";

import { LoginProvider } from "./contexts/loginContext";
import Equipment from "./pages/Equipment/Equipment";

// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// const queryClient = new QueryClient();

function App() {
  return (
    <LoginProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pm" element={<ProjectManager />} />
        <Route path="/inv" element={<Inventory />} />
        <Route path="/tech" element={<Technicians />} />
        <Route path="/events" element={<Events />} />
        <Route path="/equipment/:id" element={<Equipment />} />
      </Routes>
    </LoginProvider>
  );
}

export default App;
