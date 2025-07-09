// components/Sidebar.jsx
import { motion } from "framer-motion";
import {
  FiHome,
  FiUsers,
  FiDollarSign,
  FiCalendar,
  FiSettings,
  FiUser,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import { RiFileList2Fill, RiTimeFill } from "react-icons/ri";

const Sidebar = ({ isMobile, isSidebarOpen, toggleSidebar, location }) => {
  const sidebarRef = useRef(null);

  const navItems = [
    { path: "/index", name: "Home", icon: <FiHome /> },
    { path: "/members", name: "Members", icon: <FiUsers /> },
    { path: "/staff", name: "Staff", icon: <FiUser /> },
    { path: "/plans", name: "Plans", icon: <RiFileList2Fill /> },
    { path: "/payments", name: "Payments", icon: <FiDollarSign /> },
    { path: "/schedules", name: "Schedule", icon: <FiCalendar /> },
    { path: "/attendance", name: "Attendance", icon: <RiTimeFill /> },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      // If sidebar is open and the click is outside of it, close the sidebar
      if (
        isSidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        toggleSidebar();
      }
    };

    // Only add listener if on mobile
    if (isMobile) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen, isMobile, toggleSidebar]);

  return (
    <motion.div
      ref={sidebarRef}
      initial={{ x: isMobile ? -300 : 0 }}
      animate={{ x: isSidebarOpen ? 0 : -300 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`fixed z-20 w-64 bg-gray-800 text-white h-full shadow-lg`}
    >
      <div className="p-4 flex items-center justify-between border-b border-gray-700">
        <h1 className="text-xl font-bold">MAV GYM</h1>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center p-3 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
                onClick={() => isMobile && toggleSidebar()} // Close sidebar when a link is clicked on mobile
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </motion.div>
  );
};

export default Sidebar;
