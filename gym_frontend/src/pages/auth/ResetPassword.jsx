import { motion } from "framer-motion";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  FaLock,
  FaCheck,
  FaDumbbell,
  FaArrowLeft,
  FaTimes,
} from "react-icons/fa";
import { useState, useEffect } from "react";

const ResetPassword = () => {
  const { token } = useParams();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
    password_confirmation: "",
    email: email,
    token: token,
  });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    number: false,
    specialChar: false,
    match: false,
  });

  useEffect(() => {
    const { password, password_confirmation } = formData;

    setPasswordRequirements({
      length: password.length >= 8,
      number: /\d/.test(password),
      specialChar: /[!@#$%^&*]/.test(password),
      match: password === password_confirmation && password.length > 0,
    });
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    if (!formData.password || !formData.password_confirmation) {
      setMessage({ text: "All fields are required", type: "error" });
      return false;
    }

    if (
      !passwordRequirements.length ||
      !passwordRequirements.number ||
      !passwordRequirements.specialChar
    ) {
      setMessage({
        text: "Password must be at least 8 characters with a number and special character",
        type: "error",
      });
      return false;
    }

    if (!passwordRequirements.match) {
      setMessage({ text: "Passwords don't match", type: "error" });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    if (!validateForm()) return;

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Password reset failed");
      }

      setMessage({
        text:
          data.message ||
          "Password reset successfully! Redirecting to login...",
        type: "success",
      });

      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      console.error("Reset password error:", err);
      setMessage({
        text: err.message || "Failed to reset password. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (message.type === "success") {
    return (
      <section className="min-h-screen bg-gray-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center"
        >
          <div className="text-green-500 text-5xl mb-4 flex justify-center">
            <FaCheck />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Password Reset Successful!
          </h2>
          <p className="text-gray-600 mb-6">{message.text}</p>
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
          <div className="bg-gray-900 py-6 px-8 text-center relative">
            <Link
              to="/login"
              className="absolute left-4 top-6 text-gray-300 hover:text-white transition-colors duration-300"
            >
              <FaArrowLeft className="text-xl" />
            </Link>
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
            {message.text && (
              <div
                className={`mt-3 p-2 rounded-md ${
                  message.type === "error"
                    ? "bg-red-100 text-red-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {message.text}
              </div>
            )}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-2 text-gray-300"
            >
              Create new password
            </motion.p>
          </div>

          <div className="p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-3 border ${
                      message.type === "error"
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div
                  className={`flex items-center ${
                    passwordRequirements.length
                      ? "text-green-500"
                      : "text-gray-500"
                  }`}
                >
                  {passwordRequirements.length ? (
                    <FaCheck className="mr-2" />
                  ) : (
                    <FaTimes className="mr-2" />
                  )}
                  <span>At least 8 characters</span>
                </div>
                <div
                  className={`flex items-center ${
                    passwordRequirements.number
                      ? "text-green-500"
                      : "text-gray-500"
                  }`}
                >
                  {passwordRequirements.number ? (
                    <FaCheck className="mr-2" />
                  ) : (
                    <FaTimes className="mr-2" />
                  )}
                  <span>Contains a number</span>
                </div>
                <div
                  className={`flex items-center ${
                    passwordRequirements.specialChar
                      ? "text-green-500"
                      : "text-gray-500"
                  }`}
                >
                  {passwordRequirements.specialChar ? (
                    <FaCheck className="mr-2" />
                  ) : (
                    <FaTimes className="mr-2" />
                  )}
                  <span>Contains a special character (!@#$%^&*)</span>
                </div>
              </div>

              <div>
                <label
                  htmlFor="password_confirmation"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm New Password
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
                      !passwordRequirements.match &&
                      formData.password_confirmation
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="••••••••"
                    required
                    value={formData.password_confirmation}
                    onChange={handleChange}
                  />
                </div>
                {!passwordRequirements.match &&
                  formData.password_confirmation && (
                    <p className="mt-1 text-sm text-red-600">
                      Passwords don't match
                    </p>
                  )}
              </div>

              <button
                type="submit"
                disabled={
                  loading ||
                  !passwordRequirements.match ||
                  !passwordRequirements.length ||
                  !passwordRequirements.number ||
                  !passwordRequirements.specialChar
                }
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
                  "Reset Password"
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ResetPassword;
