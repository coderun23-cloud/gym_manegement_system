import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaBars, FaTimes, FaDumbbell } from "react-icons/fa";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "#about" },
    { name: "Notice", href: "#notice" },
    { name: "Contact", href: "#contact" },
  ];

  const authItems = [
    { name: "Sign In", to: "/login" },
    { name: "Sign Up", to: "/register", isPrimary: true },
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
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="hover:text-blue-400 transition-colors duration-300 py-2 px-1 relative group text-white"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}

            <div className="flex space-x-4 ml-8">
              {authItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.to}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    item.isPrimary
                      ? "bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-500/30 text-white"
                      : "hover:bg-gray-800 shadow hover:shadow-white/10 text-white"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
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
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="block py-3 px-4 hover:bg-gray-800 rounded-lg transition-colors duration-300 text-white"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            <div className="pt-4 border-t border-gray-800 space-y-3">
              {authItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.to}
                  className={`block w-full text-center text-white px-4 py-3 rounded-lg transition-all duration-300 ${
                    item.isPrimary
                      ? "bg-blue-600 hover:bg-blue-700 shadow-lg"
                      : "hover:bg-gray-800"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
