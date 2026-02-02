import React, { useContext, useEffect, useState } from "react";
import { MdEventAvailable } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import LoginContext from "../../contexts/loginContext";
import { searchEquipments } from "../../utils/supabase";
import Card from "../../components/Card";

function TechniciansDashboard() {
  const { currentUser, loading, logout } = useContext(LoginContext);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // Protect route
  useEffect(() => {
    if (!loading && !currentUser?.isLoggedIn) {
      navigate("/", { replace: true });
    }
  }, [currentUser, loading, navigate]);

  // Debounced search
  useEffect(() => {
    const trimmed = searchTerm.trim();

    // ✅ if input is empty → reset EVERYTHING immediately
    if (trimmed === "") {
      setResults([]);
      setSearchLoading(false);
      return;
    }
    setSearchLoading(true);

    const timer = setTimeout(async () => {
      try {
        const data = await searchEquipments(searchTerm);
        // console.log(data);
        setResults(data);
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setSearchLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  if (loading)
    return <p className="text-center mt-20">Checking authentication...</p>;
  if (!currentUser?.isLoggedIn) return null;

  return (
    <div className="sm:px-10 px-2">
      {/* Header */}
      <div className="flex justify-between items-center mt-20">
        <div className="flex flex-col">
          <h1 className="text-5xl font-bold tracking-[-3px]">Hi there,</h1>
          <p className="font-thin text-2xl tracking-normal">
            {currentUser.user.email}
          </p>
        </div>
        <button
          onClick={logout}
          className="cursor-pointer rounded-md hover:text-gray-600 transition-colors duration-200"
        >
          Logout
        </button>
      </div>

      {/* Upcoming events */}
      <Link
        to={"/events"}
        className="max-w-fit block border-2 border-blue-200 mt-10 p-5 rounded-lg cursor-pointer hover:bg-[#f3f3e9] transition-all duration-200"
      >
        <p className="font-extrabold text-lg tracking-tight">
          Upcoming events
          <MdEventAvailable size={20} className="inline-block ml-1" />
        </p>
        <p className="font-light text-sm text-gray-600">
          See all the details of upcoming events assigned to you
        </p>
      </Link>

      {/* Search bar */}
      <div className="mt-10">
        <input
          type="text"
          placeholder="Search equipments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-100"
        />
      </div>

      {/* Results */}
      <div className="mt-10">
        {searchLoading ? (
          <p className="text-gray-500">Loading...</p>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((item) => (
              <Card key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No results found</p>
        )}
      </div>
    </div>
  );
}

export default TechniciansDashboard;
