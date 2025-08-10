import React, { useState, useEffect } from "react";
import Header from "./Header";
import Theatre from "./Theatre";
import BookingSummary from "./BookingSummary";
import BookedSeatsList from "./BookedSeatsList";
import "./App.css";

const ROWS = 12; // A-L
const COLS = 14; // seats per row

// Areas divided according to price
export const AREA_MAP = [
  { name: "Platinum", rows: [0, 1], price: 400, color: "#FFD700" },
  { name: "Gold", rows: [2, 3, 4, 5], price: 300, color: "#FFB347" },
  { name: "Silver", rows: [6, 7, 8, 9, 10, 11], price: 200, color: "#C0C0C0" },
];

export function rowLabel(index) {
  return String.fromCharCode(65 + index);
}

export function getAreaForRow(rowIndex) {
  for (const area of AREA_MAP) {
    if (area.rows.includes(rowIndex)) return area;
  }
  return AREA_MAP[AREA_MAP.length - 1];
}

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

  const [selectedTime, setSelectedTime] = useState("");
  const bookingKey = (time) => `mainmovie|${time || "no-time"}`;

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [popcornQty, setPopcornQty] = useState(0);
  const [burgerQty, setBurgerQty] = useState(0);
  const [hoverInfo, setHoverInfo] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  }, [bookings]);

  const bookedThisTime = bookings[bookingKey(selectedTime)] || [];

  // Toggle seat selection logic
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

  // Confirm booking logic
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

    setSelectedSeats([]);
    setPopcornQty(0);
    setBurgerQty(0);
    alert("Booking confirmed! Enjoy the show 🎉");
  }

  // Reset all bookings
  function resetAll() {
    if (window.confirm("Clear all bookings (localStorage)?")) {
      setBookings({});
      setSelectedSeats([]);
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  return (
    <div className="app-wrap">
      <Header
        selectedTime={selectedTime}
        onTimeChange={(time) => {
          setSelectedTime(time);
          setSelectedSeats([]);
        }}
        onReset={resetAll}
      />

      <main className="main-area">
        <Theatre
          rows={ROWS}
          cols={COLS}
          selectedTime={selectedTime}
          bookings={bookings}
          selectedSeats={selectedSeats}
          toggleSeat={toggleSeat}
          hoverInfo={hoverInfo}
          setHoverInfo={setHoverInfo}
          bookedThisTime={bookedThisTime}
        />

        <aside className="sidebar">
          <BookingSummary
            selectedTime={selectedTime}
            selectedSeats={selectedSeats}
            popcornQty={popcornQty}
            setPopcornQty={setPopcornQty}
            burgerQty={burgerQty}
            setBurgerQty={setBurgerQty}
            confirmBooking={confirmBooking}
          />

          <BookedSeatsList
            selectedTime={selectedTime}
            bookedThisTime={bookedThisTime}
          />
        </aside>
      </main>
    </div>
  );
}
