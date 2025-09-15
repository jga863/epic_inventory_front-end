import React from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

const SearchBar = ({
  value,
  onValueChange,
  onSearch,
  onClear,
  onClose,
  placeholder = "Search...",
  isLoading = false,
}) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch?.();
  };

  const handleInputChange = (event) => {
    onValueChange?.(event.target.value);
  };

  const handleClear = () => {
    onClear?.();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-0 shadow-sm"
    >
      <div className="flex flex-1 items-center gap-3">
        <FaSearch className="text-gray-400" aria-hidden="true" />
        <input
          type="search"
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
        />
      </div>
      <div className="flex items-center gap-2">
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="px-3 py-2 text-xs font-medium rounded-md border border-gray-400 bg-white text-gray-400 
             transition hover:bg-gray-100 hover:text-yellow-500 
             disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Clear
          </button>
        )}
        <button
          type="submit"
          className="px-3 py-2 text-xs font-medium rounded-md border border-gray-400 bg-white text-gray-400 
             transition hover:bg-gray-100 hover:text-yellow-500 
             disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? "Searching..." : "Search"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="ml-1 flex h-8 w-8 items-center justify-center rounded-full border border-gray-400 bg-white 
             text-gray-700 transition hover:bg-gray-100 hover:text-yellow-500 
             disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Close"
        >
          <FaTimes />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;


