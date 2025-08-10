import React from "react";
import { rowLabel, getAreaForRow, AREA_MAP } from "./App";
import Seat from "./Seat";

export default function Theatre({
  rows,
  cols,
  selectedTime,
  bookings,
  selectedSeats,
  toggleSeat,
  hoverInfo,
  setHoverInfo,
  bookedThisTime,
}) {
  // build seatGrid
  const seatGrid = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 1; c <= cols; c++) {
      row.push(`${rowLabel(r)}${c}`);
    }
    seatGrid.push(row);
  }

  return (
    <section className="theatre-area">
      <div className="screen">SCREEN</div>

      <div className="legend">
        {AREA_MAP.map((a) => (
          <div key={a.name} className="legend-item">
            <div className="legend-swatch" style={{ background: a.color }} />
            <div className="legend-text">
              {a.name} — ₹{a.price}
            </div>
          </div>
        ))}
        <div className="legend-item">
          <div className="legend-swatch selected-swatch" />
          <div className="legend-text">Selected</div>
        </div>
        <div className="legend-item">
          <div className="legend-swatch booked-swatch" />
          <div className="legend-text">Booked</div>
        </div>
      </div>

      <div className="seating-grid-wrap">
        <div className="row-labels">
          {seatGrid.map((row, rIdx) => (
            <div key={rIdx} className="row-label">
              {rowLabel(rIdx)}
            </div>
          ))}
        </div>

        <div className="seating-grid" onMouseLeave={() => setHoverInfo(null)}>
          {seatGrid.map((row, rIdx) => (
            <div key={rIdx} className="seat-row">
              {row.map((label) => (
                <Seat
                  key={label}
                  label={label}
                  rowIndex={rIdx}
                  selectedSeats={selectedSeats}
                  toggleSeat={toggleSeat}
                  setHoverInfo={setHoverInfo}
                  bookedThisTime={bookedThisTime}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="hover-info">
        {hoverInfo ? (
          <div>
            <strong>{hoverInfo.label}</strong> • {hoverInfo.area.name} • ₹
            {hoverInfo.area.price}
          </div>
        ) : (
          <div>Hover a seat to see details</div>
        )}
      </div>
    </section>
  );
}
