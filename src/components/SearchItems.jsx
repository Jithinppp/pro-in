import React, { useEffect, useState } from "react";
import supabase from "../utils/supabase";

function SearchItems() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!search) {
      setResults([]);
      console.log("cascading render");
      return;
    }
    const timeout = setTimeout(async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("equipments")
        .select("*")
        .ilike("product_name", `%${search}%`); // case-insensitive

      if (!error) {
        setResults(data);
      }

      setLoading(false);
    }, 400); // debounce delay
    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <div>
      <h1>Search items</h1>
      <input
        type="text"
        placeholder="Search item..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: "100%", padding: "8px" }}
      />
      {loading && <p>Searching...</p>}

      {!loading && search && results.length === 0 && <p>❌ Item not found</p>}
      <ul>
        {results.map((item) => (
          <li key={item.id}>✅ {item.product_name}</li>
        ))}
      </ul>
    </div>
  );
}

export default SearchItems;
