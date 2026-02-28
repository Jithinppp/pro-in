import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/style.css";

export default function DatePicker({
  value,
  onChange,
  minDate,
  maxDate,
  placeholder = "Select date",
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Initialize selected date from value
  const selected = value ? new Date(value) : null;

  const handleSelect = (date) => {
    if (date) {
      const formatted = format(date, "yyyy-MM-dd");
      onChange(formatted);
    }
    setIsOpen(false);
  };

  // Build modifiers for disabled dates
  const disabledDays = [];
  if (minDate) {
    disabledDays.push({ before: new Date(minDate) });
  }
  if (maxDate) {
    disabledDays.push({ after: new Date(maxDate) });
  }

  return (
    <div className="relative">
      <input
        type="text"
        readOnly
        value={selected ? format(selected, "MMM dd, yyyy") : ""}
        placeholder={placeholder}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      />

      {isOpen && (
        <div className="absolute z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2">
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={handleSelect}
            disabled={disabledDays}
            className="rdp-custom"
          />
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}
