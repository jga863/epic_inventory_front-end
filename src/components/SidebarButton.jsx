import React from "react";

const SidebarButton = ({ icon, label }) => (
  <button className="flex flex-col items-center w-16 py-2 rounded-lg transition group">
    <div className="mb-1 w-10 h-10 flex items-center justify-center bg-white rounded-full group-hover:bg-yellow-100 shadow">
      <span className="text-xl text-yellow-500 group-hover:text-yellow-800">
        {icon}
      </span>
    </div>
    <span className="text-xs text-gray-700 group-hover:text-yellow-800">
      {label}
    </span>
  </button>
);

export default SidebarButton;