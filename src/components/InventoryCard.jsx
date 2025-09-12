import React from "react";

const InventoryCard = ({ id, name, model, image, onClick }) => (
  <div
    className="bg-gray-100 rounded-lg p-4 flex flex-col items-start w-36 h-36 cursor-pointer hover:shadow"
    onClick={onClick}
  >
    <div className="flex-1 flex items-center justify-center w-full">
      {image ? (
        <img src={image} alt="" className="w-16 h-16 object-contain" />
      ) : (
        <div className="w-16 h-16 bg-gray-300 rounded flex items-center justify-center">
          <span className="text-3xl">△ ◼ ●</span>
        </div>
      )}
    </div>
    <div className="mt-2 w-full">
      <div className="text-[10px] text-gray-500">ID: {id ?? "—"}</div>
      <div className="font-bold text-xs truncate">{name || "—"}</div>
      <div className="text-[10px] text-gray-600 truncate">{model || "—"}</div>
    </div>
  </div>
);

export default InventoryCard;