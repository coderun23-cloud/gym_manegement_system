import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaDumbbell,
  FaCheckCircle,
} from "react-icons/fa";
import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    phone_number: "",
    gender: "male",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { setToken } = useContext(AppContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Special handling for phone number to only allow numbers
    if (name === "phone_number") {
      const numericValue = value.replace(/\D/g, "");
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const response = await fetch("api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors(
          data.errors || { general: [data.message || "Registration failed"] }
        );
        return;
      }

      // Registration successful
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setSuccess(true);

      // Redirect after 3 seconds
      setTimeout(() => {
        navigate("/index");
      }, 2000);
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({ general: ["Network error. Please try again later."] });
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <section className="min-h-screen bg-gray-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center"
        >
          <div className="text-green-500 text-5xl mb-4 flex justify-center">
            <FaCheckCircle />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Registration Successful!
          </h2>
          <p className="text-gray-600 mb-6">
            Your account has been created successfully. You'll be redirected
            shortly.
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 3 }}
              className="bg-blue-600 h-2.5 rounded-full"
            />
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-100 py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto bg-white rounded-xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gray-900 py-6 px-8 text-center">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center justify-center space-x-2"
            >
              <FaDumbbell className="text-blue-500 text-2xl" />
              <h2 className="text-2xl font-bold text-white">
                MAV <span className="text-blue-500">GYM PLC</span>
              </h2>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-2 text-gray-300"
            >
              Create your account
            </motion.p>
          </div>

          {/* Registration Form */}
          <div className="p-8">
            {errors.general && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                {errors.general[0]}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleRegister}>
              {/* Full Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className={`block w-full pl-10 pr-3 py-3 border ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name[0]}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={`block w-full pl-10 pr-3 py-3 border ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email[0]}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label
                  htmlFor="phone_number"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone className="text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    id="phone_number"
                    name="phone_number"
                    className={`block w-full pl-10 pr-3 py-3 border ${
                      errors.phone_number ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="0900000000"
                    value={formData.phone_number}
                    onChange={handleChange}
                    maxLength={12}
                  />
                </div>
                {errors.phone_number && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.phone_number[0]}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className={`block w-full pl-10 pr-3 py-3 border ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.password[0]}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Must be at least 8 characters
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="password_confirmation"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="password_confirmation"
                    name="password_confirmation"
                    className={`block w-full pl-10 pr-3 py-3 border ${
                      errors.password_confirmation
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="••••••••"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                  />
                </div>
                {errors.password_confirmation && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.password_confirmation[0]}
                  </p>
                )}
              </div>

              {/* Gender Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={`block w-full p-3 border ${
                    errors.gender ? "border-red-500" : "border-gray-300"
                  } rounded-lg`}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                {errors.gender && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.gender[0]}
                  </p>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    required
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="font-medium text-gray-700">
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      className="text-blue-600 hover:text-blue-500"
                    >
                      Terms and Conditions
                    </Link>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
                  loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300`}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            {/* Already have an account */}
            <div className="mt-6 text-center text-sm">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Register;
