import React from "react";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaChartBar,
} from "react-icons/fa";
import SidebarButton from "./SidebarButton";

const Sidebar = ({ isOpen, onToggle, onToggleSearch, onAddClick, onUpdateClick, onDeleteClick }) => {
  return (
    <aside
      className={`
        fixed left-0 top-0 z-50 h-screen bg-white shadow-lg transition-all duration-300 ease-in-out
        ${isOpen ? "w-25 translate-x-0" : "w-0 -translate-x-full"}
        flex flex-col py-6 overflow-hidden
      `}
    >
      {/* Espacio para el botón menú (ahora en header) */}
      <div className="mb-6"></div>

      {/*testing*/}
      {/* Logo */}
      <div className="mb-8 flex flex-col items-center">
        <div className="w-10 h-10 bg-yellow-200 rounded-full flex items-center justify-center mb-1">
          <span className="font-bold text-yellow-700 text-lg">E</span>
        </div>
        <span className="text-xs font-bold text-gray-700">Epic</span>
        <span className="text-[10px] text-gray-500">ENGINEERING</span>
      </div>

      {/* Navegación */}
      <nav className={`flex flex-col gap-5 w-full ${isOpen ? "px-3" : "px-1"}`}>
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
