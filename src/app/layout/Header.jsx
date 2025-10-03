import React from "react";
import { FaBars, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../../context/authContext";
import epicLogo from "../../assets/EpicLogo-Color.jpg";

const Header = ({ onMenuClick }) => {
  const { username, logout } = useAuth();

  return (
    <header className="relative flex items-center justify-between px-4 md:px-8 py-4 md:py-6 bg-white">
      <div className="flex items-center">
        <button
          className="mr-4 p-2 text-gray-600 hover:text-gray-800"
          onClick={onMenuClick}
          type="button"
        >
          <FaBars size={20} />
        </button>
        <img src={epicLogo} alt="Epic Engineering Logo" className="h-12 md:h-16 w-auto object-contain" />
      </div>
      <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl md:text-4xl font-bold text-gray-800">Inventory</h1>
      <div className="flex items-center space-x-4">
        <span className="text-gray-700">{username}</span>
        <button
          className="p-2 text-gray-600 hover:text-gray-800"
          onClick={logout}
          type="button"
          title="Logout"
        >
          <FaSignOutAlt size={20} />
        </button>
      </div>
      <div className="border-b-4 border-yellow-400 w-full absolute bottom-0 left-0"></div>
    </header>
  );
};

export default Header;