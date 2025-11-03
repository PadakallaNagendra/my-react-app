import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar, FaUsers, FaCalendarAlt, FaTag, FaClock } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./PrebookedCollections.css";

import Dinner1 from "../assets/dinner1.jpg";
import Dinner2 from "../assets/dinner2.png";
import Dinner3 from "../assets/dinner3.jpg";
import Dinner4 from "../assets/dinner4.jpg";

const collections = [
  {
    id: 1,
    title: "Top Trending Spots",
    image: Dinner1,
    description:
      "The restaurants that are talk of the town. Look out for more such popular places, updated every Thursday!",
    places: 29,
    discount: 15,
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
    discount: 20,
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
    discount: 10,
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
    discount: 25,
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
  Breakfast: [
    "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM",
    "10:00 AM", "10:30 AM", "11:00 AM",
  ],
  Lunch: [
    "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM",
    "02:00 PM", "02:30 PM", "03:00 PM",
  ],
  Dinner: [
    "07:00 PM", "07:30 PM", "08:00 PM", "08:30 PM",
    "09:00 PM", "09:30 PM", "10:00 PM", "10:30 PM",
  ],
};

const PrebookedCollections = () => {
  const [selected, setSelected] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [guestRange, setGuestRange] = useState("1-5");
  const [date, setDate] = useState("Today");
  const [mealType, setMealType] = useState("Breakfast");
  const [showRates, setShowRates] = useState(false);
  const [manualDiscount, setManualDiscount] = useState("");
  const [showAddToCart, setShowAddToCart] = useState(false);
  const [bookedTables, setBookedTables] = useState([]);
  const [viewFilter, setViewFilter] = useState("all");
  const [selectedSlot, setSelectedSlot] = useState("");

  const getAutoDiscount = (range) => {
    if (range === "1-5") return 5;
    if (range === "6-10") return 10;
    if (range === "11-15") return 15;
    if (range === "16-20") return 20;
    if (range === "21-30") return 25;
    if (range === "31-40") return 30;
    if (range === "41-50") return 35;
    return 0;
  };

  const calculateDiscountedPrice = (base, discount, range) => {
    const [min, max] = range.split("-").map(Number);
    const avgGuests = (min + max) / 2;
    const total = base * avgGuests;
    const discountAmt = (total * discount) / 100;
    return total - discountAmt;
  };

  const currentDiscount =
    manualDiscount !== "" ? Number(manualDiscount) : getAutoDiscount(guestRange);

  const handleProceed = () => {
    toast.success("🎉 Your table is booked successfully!");
    setBookedTables((prev) => [
      ...prev,
      {
        name: selectedRestaurant.name,
        date,
        mealType,
        guestRange,
        slot: selectedSlot || "Not selected",
        discount: currentDiscount,
        price: calculateDiscountedPrice(
          selectedRestaurant.basePrice,
          currentDiscount,
          guestRange
        ).toFixed(2),
      },
    ]);
    setShowAddToCart(false);
    setShowRates(false);
    setSelectedRestaurant(null);
    setSelectedSlot("");
  };

  const isBooked = (restaurantName) =>
    bookedTables.some((table) => table.name === restaurantName);

  return (
    <div className="collections-container">
      <ToastContainer position="top-center" autoClose={2000} />

      {/* FILTER BUTTONS */}
      {!selected && (
        <div className="booking-filter">
          <button
            className={`filter-btn ${viewFilter === "all" ? "active" : ""}`}
            onClick={() => setViewFilter("all")}
          >
            All
          </button>
          <button
            className={`filter-btn ${viewFilter === "booked" ? "active" : ""}`}
            onClick={() => setViewFilter("booked")}
          >
            Booked
          </button>
          <button
            className={`filter-btn ${viewFilter === "unbooked" ? "active" : ""}`}
            onClick={() => setViewFilter("unbooked")}
          >
            Unbooked
          </button>
        </div>
      )}

      {/* MAIN COLLECTION GRID */}
      {!selected && (
        <>
          <h2 className="collections-title">Collections</h2>
          <p className="collections-sub">
            Explore curated lists of restaurants, cafes, and pubs.
          </p>

          <div className="collections-grid">
            {collections.map((col) => (
              <motion.div
                className="collection-card"
                key={col.id}
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelected(col)}
              >
                <img src={col.image} alt={col.title} className="collection-image" />
                <div className="collection-info">
                  <h3>{col.title}</h3>
                  <p>{col.discount}% OFF</p>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* COLLECTION DETAIL */}
      <AnimatePresence>
        {selected && !selectedRestaurant && (
          <motion.div
            className="detail-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="detail-banner">
              <img src={selected.image} alt={selected.title} />
              <div className="banner-text">
                <p className="banner-sub">ZOMATO COLLECTIONS</p>
                <h1>{selected.title}</h1>
                <p>{selected.description}</p>
                <p className="places">{selected.places} Places</p>
              </div>
              <button className="close-detail" onClick={() => setSelected(null)}>
                ✕
              </button>
            </div>

            <div className="related-section">
              {selected.related
                .filter((item) => {
                  if (viewFilter === "booked") return isBooked(item.name);
                  if (viewFilter === "unbooked") return !isBooked(item.name);
                  return true;
                })
                .map((item, index) => (
                  <motion.div
                    key={index}
                    className={`related-card ${
                      isBooked(item.name) ? "booked" : "unbooked"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setSelectedRestaurant(item)}
                  >
                    <img src={item.img} alt={item.name} />
                    <div className="related-info">
                      <h4>{item.name}</h4>
                      <p className="rating">
                        <FaStar /> {item.rating}
                      </p>
                      <p className="type">
                        {isBooked(item.name) ? "BOOKED ✅" : "AVAILABLE 🕓"}
                      </p>
                    </div>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RESTAURANT DETAIL */}
      <AnimatePresence>
        {selectedRestaurant && (
          <motion.div
            className="restaurant-detail-overlay"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="restaurant-banner">
              <img src={selectedRestaurant.img} alt={selectedRestaurant.name} />
              <div className="restaurant-info">
                <h2>{selectedRestaurant.name}</h2>
                <p>⭐ {selectedRestaurant.rating} | Dining | Hyderabad</p>
              </div>
              <button
                className="close-detail"
                onClick={() => {
                  setSelectedRestaurant(null);
                  setShowRates(false);
                  setManualDiscount("");
                  setShowAddToCart(false);
                }}
              >
                ✕
              </button>
            </div>

            <div className="restaurant-body">
              <div className="book-table">
                <h3>Select your booking details</h3>
                <div className="table-form">
                  {/* DATE SELECTOR */}
                  <div className="input-group">
                    <FaCalendarAlt />
                    <select value={date} onChange={(e) => setDate(e.target.value)}>
                      {getNextDays().map((d) => (
                        <option key={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  {/* MEAL TYPE SELECTOR */}
                  <div className="input-group">
                    <FaClock />
                    <select
                      value={mealType}
                      onChange={(e) => {
                        setMealType(e.target.value);
                        setSelectedSlot("");
                      }}
                    >
                      <option>Breakfast</option>
                      <option>Lunch</option>
                      <option>Dinner</option>
                    </select>
                  </div>

                  {/* GUEST RANGE SELECTOR */}
                  <div className="input-group">
                    <FaUsers />
                    <select
                      value={guestRange}
                      onChange={(e) => {
                        setGuestRange(e.target.value);
                        setManualDiscount("");
                      }}
                    >
                      <option>1-5</option>
                      <option>6-10</option>
                      <option>11-15</option>
                      <option>16-20</option>
                      <option>21-30</option>
                      <option>31-40</option>
                      <option>41-50</option>
                    </select>
                  </div>

                  {/* MANUAL DISCOUNT */}
                  <div className="input-group">
                    <FaTag />
                    <input
                      type="number"
                      placeholder="Enter discount %"
                      value={manualDiscount}
                      onChange={(e) => setManualDiscount(e.target.value)}
                      min="0"
                      max="100"
                    />
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowRates(true)}
                    className="book-btn"
                  >
                    Show Price
                  </motion.button>
                </div>

                {/* SLOT SELECTION SECTION */}
                {showRates && (
                  <motion.div
                    className="slot-selection"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <h4>Select slot</h4>
                    <div className="slot-grid">
                      {slotTimings[mealType].map((slot) => (
                        <button
                          key={slot}
                          className={`slot-btn ${
                            selectedSlot === slot ? "active" : ""
                          }`}
                          onClick={() => setSelectedSlot(slot)}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* PRICE & PROCEED SECTION */}
                <AnimatePresence>
                  {showRates && (
                    <motion.div
                      className="rate-card"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      <h4>💰 Table Price Details</h4>
                      <p>Date: {date}</p>
                      <p>Meal Type: {mealType}</p>
                      <p>Guest Range: {guestRange}</p>
                      <p>Base Price per Guest: ₹{selectedRestaurant.basePrice}</p>
                      <p>Applied Discount: {currentDiscount}%</p>
                      <p>Selected Slot: {selectedSlot || "None"}</p>
                      <p className="final">
                        Final Price: ₹
                        {calculateDiscountedPrice(
                          selectedRestaurant.basePrice,
                          currentDiscount,
                          guestRange
                        ).toFixed(2)}
                      </p>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        className="add-cart-btn"
                        onClick={() => setShowAddToCart(true)}
                      >
                        Add to Cart
                      </motion.button>

                      {showAddToCart && (
                        <motion.div
                          className="proceed-section"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <p>Discount Applied: {currentDiscount}%</p>
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            className="proceed-btn"
                            onClick={handleProceed}
                          >
                            Proceed
                          </motion.button>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PrebookedCollections;
