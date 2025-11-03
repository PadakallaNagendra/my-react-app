import { Routes, Route, Navigate } from "react-router-dom";
import ZomatoMenuTabs from "./Components/Navbar";
import HomePage from "./Pages/Home";
import LoginPage from "./Pages/Login";
import RegisterPage from "./Pages/Register";

function App() {
  const isLoggedIn = !!localStorage.getItem("userData");

  return (
    <>
      <Routes>
        {/* ✅ Default route → if logged in, go to /menu, else go to /login */}
        <Route
          path="/"
          element={
            isLoggedIn ? <Navigate to="/login" /> : <Navigate to="/menu" />
          }
        />

        {/* ✅ Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* ✅ Register */}
        <Route path="/register" element={<RegisterPage />} />

        {/* ✅ Dashboard */}
        <Route
          path="/menu"
          element={isLoggedIn ? <ZomatoMenuTabs /> : <Navigate to="/login" />}
        />

        {/* ✅ Home Page (only visible after logout if you want) */}
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </>
  );
}

export default App;
