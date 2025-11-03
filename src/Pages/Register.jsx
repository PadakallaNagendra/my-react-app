import { useState } from "react";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaPhone, FaLock } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./RegisterPage.css";

const RegisterPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Full name is required";
    if (!form.email.includes("@")) newErrors.email = "Invalid email";
    if (!/^\d{10}$/.test(form.phone)) newErrors.phone = "Enter 10-digit phone";
    if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    return newErrors;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    setTimeout(() => {
      const userData = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      };
      localStorage.setItem("registeredUser", JSON.stringify(userData));

      toast.success(`🎉 Welcome, ${form.name}! Registered Successfully.`, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        theme: "colored",
      });

      setIsSubmitting(false);
      setForm({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });

      // Redirect after toast delay
      setTimeout(() => {
        window.location.href = "/login";
      }, 2200);
    }, 800);
  };

  return (
    <div className="register-page">
      <ToastContainer />
      <motion.div
        className="register-card"
        initial={{ opacity: 0, y: -60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="register-header">
          <motion.div
            className="profile-circle"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <FaUser className="profile-icon" />
          </motion.div>
          <h2>Create Your Account</h2>
          <p>Join us and explore something new every day!</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          {[
            { icon: <FaUser />, name: "name", placeholder: "Full Name" },
            { icon: <FaEnvelope />, name: "email", placeholder: "Email ID" },
            { icon: <FaPhone />, name: "phone", placeholder: "Phone Number" },
            { icon: <FaLock />, name: "password", placeholder: "Password" },
            {
              icon: <FaLock />,
              name: "confirmPassword",
              placeholder: "Confirm Password",
            },
          ].map((field, idx) => (
            <div key={idx} className="form-group">
              <div className="icon-wrapper">{field.icon}</div>
              <input
                type={
                  field.name.toLowerCase().includes("password")
                    ? "password"
                    : "text"
                }
                name={field.name}
                placeholder={field.placeholder}
                value={form[field.name]}
                onChange={handleChange}
              />
              {errors[field.name] && (
                <p className="error">{errors[field.name]}</p>
              )}
            </div>
          ))}

          <motion.button
            className="register-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registering..." : "Register"}
          </motion.button>
        </form>

        <p className="login-link">
          Already have an account?{" "}
          <a href="/login" className="highlight-link">
            Login here
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
