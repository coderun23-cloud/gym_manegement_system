// components/Header.jsx
import { useContext, useEffect, useRef, useState } from "react";
import { FiMenu, FiUser } from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import {
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";

const Header = ({ toggleSidebar }) => {
  const { token, setUser, setToken, user } = useContext(AppContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const nav = useNavigate();

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
      nav("/");
    }
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <header className="bg-white shadow-sm p-4 flex justify-between items-center w-full fixed top-0 left-0 right-0 z-40">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="text-gray-600 focus:outline-none cursor-pointer mr-4"
          >
            <FiMenu size={24} />
          </button>
          {/* You can add your logo/brand here if needed */}
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center text-gray-600 focus:outline-none p-1 hover:bg-gray-100 rounded-full"
            >
              <FiUser className="text-gray-400" size={20} />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                <div className="px-4 py-2 text-sm text-gray-700 border-b">
                  <div className="font-medium">Logged in as</div>
                  <div className="truncate">{user?.name}</div>
                </div>
                <Link
                  to="/account"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <div className="flex items-center">
                    <UserCircleIcon className="h-4 w-4 mr-2" />
                    My Account
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center border-t"
                >
                  <ArrowLeftOnRectangleIcon className="h-4 w-4 mr-2" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      <br />
      <br />
      <br />
    </>
  );
};

export default Header;
