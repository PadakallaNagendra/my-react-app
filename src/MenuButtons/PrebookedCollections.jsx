import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaStar,
  FaUsers,
  FaCalendarAlt,
  FaTag,
  FaClock,
  FaEdit,
  FaCheck,
  FaShoppingCart,
  FaTimes,
  FaTrash,
  FaChair,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./PrebookedCollections.css";

import Dinner1 from "../assets/dinner1.jpg";
import Dinner2 from "../assets/dinner2.png";
import Dinner3 from "../assets/dinner3.jpg";
import Dinner4 from "../assets/dinner4.jpg";

// Generate 10 tables per restaurant
const generateTables = (restaurantName) => {
  return Array.from({ length: 10 }, (_, i) => ({
    id: `${restaurantName}-T${i + 1}`,
    number: i + 1,
    status: "available",
  }));
};

const collections = [
  {
    id: 1,
    title: "Top Trending Spots",
    image: Dinner1,
    description: "The restaurants that are talk of the town. Look out for more such popular places, updated every Thursday!",
    places: 29,
    related: [
      { name: "Zindagi Sky Bar & Kitchen", img: Dinner4, rating: 4.2, basePrice: 2000 },
      { name: "Mamalola Penthouse Bar", img: Dinner2, rating: 4.5, basePrice: 1800 },
      { name: "Forefathers", img: Dinner3, rating: 4.4, basePrice: 2200 },
      { name: "Masterpiece", img: Dinner1, rating: 4.3, basePrice: 2500 },
    ],
  },
  {
    id: 2,
    title: "Sky High Sips",
    image: Dinner4,
    description: "The finest rooftop bars and lounges across the city.",
    places: 16,
    related: [
      { name: "Cloud9 Lounge", img: Dinner2, rating: 4.5, basePrice: 1600 },
      { name: "Skyline Bistro", img: Dinner3, rating: 4.3, basePrice: 2100 },
    ],
  },
  {
    id: 3,
    title: "New in Town",
    image: Dinner2,
    description: "Check out the newest restaurants creating buzz in town.",
    places: 12,
    related: [
      { name: "FreshBite Cafe", img: Dinner3, rating: 4.4, basePrice: 1700 },
      { name: "UrbanPlates", img: Dinner4, rating: 4.6, basePrice: 2400 },
    ],
  },
  {
    id: 4,
    title: "Hyderabadi Biryani Spots",
    image: Dinner3,
    description: "From classic to modern, find the best biryani in the city.",
    places: 18,
    related: [
      { name: "Paradise Biryani", img: Dinner1, rating: 4.5, basePrice: 1500 },
      { name: "Biryani House", img: Dinner2, rating: 4.2, basePrice: 1300 },
    ],
  },
];

const getNextDays = () => {
  const days = ["Today", "Tomorrow"];
  const today = new Date();
  for (let i = 2; i <= 5; i++) {
    const next = new Date();
    next.setDate(today.getDate() + i);
    const weekday = next.toLocaleDateString("en-US", { weekday: "short" });
    const day = String(next.getDate()).padStart(2, "0");
    const month = next.toLocaleDateString("en-US", { month: "short" });
    days.push(`${weekday}, ${day} ${month}`);
  }
  return days;
};

const slotTimings = {
  Breakfast: ["08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM"],
  Lunch: ["12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM"],
  Dinner: ["07:00 PM", "07:30 PM", "08:00 PM", "08:30 PM", "09:00 PM", "09:30 PM", "10:00 PM", "10:30 PM"],
};

const PrebookedCollections = () => {
  const [selected, setSelected] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [guestCount, setGuestCount] = useState(4);
  const [editingGuests, setEditingGuests] = useState(false);
  const [date, setDate] = useState("Today");
  const [mealType, setMealType] = useState("Breakfast");
  const [showRates, setShowRates] = useState(false);
  const [manualDiscount, setManualDiscount] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedTable, setSelectedTable] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [filter, setFilter] = useState("all");
  const [selectedBookingId, setSelectedBookingId] = useState(null); // New: for dropdown

  // Generate tables
  const [allTables, setAllTables] = useState(() => {
    const tables = {};
    collections.forEach(col => {
      col.related.forEach(rest => {
        tables[rest.name] = generateTables(rest.name);
      });
    });
    return tables;
  });

  // Auto discount
  const getAutoDiscount = (count) => {
    if (count >= 41) return 35;
    if (count >= 31) return 30;
    if (count >= 21) return 25;
    if (count >= 16) return 20;
    if (count >= 11) return 15;
    if (count >= 6) return 10;
    if (count >= 1) return 5;
    return 0;
  };

  const currentDiscount = useMemo(() => {
    return manualDiscount !== "" ? Number(manualDiscount) : getAutoDiscount(guestCount);
  }, [manualDiscount, guestCount]);

  const calculatePrice = useMemo(() => {
    if (!selectedRestaurant) return { total: 0, discountAmt: 0, final: 0 };
    const total = selectedRestaurant.basePrice * guestCount;
    const discountAmt = (total * currentDiscount) / 100;
    const final = total - discountAmt;
    return { total, discountAmt, final };
  }, [selectedRestaurant, guestCount, currentDiscount]);

  const totalAmount = useMemo(() => {
    return cartItems.reduce((sum, i) => sum + parseFloat(i.price), 0).toFixed(2);
  }, [cartItems]);

  // Check if slot is booked
  const isSlotBooked = (restaurantName, date, slot) => {
    return cartItems.some(
      item => item.name === restaurantName && item.date === date && item.slot === slot
    );
  };

  const handleAddToCart = () => {
    if (!selectedTable) {
      toast.error("Please select a table!");
      return;
    }
    if (!selectedSlot) {
      toast.error("Please select a time slot!");
      return;
    }

    if (isSlotBooked(selectedRestaurant.name, date, selectedSlot)) {
      toast.error(`This time slot is already booked for ${selectedRestaurant.name} on ${date}!`);
      return;
    }

    const item = {
      id: Date.now().toString(),
      name: selectedRestaurant.name,
      table: selectedTable.number,
      date,
      mealType,
      guestCount,
      slot: selectedSlot,
      discount: currentDiscount,
      price: calculatePrice.final.toFixed(2),
    };

    setCartItems(prev => [...prev, item]);
    setAllTables(prev => ({
      ...prev,
      [selectedRestaurant.name]: prev[selectedRestaurant.name].map(t =>
        t.id === selectedTable.id ? { ...t, status: "booked" } : t
      ),
    }));
    toast.success(`Table T${selectedTable.number} booked for ${selectedSlot}!`);
    setSelectedTable(null);
    setSelectedSlot("");
  };

  const handleRemoveFromCart = (id) => {
    const item = cartItems.find(i => i.id === id);
    if (item) {
      setAllTables(prev => ({
        ...prev,
        [item.name]: prev[item.name].map(t =>
          t.number === item.table ? { ...t, status: "available" } : t
        ),
      }));
    }
    setCartItems(prev => prev.filter(i => i.id !== id));
    toast.info("Booking removed");
  };

  const selectedBooking = cartItems.find(i => i.id === selectedBookingId);

  const handlePayClick = () => {
    if (!selectedBooking) {
      toast.error("Please select a booking to pay.");
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmPayment = () => {
    if (!selectedBooking) return;

    // Remove from cart
    setCartItems(prev => prev.filter(i => i.id !== selectedBooking.id));

    // Keep table booked permanently
    setAllTables(prev => ({
      ...prev,
      [selectedBooking.name]: prev[selectedBooking.name].map(t =>
        t.number === selectedBooking.table ? { ...t, status: "booked" } : t
      ),
    }));

    toast.success(`Paid ₹${selectedBooking.price} for Table T${selectedBooking.table}!`);
    setShowConfirmModal(false);
    setShowPaymentModal(false);
    setSelectedBookingId(null);
  };

  const handleCancelPayment = () => {
    setShowConfirmModal(false);
  };

  // Filter logic
  const getFilteredCollections = () => {
    if (filter === "all") return collections;

    return collections.filter(col => {
      const hasBooked = col.related.some(rest => {
        const tables = allTables[rest.name] || [];
        return tables.some(t => t.status === "booked");
      });
      return filter === "booked" ? hasBooked : !hasBooked;
    });
  };

  return (
    <div className="collections-container">
      <ToastContainer position="top-center" autoClose={2000} />

      {/* Floating Cart Button */}
      {cartItems.length > 0 && (
        <motion.div
          className="floating-cart-btn"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => setShowPaymentModal(true)}
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            background: "#ff5200",
            color: "white",
            borderRadius: "50%",
            width: 60,
            height: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            zIndex: 1000,
          }}
        >
          <FaShoppingCart size={24} />
          <span className="cart-badge">{cartItems.length}</span>
        </motion.div>
      )}

      {/* FILTER BUTTONS */}
      {!selected && (
        <div className="filter-section">
          <button
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`filter-btn ${filter === "booked" ? "active" : ""}`}
            onClick={() => setFilter("booked")}
          >
            Booked Tables
          </button>
          <button
            className={`filter-btn ${filter === "unbooked" ? "active" : ""}`}
            onClick={() => setFilter("unbooked")}
          >
            Unbooked Tables
          </button>
        </div>
      )}

      {/* MAIN GRID */}
      {!selected && (
        <>
          <h2 className="collections-title">Collections</h2>
          <div className="collections-grid">
            {getFilteredCollections().map(col => (
              <motion.div
                key={col.id}
                className="collection-card"
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelected(col)}
              >
                <img src={col.image} alt={col.title} className="collection-image" />
                <div className="collection-info">
                  <h3>{col.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* COLLECTION DETAIL */}
      <AnimatePresence>
        {selected && !selectedRestaurant && (
          <motion.div className="detail-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="detail-banner">
              <img src={selected.image} alt={selected.title} />
              <div className="banner-text">
                <p className="banner-sub">ZOMATO COLLECTIONS</p>
                <h1>{selected.title}</h1>
                <p>{selected.description}</p>
                <p className="places">{selected.places} Places</p>
              </div>
            </div>

            <div className="related-section">
              {selected.related.map((item, index) => {
                const tables = allTables[item.name] || [];
                const bookedCount = tables.filter(t => t.status === "booked").length;
                return (
                  <motion.div
                    key={index}
                    className="related-card"
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setSelectedRestaurant(item)}
                  >
                    <img src={item.img} alt={item.name} />
                    <div className="related-info">
                      <h4>{item.name}</h4>
                      <p className="rating"><FaStar /> {item.rating}</p>
                      <p className="type">
                        {bookedCount > 0 ? `${bookedCount} Table${bookedCount > 1 ? "s" : ""} Booked` : "All Available"}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RESTAURANT DETAIL */}
      <AnimatePresence>
        {selectedRestaurant && (
          <motion.div className="restaurant-detail-overlay" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="restaurant-banner">
              <img src={selectedRestaurant.img} alt={selectedRestaurant.name} />
              <div className="restaurant-info">
                <h2>{selectedRestaurant.name}</h2>
                <p>Star {selectedRestaurant.rating} | Dining | Hyderabad</p>
              </div>
              <button
                className="close-detail"
                onClick={() => {
                  setSelectedRestaurant(null);
                  setShowRates(false);
                  setManualDiscount("");
                  setGuestCount(4);
                  setSelectedTable(null);
                  setSelectedSlot("");
                }}
              >X</button>
            </div>

            <div className="restaurant-body">
              <div className="book-table">
                <h3>Select your booking details</h3>
                <div className="table-form">

                  {/* DATE */}
                  <div className="input-group">
                    <FaCalendarAlt />
                    <select value={date} onChange={e => setDate(e.target.value)}>
                      {getNextDays().map(d => <option key={d}>{d}</option>)}
                    </select>
                  </div>

                  {/* MEAL TYPE */}
                  <div className="input-group">
                    <FaClock />
                    <select value={mealType} onChange={e => { setMealType(e.target.value); setSelectedSlot(""); }}>
                      <option>Breakfast</option>
                      <option>Lunch</option>
                      <option>Dinner</option>
                    </select>
                  </div>

                  {/* GUEST COUNT */}
                  <div className="input-group">
                    <FaUsers />
                    <div className="guest-input-wrapper">
                      {editingGuests ? (
                        <div className="guest-edit-mode">
                          <input
                            type="number"
                            value={guestCount}
                            onChange={e => setGuestCount(Math.max(1, Math.min(50, +e.target.value)))}
                            min="1"
                            max="50"
                            className="guest-input"
                          />
                          <button onClick={() => setEditingGuests(false)} className="save-guest-btn">
                            <FaCheck />
                          </button>
                        </div>
                      ) : (
                        <div className="guest-display-mode">
                          <span className="guest-count-display">
                            {guestCount} guest{guestCount > 1 ? "s" : ""}
                          </span>
                          <button onClick={() => setEditingGuests(true)} className="edit-guest-btn">
                            <FaEdit />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* DISCOUNT */}
                  <div className="input-group">
                    <FaTag />
                    <input
                      type="number"
                      placeholder="Discount % (optional)"
                      value={manualDiscount}
                      onChange={e => setManualDiscount(e.target.value)}
                      min="0"
                      max="100"
                      className="discount-input"
                    />
                  </div>

                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowRates(true)} className="book-btn">
                    Show Price
                  </motion.button>
                </div>

                {/* TABLE SELECTION */}
                {showRates && (
                  <motion.div className="table-selection" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <h4>Select Table</h4>
                    <div className="table-grid">
                      {(allTables[selectedRestaurant.name] || []).map(table => (
                        <button
                          key={table.id}
                          className={`table-btn ${table.status} ${selectedTable?.id === table.id ? "selected" : ""}`}
                          onClick={() => setSelectedTable(table)}
                          disabled={table.status === "booked"}
                        >
                          <FaChair />
                          <span>T{table.number}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* SLOT SELECTION */}
                {showRates && selectedTable && (
                  <motion.div className="slot-selection" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <h4>Select Time Slot</h4>
                    <div className="slot-grid">
                      {slotTimings[mealType].map(slot => {
                        const isBooked = isSlotBooked(selectedRestaurant.name, date, slot);
                        return (
                          <button
                            key={slot}
                            className={`slot-btn ${selectedSlot === slot ? "active" : ""} ${isBooked ? "booked" : ""}`}
                            onClick={() => !isBooked && setSelectedSlot(slot)}
                            disabled={isBooked}
                          >
                            {slot}
                            {isBooked && <span className="booked-tag">Booked</span>}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* PRICE CARD */}
                <AnimatePresence>
                  {showRates && selectedTable && selectedSlot && (
                    <motion.div className="rate-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                      <h4>Booking Summary</h4>
                      <p>Table: <strong>T{selectedTable.number}</strong></p>
                      <p>Date: {date}</p>
                      <p>Meal: {mealType}</p>
                      <p>Time: <strong>{selectedSlot}</strong></p>
                      <p>Guests: <strong>{guestCount}</strong></p>
                      <p>Base Price: ₹{selectedRestaurant.basePrice}</p>
                      <p>Total: ₹{calculatePrice.total.toFixed(2)}</p>
                      <p>Discount: <strong>{currentDiscount}%</strong></p>
                      <p>Final Price: ₹{calculatePrice.final.toFixed(2)}</p>

                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        className="add-cart-btn"
                        onClick={handleAddToCart}
                      >
                        Confirm Booking
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PAYMENT MODAL WITH DROPDOWN */}
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div className="payment-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="payment-modal" initial={{ scale: 0.8, y: 50 }} animate={{ scale: 1, y: 0 }}>
              <div className="modal-header">
                <h3>Complete Payment</h3>
                <button onClick={() => setShowPaymentModal(false)}><FaTimes /></button>
              </div>

              <div className="cart-items-list">
                {cartItems.map(item => (
                  <div key={item.id} className="cart-item">
                    <div>
                      <p><strong>{item.name}</strong> - T{item.table}</p>
                      <p>{item.date} | {item.mealType} | {item.slot}</p>
                      <p>{item.guestCount} guests | ₹{item.price}</p>
                    </div>
                    <button onClick={() => handleRemoveFromCart(item.id)} className="remove-btn">
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>

              {/* DROPDOWN TO SELECT ONE BOOKING */}
              <div className="select-booking-section">
                <label><strong>Select booking to pay</strong></label>
                <select
                  value={selectedBookingId || ""}
                  onChange={e => setSelectedBookingId(e.target.value)}
                  className="booking-dropdown"
                >
                  <option value="" disabled>-- Choose a booking --</option>
                  {cartItems.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.name} - T{item.table} ({item.date} {item.slot})
                    </option>
                  ))}
                </select>
              </div>

              <div className="total-section">
                <p><strong>Total Amount:</strong> {selectedBooking ? `₹${selectedBooking.price}` : "₹0.00"}</p>
                <p><strong>Bookings:</strong> {cartItems.length}</p>
              </div>

              <div className="payment-method-section">
                <label><strong>Payment Method</strong></label>
                <div className="payment-methods">
                  <button
                    className={`payment-method-btn ${paymentMethod === "upi" ? "active" : ""}`}
                    onClick={() => setPaymentMethod("upi")}
                  >
                    UPI
                  </button>
                  <button
                    className={`payment-method-btn ${paymentMethod === "cash" ? "active" : ""}`}
                    onClick={() => setPaymentMethod("cash")}
                  >
                    Cash
                  </button>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handlePayClick}
                className="pay-btn"
                disabled={!selectedBooking}
              >
                Pay {selectedBooking ? `₹${selectedBooking.price}` : "₹0.00"}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CONFIRM MODAL */}
      <AnimatePresence>
        {showConfirmModal && selectedBooking && (
          <motion.div className="confirm-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="confirm-modal" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
              <h4>Confirm Payment</h4>
              <p>Pay <strong>₹{selectedBooking.price}</strong> for Table T{selectedBooking.table}?</p>
              <div className="confirm-actions">
                <button onClick={handleConfirmPayment} className="confirm-ok">OK</button>
                <button onClick={handleCancelPayment} className="confirm-cancel">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PrebookedCollections;