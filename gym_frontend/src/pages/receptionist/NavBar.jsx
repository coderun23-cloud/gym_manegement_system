import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import {
  FaBars,
  FaTimes,
  FaDumbbell,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import { AppContext } from "../../context/AppContext";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, token, setToken, setUser } = useContext(AppContext);
  const nav = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  async function handleLogout(e) {
    e.preventDefault();
    const res = await fetch("/api/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
      nav("/", { replace: true });
    }
  }

  const navItems = [
    { name: "Home", to: "/index" },
    { name: "Attendance", to: "/attendance_receptionst" },
    { name: "Payment", to: "/payment_receptionst" },
    { name: "Schedule", to: "/schedule_receptionst" },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed w-full top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-gray-900 shadow-xl"
          : "bg-gray-900/90 backdrop-blur-sm shadow-md"
      }`}
    >
      <div className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-2xl font-bold"
          >
            <FaDumbbell className="text-white" />
            <span className="text-white">MAV GYM</span>
            <span className="text-blue-500">PLC</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to;

              return (
                <Link
                  key={item.name}
                  to={item.to}
                  className={`py-2 px-1 relative group text-white transition-colors duration-300 ${
                    isActive
                      ? "text-blue-400 font-semibold"
                      : "hover:text-blue-400"
                  }`}
                >
                  {item.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500"></span>
                  )}
                </Link>
              );
            })}

            {user.name && (
              <div className="relative ml-8">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 focus:outline-none cursor-pointer"
                >
                  <span className="text-white font-medium">{user.name}</span>
                </button>

                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50"
                  >
                    <Link
                      to="/account"
                      className="flex items-center px-4 py-2 text-white hover:bg-gray-700"
                      onClick={() => setShowDropdown(false)}
                    >
                      <FaUser className="mr-2" />
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-white hover:bg-gray-700"
                    >
                      <FaSignOutAlt className="mr-2" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white focus:outline-none p-2 rounded-lg hover:bg-gray-800 transition-colors duration-300"
            >
              {isOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden mt-4 space-y-4 pb-4"
          >
            {navItems.map((item) => {
              const isActive = location.pathname === item.to;

              return (
                <Link
                  key={item.name}
                  to={item.to}
                  className={`block py-3 px-4 rounded-lg transition-colors duration-300 ${
                    isActive
                      ? "bg-blue-600 text-white font-semibold"
                      : "text-white hover:bg-gray-800"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              );
            })}

            {user.name && (
              <div className="pt-4 border-t border-gray-800 space-y-3">
                <div className="flex flex-col space-y-2">
                  <Link
                    to="/account"
                    className="flex items-center px-4 py-2 text-white hover:bg-gray-800 rounded-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    <FaUser className="mr-2" />
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 text-white hover:bg-gray-800 rounded-lg w-full text-left"
                  >
                    <FaSignOutAlt className="mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default NavBar;
