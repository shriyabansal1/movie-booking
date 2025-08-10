import React from "react";

export default function Header({ selectedTime, onTimeChange, onReset }) {
  return (
    <header className="topbar">
      <div className="title">🎬 Grand Cinema — Book Your Seat</div>
      <div className="controls">
        <label className="time-label">
          Movie Time:
          <select
            value={selectedTime}
            onChange={(e) => onTimeChange(e.target.value)}
          >
            <option value="">-- Select Time --</option>
            <option value="10:00 AM">10:00 AM</option>
            <option value="1:00 PM">1:00 PM</option>
            <option value="4:00 PM">4:00 PM</option>
            <option value="7:00 PM">7:00 PM</option>
            <option value="10:00 PM">10:00 PM</option>
          </select>
        </label>

        <button className="reset-btn" onClick={onReset}>
          Reset All
        </button>
      </div>
    </header>
  );
}
