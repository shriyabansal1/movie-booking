import React from "react";
import { getAreaForRow } from "./App";

export default function Seat({
  label,
  rowIndex,
  selectedSeats,
  toggleSeat,
  setHoverInfo,
  bookedThisTime,
}) {
  const area = getAreaForRow(rowIndex);
  const booked = bookedThisTime.includes(label);
  const selected = selectedSeats.includes(label);
  const classes = ["seat"];
  if (booked) classes.push("booked");
  if (selected) classes.push("selected");

  return (
    <div
      className={classes.join(" ")}
      style={{
        background: booked ? undefined : selected ? undefined : area.color,
      }}
      onMouseEnter={() => setHoverInfo({ label, area })}
      onClick={() => toggleSeat(label)}
      title={`${label} — ${area.name} — ₹${area.price}${
        booked ? " (booked)" : ""
      }`}
    >
      <div className="seat-label">{label}</div>
    </div>
  );
}
