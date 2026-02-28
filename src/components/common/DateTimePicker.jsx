import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/style.css";

export default function DateTimePicker({
  value,
  onChange,
  maxDate,
  placeholder = "Select date and time",
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Parse value into date and time
  const getInitialDate = () => {
    if (value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
    return null;
  };

  const [selectedDate, setSelectedDate] = useState(getInitialDate);
  const [selectedTime, setSelectedTime] = useState(() => {
    if (value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
      }
    }
    return "09:00";
  });

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    if (date) {
      // Combine date with time
      const [hours, minutes] = selectedTime.split(":");
      date.setHours(parseInt(hours), parseInt(minutes));
      const formatted = format(date, "yyyy-MM-dd'T'HH:mm");
      onChange(formatted);
    }
    setIsOpen(false);
  };

  const handleTimeChange = (e) => {
    const time = e.target.value;
    setSelectedTime(time);

    if (selectedDate) {
      const [hours, minutes] = time.split(":");
      const newDate = new Date(selectedDate);
      newDate.setHours(parseInt(hours), parseInt(minutes));
      const formatted = format(newDate, "yyyy-MM-dd'T'HH:mm");
      onChange(formatted);
    }
  };

  // Build disabled days
  const disabledDays = [];
  if (maxDate) {
    disabledDays.push({ after: new Date(maxDate) });
  }

  return (
    <div className="relative">
      <input
        type="text"
        readOnly
        value={
          selectedDate
            ? `${format(selectedDate, "MMM dd, yyyy")} ${selectedTime}`
            : ""
        }
        placeholder={placeholder}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      />

      {isOpen && (
        <div className="absolute z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={disabledDays}
            className="rdp-custom"
          />
          <div className="mt-2 pt-2 border-t border-gray-200">
            <label className="text-sm text-gray-500 block mb-1">Time</label>
            <input
              type="time"
              value={selectedTime}
              onChange={handleTimeChange}
              className="w-full px-2 py-1 border border-gray-300 rounded"
            />
          </div>
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}
