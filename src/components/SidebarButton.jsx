import React from "react";

const SidebarButton = ({ icon, label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex flex-col items-center w-20 py-2 rounded-lg transition-all duration-300 group"
  >
    <div className="w-10 h-10 flex items-center justify-center bg-white rounded-full group-hover:bg-yellow-100 shadow flex-shrink-0">
      <span className="text-xl text-yellow-500 group-hover:text-yellow-800">
        {icon}
      </span>
    </div>
    <span className="text-xs text-gray-700 group-hover:text-yellow-800 mt-1">
      {label}
    </span>
  </button>
);

export default SidebarButton;
