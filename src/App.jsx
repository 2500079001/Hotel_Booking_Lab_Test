import React, { useState } from "react";
import "./App.css";

const initialRooms = [
  {
    id: 1,
    name: "Single Room",
    price: 1500,
    occupancy: 1,
    beds: "1 Single Bed",
    icon: "🛏️",
    available: 5,
  },
  {
    id: 2,
    name: "Double Room",
    price: 2500,
    occupancy: 2,
    beds: "1 Double Bed",
    icon: "🛌",
    available: 4,
  },
  {
    id: 3,
    name: "Deluxe Room",
    price: 4000,
    occupancy: 3,
    beds: "1 King Bed",
    icon: "🏨",
    available: 3,
  },
  {
    id: 4,
    name: "Family Suite",
    price: 6000,
    occupancy: 4,
    beds: "2 Double Beds",
    icon: "🏡",
    available: 2,
  },
];

function App() {
  const [rooms, setRooms] = useState(initialRooms);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [guestName, setGuestName] = useState("");
  const [guests, setGuests] = useState(1);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [bookings, setBookings] = useState([]);

  const today = new Date().toLocaleDateString("en-CA");

  function bookRoom(event) {
    event.preventDefault();

    const room = rooms.find(
      (item) => item.id === selectedRoom
    );

    if (!room || room.available < 1) {
      alert("Sorry, this room is not available.");
      return;
    }

    if (guests > room.occupancy) {
      alert(`Maximum occupancy is ${room.occupancy} guests.`);
      return;
    }

    if (checkIn < today || checkOut <= checkIn) {
      alert("Please select valid check-in and check-out dates.");
      return;
    }

    const days = Math.ceil(
      (new Date(checkOut) - new Date(checkIn)) /
      (1000 * 60 * 60 * 24)
    );

    const booking = {
      id: Date.now(),
      guestName,
      roomName: room.name,
      guests,
      checkIn,
      checkOut,
      days,
      total: room.price * days,
    };

    setBookings((previous) => [...previous, booking]);

    setRooms((previous) =>
      previous.map((item) =>
        item.id === room.id
          ? { ...item, available: item.available - 1 }
          : item
      )
    );

    alert(
      `Booking successful!\nTotal: ₹${booking.total.toLocaleString("en-IN")}`
    );

    setSelectedRoom(null);
    setGuestName("");
    setGuests(1);
    setCheckIn("");
    setCheckOut("");
  }

  return (
    <div className="app">
      <header className="hero">
        <h1>🏨 Grand Stay Hotel</h1>
        <p>Comfort, luxury, and hospitality in one place.</p>
      </header>

      <main className="container">
        <section className="intro">
          <h2>Explore Our Rooms</h2>
          <p>
            Choose your perfect room and book your stay today.
          </p>
        </section>

        <section className="room-grid">
          {rooms.map((room) => (
            <article className="room-card" key={room.id}>
              <div className="room-icon">{room.icon}</div>

              <div className="room-details">
                <h3>{room.name}</h3>

                <p>
                  <strong>Price:</strong>{" "}
                  ₹{room.price.toLocaleString("en-IN")} / night
                </p>

                <p>
                  <strong>Occupancy:</strong>{" "}
                  {room.occupancy} guest
                  {room.occupancy > 1 ? "s" : ""}
                </p>

                <p>
                  <strong>Bedding:</strong> {room.beds}
                </p>

                <p>
                  <strong>Available rooms:</strong>{" "}
                  {room.available}
                </p>

                <span
                  className={
                    room.available > 0
                      ? "status available"
                      : "status unavailable"
                  }
                >
                  {room.available > 0
                    ? "Available"
                    : "Sold Out"}
                </span>

                <button
                  disabled={room.available === 0}
                  onClick={() => {
                    setSelectedRoom(room.id);
                    setGuests(1);
                  }}
                >
                  Book Now
                </button>
              </div>
            </article>
          ))}
        </section>

        {selectedRoom !== null && (
          <section className="booking-panel">
            <h2>Book Your Room</h2>

            <form onSubmit={bookRoom}>
              <label>Guest Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                required
              />

              <label>Room Type</label>
              <select
                value={selectedRoom}
                onChange={(e) =>
                  setSelectedRoom(Number(e.target.value))
                }
              >
                {rooms
                  .filter((room) => room.available > 0)
                  .map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name} — ₹{room.price}/night
                    </option>
                  ))}
              </select>

              <label>Number of Guests</label>
              <input
                type="number"
                min="1"
                max={
                  rooms.find((r) => r.id === selectedRoom)?.occupancy || 1
                }
                value={guests}
                onChange={(e) =>
                  setGuests(Number(e.target.value))
                }
                required
              />

              <label>Check-in Date</label>
              <input
                type="date"
                min={today}
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                required
              />

              <label>Check-out Date</label>
              <input
                type="date"
                min={checkIn || today}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                required
              />

              {checkIn && checkOut > checkIn && (
                <div className="price-summary">
                  {(() => {
                    const room = rooms.find(
                      (r) => r.id === selectedRoom
                    );
                    const days = Math.ceil(
                      (new Date(checkOut) - new Date(checkIn)) /
                      86400000
                    );

                    return (
                      <>
                        <p>Nights: {days}</p>
                        <h3>
                          Total: ₹
                          {(room.price * days).toLocaleString("en-IN")}
                        </h3>
                      </>
                    );
                  })()}
                </div>
              )}

              <div className="form-buttons">
                <button type="submit">Confirm Booking</button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setSelectedRoom(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="booking-history">
          <h2>Booking Details</h2>

          {bookings.length === 0 ? (
            <p>No bookings yet.</p>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Guest</th>
                    <th>Room</th>
                    <th>Guests</th>
                    <th>Check-in</th>
                    <th>Check-out</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>{booking.guestName}</td>
                      <td>{booking.roomName}</td>
                      <td>{booking.guests}</td>
                      <td>{booking.checkIn}</td>
                      <td>{booking.checkOut}</td>
                      <td>
                        ₹{booking.total.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      <footer>
        <p>© 2026 Grand Stay Hotel | All rights reserved</p>
      </footer>
    </div>
  );
}

export default App;