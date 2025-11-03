import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./LoginPage.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // ✅ Clear fields on mount
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

      setEmail("");
      setPassword("");

      // Navigate after short delay
      setTimeout(() => {
        navigate("/menu");
      }, 2000);
    } else {
      toast.error("❌ Invalid credentials! Please try again.", {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
      });
    }
  };

  return (
    <div className="login-page">
      <ToastContainer />

      {/* Background Circles */}
      <div className="circle circle1"></div>
      <div className="circle circle2"></div>

      {/* Login Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="login-card"
      >
        <div className="avatar-container">
          <FaUser className="avatar-icon" />
        </div>

        <h2 className="login-title">Welcome Back 👋</h2>
        <p className="subtitle">Login to access your dashboard</p>

        <form onSubmit={handleLogin} className="login-form">
          {/* Email Field */}
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

          {/* Password Field */}
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

          <div className="options">
            <a href="#" className="forgot-link">
              Forgot Password?
            </a>
          </div>

          {/* Login Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="login-btn"
          >
            LOGIN
          </motion.button>
        </form>

        <p className="register-text">
          Don’t have an account?{" "}
          <a href="/register" className="register-link">
            Register
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
