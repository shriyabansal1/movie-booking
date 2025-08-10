import React from "react";

export default function BookedSeatsList({ selectedTime, bookedThisTime }) {
  return (
    <div className="booked-list card">
      <h4>Booked seats for chosen time</h4>
      <div className="booked-items">
        {selectedTime
          ? bookedThisTime.length
            ? bookedThisTime.join(", ")
            : "No booked seats yet"
          : "Choose a time"}
      </div>
    </div>
  );
}
