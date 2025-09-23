import React from "react";
import { FaBars } from "react-icons/fa";
import epicLogo from "../assets/EpicLogo-Color.jpg";

const Header = ({ onMenuClick }) => (
  <header className="relative flex items-center px-4 md:px-8 py-4 md:py-6 bg-white">
    <button
      className="mr-4 p-2 text-gray-600 hover:text-gray-800"
      onClick={onMenuClick}
      type="button"
    >
      <FaBars size={20} />
    </button>
    <img src={epicLogo} alt="Epic Engineering Logo" className="h-12 md:h-16 w-auto object-contain" />
    <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl md:text-4xl font-bold text-gray-800">Inventory</h1>
    <div className="border-b-4 border-yellow-400 w-full absolute bottom-0 left-0"></div>
  </header>
);

export default Header;