import React from "react";
import {
  FaBars,
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaChartBar,
} from "react-icons/fa";
import SidebarButton from "./SidebarButton";

const Sidebar = ({ onToggleSearch, onAddClick, onUpdateClick }) => {
  return (
    <aside className="fixed left-0 top-0 z-50 h-screen w-20 bg-white flex flex-col items-center py-4 shadow-lg">
      <button className="mb-6 text-2xl text-gray-600 hover:text-purple-600" type="button">
        <FaBars />
      </button>

      <div className="mb-8 flex flex-col items-center">
        <div className="w-10 h-10 bg-yellow-200 rounded-full flex items-center justify-center mb-1 border-2 border-yellow-400">
          <span className="font-bold text-yellow-700 text-lg">E</span>
        </div>
        <span className="text-xs font-bold text-gray-700 uppercase tracking-[0.1em]">Epic</span>
        <span className="text-[10px] text-gray-500 uppercase tracking-[0.1em]">ENGINEERING</span>
      </div>

      <nav className="flex flex-col gap-4 w-full items-center">
        <SidebarButton icon={<FaPlus />} label="Add" onClick={onAddClick} />
        <SidebarButton icon={<FaSearch />} label="Find" onClick={() => onToggleSearch?.()} />
        <SidebarButton icon={<FaEdit />} label="Update" onClick={onUpdateClick} />
        <SidebarButton icon={<FaTrash />} label="Delete" />
        <SidebarButton icon={<FaChartBar />} label="Reports" />
      </nav>
    </aside>
  );
};

export default Sidebar;






