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

const Sidebar = ({ onToggleSearch, onAddClick, onUpdateClick, onDeleteClick }) => {
  return (
    <aside className="fixed left-0 top-0 z-50 h-screen w-20 bg-white flex flex-col items-center py-4 shadow-lg">
      <button className="mb-6 text-2xl text-gray-600 hover:text-purple-600" type="button">
        <FaBars />
      </button>
      <nav className="flex flex-col gap-4">
        <SidebarButton icon={<FaSearch />} label="Search" onClick={onToggleSearch} />
        <SidebarButton icon={<FaPlus />} label="Add" onClick={onAddClick} />
        <SidebarButton icon={<FaEdit />} label="Update" onClick={onUpdateClick} />
        <SidebarButton icon={<FaTrash />} label="Delete" onClick={onDeleteClick} />
        <SidebarButton icon={<FaChartBar />} label="Reports" />
      </nav>
    </aside>
  );
};

export default Sidebar;
