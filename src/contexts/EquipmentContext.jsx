import { createContext, useContext, useState, useCallback } from "react";
import supabase from "../utils/supabase";

const EquipmentContext = createContext();

export const useEquipment = () => {
  const context = useContext(EquipmentContext);
  if (!context) {
    throw new Error("useEquipment must be used within an EquipmentProvider");
  }
  return context;
};

export const EquipmentProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = useCallback(async (term) => {
    setLoading(true);
    setError(null);

    try {
      if (!term || !term.trim()) {
        // Clear results when search is empty
        setResults([]);
      } else {
        // Search by term
        const { searchEquipments } = await import("../utils/supabase");
        const data = await searchEquipments(term);
        setResults(data || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm("");
    setResults([]);
    setError(null);
  }, []);

  const value = {
    searchTerm,
    setSearchTerm,
    results,
    loading,
    error,
    search,
    clearSearch,
  };

  return (
    <EquipmentContext.Provider value={value}>
      {children}
    </EquipmentContext.Provider>
  );
};

export default EquipmentContext;
