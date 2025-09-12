import React from "react";

const FilterBar = ({ selected, onSelect }) => {
  const categories = ["Employee", "Computers", "Monitors", "Battery Backup", "Periferal", "Survey"];

  return (
    <div className="bg-white px-8 py-4 border-b border-gray-200">
      <div className="flex gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelect(category)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selected === category
                ? "bg-yellow-400 text-yellow-600"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-yellow-500"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;