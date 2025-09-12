import React from "react";
import epicLogo from "../assets/EpicLogo-Color.jpg";

const Header = () => (
  <header className="relative flex items-center px-8 py-6 bg-white">
    <img src={epicLogo} alt="Epic Engineering Logo" className="h-16 w-auto object-contain" />
    <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-gray-800">Inventory</h1>
    <div className="border-b-4 border-yellow-400 w-full absolute bottom-0 left-0"></div>
  </header>
);

export default Header;