import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUtensils,
  FaMotorcycle,
  FaWineBottle,
  FaSignOutAlt,
} from "react-icons/fa";
import DiningOut from "../Pages/DiningOut";
import Delivery from "../Pages/Delivery";
import Nightlife from "../Pages/Nightlife";
import "./ZomatoMenuTabs.css";
import BottomSheet from "../Pages/BottomSheet";
import PrebookedCollections from "../MenuButtons/PrebookedCollections";
const ZomatoMenuTabs = () => {
  const [active, setActive] = useState("Delivery");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userData");
    navigate("/login"); // redirect back to login page
  };

  const tabs = [
    { name: "Dining Out", icon: <FaUtensils size={24} /> },
    { name: "Delivery", icon: <FaMotorcycle size={24} /> },
    { name: "Nightlife", icon: <FaWineBottle size={24} /> },
  ];

  const renderContent = () => {
  switch (active) {
    case "Dining Out":
      return <PrebookedCollections />; // 👈 replace with this
    case "Delivery":
      return <Delivery />;
    case "Nightlife":
      return <Nightlife />;
    default:
      return null;
  }
};


  return (
    <div className="zomato-container">
      {/* Header */}
      <div className="menu-header">
        <h2 className="menu-title">🍽️ Zomato Dashboard</h2>
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt className="logout-icon" />
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="menu-tabs">
        {tabs.map((tab) => (
          <div
            key={tab.name}
            onClick={() => setActive(tab.name)}
            className={`tab-item ${active === tab.name ? "active" : ""}`}
          >
            <div className="tab-icon">{tab.icon}</div>
            <span className="tab-name">{tab.name}</span>
            {active === tab.name && <span className="underline"></span>}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="tab-content animate-fade">{renderContent()}</div>
      <BottomSheet />
    </div>
  );
};

export default ZomatoMenuTabs;
