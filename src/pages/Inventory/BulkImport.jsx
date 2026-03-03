import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { fetchCategories, fetchModelsByCategory, createBulkAssets } from "../../lib/supabase";

function BulkImport() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [models, setModels] = useState([]);
    const [csvData, setCsvData] = useState([]);
    const [csvError, setCsvError] = useState("");
    const [importing, setImporting] = useState(false);
    const [importProgress, setImportProgress] = useState(0);
    const [importResult, setImportResult] = useState(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState("");
    const [selectedModelId, setSelectedModelId] = useState("");

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        const result = await fetchCategories();
        if (result.success) {
            setCategories(result.categories);
        }
    };

    const handleCategoryChange = async (categoryId) => {
        setSelectedCategoryId(categoryId);
        setSelectedModelId("");
        setModels([]);

        if (categoryId) {
            const result = await fetchModelsByCategory(parseInt(categoryId));
            if (result.success) {
                setModels(result.models);
            }
        }
    };

    const handleModelChange = (modelId) => {
        setSelectedModelId(modelId);
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;
            parseCSV(text);
        };
        reader.readAsText(file);
    };

    const parseCSV = (text) => {
        setCsvError("");
        const lines = text.split("\n").filter((line) => line.trim());

        if (lines.length < 2) {
            setCsvError("CSV file must have at least a header row and one data row");
            return;
        }

        const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());

        // Required columns
        const requiredColumns = ["serial_number"];
        const missingColumns = requiredColumns.filter((col) => !headers.includes(col));

        if (missingColumns.length > 0) {
            setCsvError(`Missing required columns: ${missingColumns.join(", ")}`);
            return;
        }

        const data = [];
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(",").map((v) => v.trim());
            const row = {};
            headers.forEach((header, index) => {
                row[header] = values[index] || "";
            });
            data.push(row);
        }

        setCsvData(data);
    };

    const handleImport = async () => {
        if (!selectedCategoryId || !selectedModelId) {
            setCsvError("Please select category and model");
            return;
        }

        if (csvData.length === 0) {
            setCsvError("Please upload a CSV file first");
            return;
        }

        setImporting(true);
        setImportProgress(0);
        setImportResult(null);

        const result = await createBulkAssets(
            csvData,
            parseInt(selectedCategoryId),
            parseInt(selectedModelId),
            (progress) => setImportProgress(progress)
        );

        setImporting(false);
        setImportResult(result);

        if (result.success) {
            setImportProgress(100);
        }
    };

    const downloadTemplate = () => {
        const template = "serial_number,supplier_name,invoice_number,purchase_date,purchase_price,description\nSN001,SupplierName,INV001,2024-01-01,100.00,Description here\nSN002,SupplierName,INV002,2024-01-02,150.00,Another description";
        const blob = new Blob([template], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "inventory_template.csv";
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="p-4 md:p-6">
            <div className="bg-white rounded-lg border border-gray-200 max-w-full">
                <div className="p-4 border-gray-200">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">
                            Bulk Import Inventory
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Upload a CSV file to import multiple items at once
                        </p>
                    </div>
                </div>
            </div>

            <div className=" mt-2 space-y-6">
                {/* Download Template */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div>
                        <p className="text-sm font-medium text-blue-900">
                            Download CSV Template
                        </p>
                        <p className="text-xs text-blue-700 mt-1">
                            Required column: serial_number
                        </p>
                    </div>
                    <button
                        onClick={downloadTemplate}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                        Download Template
                    </button>
                </div>

                {/* Category and Model Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={selectedCategoryId}
                            onChange={(e) => handleCategoryChange(e.target.value)}
                            className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name} ({cat.code})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Model <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={selectedModelId}
                            onChange={(e) => handleModelChange(e.target.value)}
                            disabled={!selectedCategoryId}
                            className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:opacity-50"
                        >
                            <option value="">Select Model</option>
                            {models.map((model) => (
                                <option key={model.id} value={model.id}>
                                    {model.brand} - {model.name} ({model.brand_code})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* File Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Upload CSV File <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileUpload}
                        className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                </div>

                {/* CSV Error */}
                {csvError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-700">{csvError}</p>
                    </div>
                )}

                {/* Preview Data */}
                {csvData.length > 0 && (
                    <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">
                            Preview ({csvData.length} items)
                        </h3>
                        <div className="overflow-x-auto border border-gray-200 rounded-lg">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-3 py-2 text-left font-medium text-gray-600">
                                            Serial Number
                                        </th>
                                        <th className="px-3 py-2 text-left font-medium text-gray-600">
                                            Supplier
                                        </th>
                                        <th className="px-3 py-2 text-left font-medium text-gray-600">
                                            Invoice
                                        </th>
                                        <th className="px-3 py-2 text-left font-medium text-gray-600">
                                            Purchase Date
                                        </th>
                                        <th className="px-3 py-2 text-left font-medium text-gray-600">
                                            Price
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {csvData.slice(0, 5).map((row, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-3 py-2">{row.serial_number}</td>
                                            <td className="px-3 py-2">{row.supplier_name || "-"}</td>
                                            <td className="px-3 py-2">{row.invoice_number || "-"}</td>
                                            <td className="px-3 py-2">{row.purchase_date || "-"}</td>
                                            <td className="px-3 py-2">{row.purchase_price || "-"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {csvData.length > 5 && (
                                <div className="p-2 bg-gray-50 text-center text-xs text-gray-500">
                                    ... and {csvData.length - 5} more items
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Progress Bar */}
                {importing && (
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">
                                Importing...
                            </span>
                            <span className="text-sm text-gray-500">
                                {importProgress}%
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${importProgress}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                {/* Import Result */}
                {importResult && (
                    <div
                        className={`p-3 rounded-lg border ${importResult.success
                            ? "bg-green-50 border-green-200"
                            : "bg-red-50 border-red-200"
                            }`}
                    >
                        <p
                            className={`text-sm ${importResult.success ? "text-green-700" : "text-red-700"
                                }`}
                        >
                            {importResult.success
                                ? `Successfully imported ${importResult.count} items!`
                                : importResult.error}
                        </p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                    <button
                        type="button"
                        onClick={() => navigate("/inv")}
                        className="flex-1 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleImport}
                        disabled={importing || csvData.length === 0 || !selectedCategoryId || !selectedModelId}
                        className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50"
                    >
                        {importing ? "Importing..." : `Import ${csvData.length} Items`}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default BulkImport;
