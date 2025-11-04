import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./LoginPage.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setEmail("");
    setPassword("");
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    const savedUser = JSON.parse(localStorage.getItem("registeredUser"));

    if (
      savedUser &&
      email === savedUser.email &&
      password === savedUser.password
    ) {
      localStorage.setItem("userData", JSON.stringify({ email }));

      toast.success(`🎉 Welcome back, ${savedUser.name}!`, {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
      });

      setTimeout(() => navigate("/menu"), 2000);
    } else {
      toast.error("❌ Invalid credentials! Please try again.", {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
      });
    }
  };

  return (
    <div className="login-wrapper">
      <ToastContainer />

      <motion.div
        className="login-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Left Image / Video Section */}
        <div className="login-media">
          <video
            className="login-video"
            autoPlay
            loop
            muted
            playsInline
          >
            <source
              src="https://v.ftcdn.net/15/17/45/06/240_F_1517450675_KPl99O3H8onA2joQ8uc8kPEuQ09YeRn5_ST.mp4"
              type="video/mp4"
            />
          </video>
        </div>

        {/* Right Login Section */}
        <div className="login-form-section">
          <h2 className="login-title">Food Portal</h2>
          <p className="login-subtitle">Sign in to manage your dashboard</p>

          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                placeholder="Email ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="show-pass"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="login-btn"
            >
              Sign In
            </motion.button>
          </form>

          <p className="register-text">
            Don’t have an account?{" "}
            <Link to="/register" className="register-link">
              Register here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
