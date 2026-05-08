import React from 'react';

const AssignmentItem = ({ assignment, isSelected, onClick }) => {
  const employee = assignment.employee || {};
  const computer = assignment.computer || {};

  return (
    <button
      type="button"
      onClick={() => onClick(assignment)}
      className={`w-full rounded-xl border px-4 py-3 text-left transition ${
        isSelected
          ? "border-yellow-500 bg-yellow-50"
          : "border-white bg-white hover:border-gray-200"
      }`}
    >
      <div className="text-[11px] uppercase tracking-[0.2em] text-yellow-500">
        ID: {employee.id}
      </div>
      <div className="text-sm font-semibold text-gray-800">
        {employee.fullName || employee.name || "Unnamed"}
      </div>
      {employee.email && (
        <div className="text-xs text-gray-500">{employee.email}</div>
      )}
      {computer && computer.name ? (
        <div className="mt-2 text-xs text-gray-400">
          Computer: {computer.name}
        </div>
      ) : null}
    </button>
  );
};

export default AssignmentItem;