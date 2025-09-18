import React from "react";
import employeeChoiceIllustration from "../assets/epic_employee.png";
import computerChoiceIllustration from "../assets/epic_computer.png";

const DeleteSelector = ({ onSelectEmployee, onSelectComputer }) => {
  return (
    <div className="flex h-full w-full items-center justify-center px-4 py-12">
      <div className="relative w-full max-w-3xl rounded-3xl border border-gray-200 bg-white p-10 shadow-sm">
        <div className="absolute -left-6 top-1/2 hidden h-28 w-5 -translate-y-1/2 rounded-r-3xl border border-gray-200 bg-white lg:block" />
        <div className="absolute -right-6 top-1/2 hidden h-28 w-5 -translate-y-1/2 rounded-l-3xl border border-gray-200 bg-white lg:block" />

        <div className="mb-6 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.6em] text-yellow-500">
            Delete
          </span>
          <h2 className="mt-3 text-lg font-semibold text-gray-800">
            What item do you want to delete?
          </h2>
          <p className="mt-1 text-sm text-gray-500">Please select the correct form.</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-gray-50 px-10 py-8">
          <div className="grid gap-6 md:grid-cols-2">
            <button
              type="button"
              onClick={() => onSelectEmployee?.()}
              className="group flex h-full flex-col items-center rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:border-yellow-400 hover:shadow-lg"
            >
              <span className="text-sm font-semibold text-yellow-700 group-hover:text-yellow-800">Employee</span>
              <div className="mt-4 flex h-32 w-full items-center justify-center rounded-xl bg-gray-100">
                <img src={employeeChoiceIllustration} alt="Delete employee" className="h-24 object-contain" />
              </div>
            </button>
            <button
              type="button"
              onClick={() => onSelectComputer?.()}
              className="group flex h-full flex-col items-center rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:border-yellow-400 hover:shadow-lg"
            >
              <span className="text-sm font-semibold text-yellow-700 group-hover:text-yellow-800">Computer</span>
              <div className="mt-4 flex h-32 w-full items-center justify-center rounded-xl bg-gray-100">
                <img src={computerChoiceIllustration} alt="Delete computer" className="h-24 object-contain" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteSelector;
