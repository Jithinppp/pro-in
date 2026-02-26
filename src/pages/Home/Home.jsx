import { Link } from "react-router-dom";

function Home() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Welcome to the App</h1>
      <p>Select a section:</p>
      <ul>
        <li><Link to="/pm">Project Manager</Link></li>
        <li><Link to="/tech">Tech</Link></li>
        <li><Link to="/inv">Inventory</Link></li>
      </ul>
    </div>
  );
}

export default Home;
