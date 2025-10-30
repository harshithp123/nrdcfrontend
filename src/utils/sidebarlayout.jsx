import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faFileAlt,
  faUserPlus,
  faUsers,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const SidebarLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
const user = useSelector((state) => state.auth.user);
  // const menuItems = [
  //   { name: "Dashboard", icon: faTachometerAlt, path: "/dashboard" },
  //   { name: "Add Form", icon: faFileAlt, path: "/create-form" },
  //    { name: "manage Form", icon: faFileAlt, path: "/view-form" },
  //   { name: "Onboard", icon: faUserPlus, path: "/onboard" },
  //   // { name: "User Support", icon: faUsers, path: "/support" },
  // ];
 let menuItems = [
    { name: "Dashboard", icon: faTachometerAlt, path: "/dashboard" },
    { name: "Add Form", icon: faFileAlt, path: "/create-form" },
    { name: "Manage Form", icon: faFileAlt, path: "/view-form" },
    { name: "Onboard", icon: faUserPlus, path: "/onboard" },
  ];

  // remove "Add Form" if role_id === 2
  if (user?.role_id === 2) {
    menuItems = menuItems.filter((item) => item.name !== "Add Form");
  }
  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      {/* Sidebar */}
      <div
        className={`bg-black flex flex-col transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <span
            className={`font-bold text-lg transition-all duration-300 ${
              isCollapsed
                ? "opacity-0 w-0 overflow-hidden"
                : "opacity-100 w-auto"
            }`}
          >
            NRDC
          </span>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-yellow-500 hover:text-yellow-400 focus:outline-none transform transition-transform duration-200 hover:scale-110 active:scale-95"
          >
            <FontAwesomeIcon icon={faBars} size="lg" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 mt-4">
          {menuItems.map((item) => {
            const active = isActive(item.path);
            return (
              <div
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`
                  group flex items-center cursor-pointer p-4 relative overflow-hidden
                  transition-all duration-200 ease-out
                  hover:bg-gray-800 hover:pl-6
                  ${active ? "bg-gray-800 pl-6" : ""}
                `}
              >
                {/* Active Indicator Bar */}
                <div
                  className={`
                    absolute left-0 top-0 bottom-0 w-1 bg-yellow-500
                    transform transition-transform duration-300 origin-left
                    ${active ? "scale-x-100" : "scale-x-0"}
                  `}
                />

                {/* Icon with pulse on active */}
                <div
                  className={`
                    transition-all duration-200
                    ${active ? "text-yellow-400 scale-125" : "text-yellow-500"}
                  `}
                >
                  <FontAwesomeIcon icon={item.icon} />
                </div>

                {/* Label with smooth slide */}
                <span
                  className={`
                    ml-4 text-gray-200 group-hover:text-white whitespace-nowrap
                    transition-all duration-300 ease-in-out
                    ${isCollapsed ? "opacity-0 translate-x-[-20px]" : "opacity-100 translate-x-0"}
                  `}
                >
                  {item.name}
                </span>

                {/* Hover glow effect */}
                <div
                  className={`
                    absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-transparent opacity-0
                    group-hover:opacity-100 transition-opacity duration-300 pointer-events-none
                  `}
                />
              </div>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-6 overflow-auto animate-fadeIn">
        {children}
      </div>
    </div>
  );
};

export default SidebarLayout;
