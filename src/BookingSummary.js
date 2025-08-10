import React from "react";
import { getAreaForRow } from "./App";

export default function BookingSummary({
  selectedTime,
  selectedSeats,
  popcornQty,
  setPopcornQty,
  burgerQty,
  setBurgerQty,
  confirmBooking,
}) {
  const popcornPrice = 120;
  const burgerPrice = 160;

  const seatPrice = (seatLabel) => {
    const rowIdx = seatLabel.charCodeAt(0) - 65;
    return getAreaForRow(rowIdx).price;
  };

  const seatsTotal = selectedSeats.reduce((sum, s) => sum + seatPrice(s), 0);
  const foodTotal = popcornQty * popcornPrice + burgerQty * burgerPrice;
  const grandTotal = seatsTotal + foodTotal;

  return (
    <div className="summary-card">
      <h3>Booking Summary</h3>
      <div className="summary-row">
        <span>Time:</span>
        <span>{selectedTime || "—"}</span>
      </div>
      <div className="summary-row">
        <span>Selected seats:</span>
        <span>{selectedSeats.length ? selectedSeats.join(", ") : "None"}</span>
      </div>
      <div className="summary-row">
        <span>Seats total:</span>
        <span>₹{seatsTotal}</span>
      </div>

      <hr />

      <h4>Food & Add-ons</h4>
      <div className="food-control">
        <div className="food-item">
          <div>🍿 Popcorn (₹{popcornPrice})</div>
          <div className="qty-controls">
            <button onClick={() => setPopcornQty((q) => Math.max(0, q - 1))}>
              −
            </button>
            <div className="qty">{popcornQty}</div>
            <button onClick={() => setPopcornQty((q) => q + 1)}>+</button>
          </div>
        </div>

        <div className="food-item">
          <div>🍔 Burger (₹{burgerPrice})</div>
          <div className="qty-controls">
            <button onClick={() => setBurgerQty((q) => Math.max(0, q - 1))}>
              −
            </button>
            <div className="qty">{burgerQty}</div>
            <button onClick={() => setBurgerQty((q) => q + 1)}>+</button>
          </div>
        </div>
      </div>

      <hr />
      <div className="summary-row">
        <span>Food total:</span>
        <span>₹{foodTotal}</span>
      </div>
      <div className="summary-row grand">
        <span>Grand total:</span>
        <span>₹{grandTotal}</span>
      </div>

      <div className="actions">
        <button
          className="confirm-btn"
          onClick={confirmBooking}
          disabled={!selectedTime || selectedSeats.length === 0}
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
}
