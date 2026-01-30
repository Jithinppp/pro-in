import Home from "./pages/Home";
import Inventory from "./pages//inventory-manager/Inventory";
import Technicians from "./pages/technician/TechniciansDashboard";
import ProjectManager from "./pages/project-manager/project-manager";
import { Route, Routes } from "react-router-dom";

import { LoginProvider } from "./contexts/loginContext";

// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// const queryClient = new QueryClient();

function App() {
  return (
    <LoginProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/technicians" element={<Technicians />} />
        <Route path="/project-manager" element={<ProjectManager />} />
      </Routes>
    </LoginProvider>
  );
}

export default App;
