import { createContext, useContext, useState, useCallback } from "react";
import { searchEquipments } from "../utils/supabase";

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
        const trimmed = term.trim();

        if (trimmed === "") {
            setResults([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const data = await searchEquipments(term);
            setResults(data || []);
        } catch (err) {
            setError(err.message);
            console.error("Error searching equipments:", err);
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
