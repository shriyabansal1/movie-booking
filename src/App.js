import React, { useEffect, useState } from "react";
import "./App.css";

const ROWS = 12; // A-L
const COLS = 14; // seats per row

// Areas divided according to price
const AREA_MAP = [
  { name: "Platinum", rows: [0, 1], price: 400, color: "#FFD700" },
  { name: "Gold", rows: [2, 3, 4, 5], price: 300, color: "#FFB347" },
  { name: "Silver", rows: [6, 7, 8, 9, 10, 11], price: 200, color: "#C0C0C0" }, // G-L
];

function rowLabel(index) {
  return String.fromCharCode(65 + index); // 0 -> 'A'
}

function getAreaForRow(rowIndex) {
  for (const area of AREA_MAP) {
    if (area.rows.includes(rowIndex)) return area;
  }
  return AREA_MAP[AREA_MAP.length - 1];
}

// Load saved bookings: { "movieId|time": ["A1","B4", ...] }
const STORAGE_KEY = "theatre_bookings_v1";

export default function App() {
  const [bookings, setBookings] = useState(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      return s ? JSON.parse(s) : {};
    } catch {
      return {};
    }
  });

  // Current movie/time identification (we just use a single movie but different times)
  const [selectedTime, setSelectedTime] = useState("");
  const bookingKey = (time) => `mainmovie|${time || "no-time"}`;

  // Seats selected right now (not yet confirmed)
  const [selectedSeats, setSelectedSeats] = useState([]);

  // Food quantities
  const [popcornQty, setPopcornQty] = useState(0);
  const [burgerQty, setBurgerQty] = useState(0);

  // UI helpers
  const [hoverInfo, setHoverInfo] = useState(null);

  // Persist bookings to localStorage when bookings change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  }, [bookings]);

  // booked seats
  const bookedThisTime = bookings[bookingKey(selectedTime)] || [];

  function toggleSeat(seatLabel) {
    if (!selectedTime) {
      alert("Please select a movie time first.");
      return;
    }
    if (bookedThisTime.includes(seatLabel)) return; // already booked

    setSelectedSeats((prev) =>
      prev.includes(seatLabel)
        ? prev.filter((s) => s !== seatLabel)
        : [...prev, seatLabel]
    );
  }

  function confirmBooking() {
    if (!selectedTime) {
      alert("Select a movie time before confirming.");
      return;
    }
    if (selectedSeats.length === 0) {
      alert("Pick at least one seat.");
      return;
    }
    const key = bookingKey(selectedTime);
    setBookings((prev) => {
      const already = prev[key] || [];
      const merged = Array.from(new Set([...already, ...selectedSeats]));
      return { ...prev, [key]: merged };
    });
    // reset selection and food
    setSelectedSeats([]);
    setPopcornQty(0);
    setBurgerQty(0);
    alert("Booking confirmed! Enjoy the show 🎉");
  }

  function resetAll() {
    if (window.confirm("Clear all bookings (localStorage)?")) {
      setBookings({});
      setSelectedSeats([]);
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  // Price calculations
  const seatPrice = (seatLabel) => {
    // seatLabel like 'A5'
    const rowIdx = seatLabel.charCodeAt(0) - 65;
    return getAreaForRow(rowIdx).price;
  };

  const seatsTotal = selectedSeats.reduce((sum, s) => sum + seatPrice(s), 0);
  const popcornPrice = 120;
  const burgerPrice = 160;
  const foodTotal = popcornQty * popcornPrice + burgerQty * burgerPrice;
  const grandTotal = seatsTotal + foodTotal;

  // check if a seat is booked
  function isBooked(seatLabel) {
    return bookedThisTime.includes(seatLabel);
  }

  // seat grid
  const seatGrid = [];
  for (let r = 0; r < ROWS; r += 1) {
    const row = [];
    for (let c = 1; c <= COLS; c += 1) {
      const label = `${rowLabel(r)}${c}`;
      row.push(label);
    }
    seatGrid.push(row);
  }

  return (
    <div className="app-wrap">
      <header className="topbar">
        <div className="title">🎬 Grand Cinema — Book Your Seat</div>
        <div className="controls">
          <label className="time-label">
            Movie Time:
            <select
              value={selectedTime}
              onChange={(e) => {
                setSelectedTime(e.target.value);
                setSelectedSeats([]);
              }}
            >
              <option value="">-- Select Time --</option>
              <option value="10:00 AM">10:00 AM</option>
              <option value="1:00 PM">1:00 PM</option>
              <option value="4:00 PM">4:00 PM</option>
              <option value="7:00 PM">7:00 PM</option>
              <option value="10:00 PM">10:00 PM</option>
            </select>
          </label>

          <button className="reset-btn" onClick={resetAll}>
            Reset All
          </button>
        </div>
      </header>

      <main className="main-area">
        <section className="theatre-area">
          <div className="screen">SCREEN</div>

          <div className="legend">
            {AREA_MAP.map((a) => (
              <div key={a.name} className="legend-item">
                <div
                  className="legend-swatch"
                  style={{ background: a.color }}
                />
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

            <div
              className="seating-grid"
              onMouseLeave={() => setHoverInfo(null)}
            >
              {seatGrid.map((row, rIdx) => (
                <div key={rIdx} className="seat-row">
                  {row.map((label) => {
                    const area = getAreaForRow(rIdx);
                    const booked = isBooked(label);
                    const selected = selectedSeats.includes(label);
                    const classes = ["seat"];
                    if (booked) classes.push("booked");
                    if (selected) classes.push("selected");

                    return (
                      <div
                        key={label}
                        className={classes.join(" ")}
                        style={{
                          background: booked
                            ? undefined
                            : selected
                            ? undefined
                            : area.color,
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
                  })}
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

        <aside className="sidebar">
          <div className="summary-card">
            <h3>Booking Summary</h3>
            <div className="summary-row">
              <span>Time:</span>
              <span>{selectedTime || "—"}</span>
            </div>
            <div className="summary-row">
              <span>Selected seats:</span>
              <span>
                {selectedSeats.length ? selectedSeats.join(", ") : "None"}
              </span>
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
                  <button
                    onClick={() => setPopcornQty((q) => Math.max(0, q - 1))}
                  >
                    −
                  </button>
                  <div className="qty">{popcornQty}</div>
                  <button onClick={() => setPopcornQty((q) => q + 1)}>+</button>
                </div>
              </div>

              <div className="food-item">
                <div>🍔 Burger (₹{burgerPrice})</div>
                <div className="qty-controls">
                  <button
                    onClick={() => setBurgerQty((q) => Math.max(0, q - 1))}
                  >
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
        </aside>
      </main>
    </div>
  );
}
