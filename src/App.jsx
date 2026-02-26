import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import ProjectManager from "./pages/ProjectManager/ProjectManager"
import Tech from "./pages/Tech/Tech"
import Inventory from "./pages/Inventory/Inventory"


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/pm" element={<ProjectManager />} />
      <Route path="/tech" element={<Tech />} />
      <Route path="/inv" element={<Inventory />} />
    </Routes>
  );
}

export default App;
