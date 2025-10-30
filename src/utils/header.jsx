import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="w-full bg-black text-white shadow-lg flex items-center justify-between px-6 py-4 relative z-50">
      {/* Logo / Title */}
      <div className="flex items-center space-x-4">
        <img
          src={logo}
          alt="NRDC Logo"
          className="h-12 w-auto animate-slide-in-left"
        />
        <p className="text-gray-300 animate-slide-in-left delay-150">
          Minerals & Stones Testing
        </p>
      </div>

      {/* Right icons */}
      <div className="flex items-center space-x-6">
        <button className="relative text-gray-300 hover:text-yellow-500 transition-colors duration-300">
          <FontAwesomeIcon icon={faBell} size="lg" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
        </button>

        {/* Profile dropdown */}
        <div className="relative" ref={dropdownRef}>
          <div
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2 cursor-pointer hover:text-yellow-500 transition-colors duration-300"
          >
            <FontAwesomeIcon icon={faUserCircle} size="2x" />
            <span className="hidden sm:inline text-gray-200 font-medium">
              Admin
            </span>
          </div>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-gray-800 rounded-lg shadow-lg py-2 border border-gray-700 animate-fade-in">
              <button
                onClick={() => navigate("/myprofile")}
                className="w-full text-left px-4 py-2 text-gray-200 hover:bg-yellow-500 hover:text-black transition-colors duration-200"
              >
                My Profile
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-gray-200 hover:bg-yellow-500 hover:text-black transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
