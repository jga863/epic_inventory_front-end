import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import FilterBar from "./components/FilterBar";
import InventoryGrid from "./components/InventoryGrid";
import EmployeeProfile from "./components/EmployeeProfile";
import ComputerProfile from "./components/ComputerProfile";
import AddEmployeeModal from "./components/AddEmployeeModal";
import AddComputerForm from "./components/AddComputerForm";
import AssignPanel from "./components/AssignPanel";
import UpdateSelector from "./components/UpdateSelector";
import UpdateEmployeePanel from "./components/UpdateEmployeePanel";
import UpdateComputerPanel from "./components/UpdateComputerPanel";
import UpdateAssignmentPanel from "./components/UpdateAssignmentPanel";
import employeeChoiceIllustration from "./assets/epic_employee.png";
import computerChoiceIllustration from "./assets/epic_computer.png";

const ADD_VIEWS = {
  NONE: "none",
  SELECTOR: "selector",
  EMPLOYEE: "employee",
  COMPUTER: "computer",
  ASSIGN: "assign",
};

const UPDATE_VIEWS = {
  NONE: "none",
  SELECTOR: "selector",
  EMPLOYEE: "employee",
  COMPUTER: "computer",
  ASSIGNMENT: "assignment",
};

function App() {
  const [selected, setSelected] = useState("Computers");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedComputer, setSelectedComputer] = useState(null);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [addView, setAddView] = useState(ADD_VIEWS.NONE);
  const [updateView, setUpdateView] = useState(UPDATE_VIEWS.NONE);
  const [newEmployeeEvent, setNewEmployeeEvent] = useState(null);
  const [newComputerEvent, setNewComputerEvent] = useState(null);
  const [toast, setToast] = useState(null);

  const resetSelections = () => {
    setSelectedEmployee(null);
    setSelectedComputer(null);
  };

  const handleToggleSearch = () => {
    setAddView(ADD_VIEWS.NONE);
    setUpdateView(UPDATE_VIEWS.NONE);
    setIsSearchVisible((prev) => {
      const next = !prev;
      if (next) {
        setSearchInput((current) => (current.length ? current : searchTerm));
      } else {
        setSearchInput("");
        setSearchTerm("");
      }
      return next;
    });
  };

  const handleSearchSubmit = () => {
    setSearchTerm(searchInput.trim());
  };

  const handleSearchClear = () => {
    setSearchInput("");
    setSearchTerm("");
  };

  const handleCloseSearch = () => {
    setIsSearchVisible(false);
    handleSearchClear();
  };

  const openAddSelector = () => {
    resetSelections();
    setUpdateView(UPDATE_VIEWS.NONE);
    setAddView((current) =>
      current === ADD_VIEWS.SELECTOR ? ADD_VIEWS.NONE : ADD_VIEWS.SELECTOR
    );
  };

  const handleSelectAdd = (type) => {
    resetSelections();
    setUpdateView(UPDATE_VIEWS.NONE);
    if (type === ADD_VIEWS.EMPLOYEE) {
      setSelected("Employee");
      setAddView(ADD_VIEWS.EMPLOYEE);
    } else if (type === ADD_VIEWS.COMPUTER) {
      setSelected("Computers");
      setAddView(ADD_VIEWS.COMPUTER);
    }
  };

  const handleOpenAssign = () => {
    resetSelections();
    setUpdateView(UPDATE_VIEWS.NONE);
    setAddView(ADD_VIEWS.ASSIGN);
  };

  const closeAddView = () => {
    setAddView(ADD_VIEWS.NONE);
  };

  const returnToAddSelector = () => {
    resetSelections();
    setAddView(ADD_VIEWS.SELECTOR);
  };

  const handleAssignmentCreated = () => {
    setToast({
      id: Date.now(),
      type: "success",
      message: "Assignment created successfully.",
    });
    setAddView(ADD_VIEWS.NONE);
    setUpdateView(UPDATE_VIEWS.NONE);
  };

  const openUpdateSelector = () => {
    resetSelections();
    setAddView(ADD_VIEWS.NONE);
    setUpdateView((current) =>
      current === UPDATE_VIEWS.SELECTOR ? UPDATE_VIEWS.NONE : UPDATE_VIEWS.SELECTOR
    );
  };

  const handleSelectUpdate = (view) => {
    resetSelections();
    setAddView(ADD_VIEWS.NONE);
    setUpdateView(view);
  };

  const handleOpenUpdateAssignment = () => {
    resetSelections();
    setAddView(ADD_VIEWS.NONE);
    setUpdateView(UPDATE_VIEWS.ASSIGNMENT);
  };

  const closeUpdateView = () => {
    setUpdateView(UPDATE_VIEWS.NONE);
  };

  const returnToUpdateSelector = () => {
    resetSelections();
    setUpdateView(UPDATE_VIEWS.SELECTOR);
  };

  const handleEmployeeCreated = (employee) => {
    const displayName =
      employee?.fullName ||
      [employee?.firstName, employee?.lastName].filter(Boolean).join(" ");
    setSelected("Employee");
    setAddView(ADD_VIEWS.NONE);
    setNewEmployeeEvent({ employee, ts: Date.now() });
    setToast({
      id: Date.now(),
      type: "success",
      message: displayName
        ? `${displayName} added successfully.`
        : "Employee added successfully.",
    });
  };

  const handleEmployeeUpdated = (payload) => {
    const updated = payload?.record;
    if (updated) {
      setSelected("Employee");
      setNewEmployeeEvent({ employee: updated, ts: Date.now() });
    }
    resetSelections();
    setAddView(ADD_VIEWS.NONE);
    setUpdateView(UPDATE_VIEWS.NONE);
    setToast({
      id: Date.now(),
      type: "success",
      message: "Employee updated successfully.",
    });
  };
  const handleComputerCreated = (computer) => {
    setSelected("Computers");
    setAddView(ADD_VIEWS.NONE);
    setNewComputerEvent({ computer, ts: Date.now() });
    setToast({
      id: Date.now(),
      type: "success",
      message: computer?.name
        ? `${computer.name} added successfully.`
        : "Computer added successfully.",
    });
  };

  const handleComputerUpdated = (payload) => {
    const updated = payload?.record;
    if (updated) {
      setSelected("Computers");
      setNewComputerEvent({ computer: updated, ts: Date.now() });
    }
    resetSelections();
    setAddView(ADD_VIEWS.NONE);
    setUpdateView(UPDATE_VIEWS.NONE);
    setToast({
      id: Date.now(),
      type: "success",
      message: "Computer updated successfully.",
    });
  };

  const handleAssignmentUpdated = (payload) => {
    const summary = payload?.summary;
    const employee = summary?.employee;
    const computer = summary?.computer;
    if (employee) {
      setNewEmployeeEvent({ employee, ts: Date.now() });
    }
    if (computer) {
      setNewComputerEvent({ computer, ts: Date.now() });
    }
    const message = computer
      ? "Assignment updated successfully."
      : "Computer unassigned successfully.";
    setToast({
      id: Date.now(),
      type: "success",
      message,
    });
  };

  useEffect(() => {
    if (!toast) {
      return undefined;
    }
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleEmployeeClick = (employee) => {
    setAddView(ADD_VIEWS.NONE);
    setUpdateView(UPDATE_VIEWS.NONE);
    setSelectedEmployee(employee.id);
    setSelectedComputer(null);
  };

  const handleComputerClick = (computer) => {
    setAddView(ADD_VIEWS.NONE);
    setUpdateView(UPDATE_VIEWS.NONE);
    setSelectedComputer(computer.id);
    setSelectedEmployee(null);
  };

  const handleBackToList = () => {
    resetSelections();
    setAddView(ADD_VIEWS.NONE);
    setUpdateView(UPDATE_VIEWS.NONE);
  };

  const handleFilterSelect = (value) => {
    setSelected(value);
    resetSelections();
    setAddView(ADD_VIEWS.NONE);
    setUpdateView(UPDATE_VIEWS.NONE);
  };

  const searchPlaceholder =
    selected === "Employee"
      ? "Search employee by name"
      : "Search computer by name";

  const toastNode = toast ? (
    <div className="fixed top-6 right-6 z-50 rounded bg-green-100 px-4 py-2 text-sm font-medium text-green-800 shadow">
      {toast.message}
    </div>
  ) : null;

  let mainContent = null;

  if (updateView === UPDATE_VIEWS.SELECTOR) {
    mainContent = (
      <UpdateSelector
        onSelectEmployee={() => handleSelectUpdate(UPDATE_VIEWS.EMPLOYEE)}
        onSelectComputer={() => handleSelectUpdate(UPDATE_VIEWS.COMPUTER)}
        onOpenAssignment={handleOpenUpdateAssignment}
      />
    );
  } else if (updateView === UPDATE_VIEWS.EMPLOYEE) {
    mainContent = (
      <UpdateEmployeePanel
        onBack={returnToUpdateSelector}
        onSuccess={handleEmployeeUpdated}
      />
    );
  } else if (updateView === UPDATE_VIEWS.COMPUTER) {
    mainContent = (
      <UpdateComputerPanel
        onBack={returnToUpdateSelector}
        onSuccess={handleComputerUpdated}
      />
    );
  } else if (updateView === UPDATE_VIEWS.ASSIGNMENT) {
    mainContent = (
      <UpdateAssignmentPanel
        onBack={returnToUpdateSelector}
        onSuccess={handleAssignmentUpdated}
      />
    );
  } else if (addView === ADD_VIEWS.SELECTOR) {
    mainContent = (
      <div className="flex h-full w-full items-center justify-center px-4 py-12">
        <div className="relative w-full max-w-3xl rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="absolute -left-6 top-1/2 hidden h-28 w-5 -translate-y-1/2 rounded-r-3xl border border-gray-200 bg-white lg:block" />
          <div className="absolute -right-6 top-1/2 hidden h-28 w-5 -translate-y-1/2 rounded-l-3xl border border-gray-200 bg-white lg:block" />
          <div className="rounded-2xl border border-gray-100 bg-gray-50 px-10 py-8">
            <span className="text-xs font-semibold uppercase tracking-[0.6em] text-yellow-500">
              Add
            </span>
            <h2 className="mt-3 text-center text-lg font-semibold text-gray-800">What would you like to add?</h2>
            <p className="mt-1 text-center text-sm text-gray-500">Please select the correct form.</p>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <button
                type="button"
                onClick={() => handleSelectAdd(ADD_VIEWS.EMPLOYEE)}
                className="group flex h-full flex-col items-center rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:border-yellow-400 hover:shadow-lg"
              >
                <span className="text-sm font-semibold text-yellow-700 group-hover:text-yellow-800">New Employee</span>
                <div className="mt-4 flex h-32 w-full items-center justify-center rounded-xl bg-gray-100">
                  <img src={employeeChoiceIllustration} alt="Add employee" className="h-24 object-contain" />
                </div>
              </button>
              <button
                type="button"
                onClick={() => handleSelectAdd(ADD_VIEWS.COMPUTER)}
                className="group flex h-full flex-col items-center rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:border-yellow-400 hover:shadow-lg"
              >
                <span className="text-sm font-semibold text-yellow-700 group-hover:text-yellow-800">New computer</span>
                <div className="mt-4 flex h-32 w-full items-center justify-center rounded-xl bg-gray-100">
                  <img src={computerChoiceIllustration} alt="Add computer" className="h-24 object-contain" />
                </div>
              </button>
            </div>
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={handleOpenAssign}
                className="flex min-w-[260px] items-center justify-center rounded-full border border-yellow-400 bg-white px-8 py-4 text-base font-semibold text-yellow-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-yellow-50"
              >
                Assign computer to an employee
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (addView === ADD_VIEWS.EMPLOYEE) {
    mainContent = (
      <AddEmployeeModal
        isOpen
        onClose={closeAddView}
        onSuccess={handleEmployeeCreated}
      />
    );
  } else if (addView === ADD_VIEWS.COMPUTER) {
    mainContent = (
      <AddComputerForm isOpen onClose={closeAddView} onSuccess={handleComputerCreated} />
    );
  } else if (addView === ADD_VIEWS.ASSIGN) {
    mainContent = (
      <AssignPanel
        onClose={returnToAddSelector}
        onAssignmentCreated={handleAssignmentCreated}
      />
    );
  } else if (selectedEmployee) {
    mainContent = (
      <div className="flex-1">
        <EmployeeProfile
          employeeId={selectedEmployee}
          onBack={handleBackToList}
        />
      </div>
    );
  } else if (selectedComputer) {
    mainContent = (
      <div className="flex-1">
        <ComputerProfile
          computerId={selectedComputer}
          onBack={handleBackToList}
        />
      </div>
    );
  } else {
    mainContent = (
      <InventoryGrid
        category={selected}
        searchTerm={searchTerm}
        isSearchVisible={isSearchVisible}
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        onSearchSubmit={handleSearchSubmit}
        onSearchClear={handleSearchClear}
        onSearchClose={handleCloseSearch}
        searchPlaceholder={searchPlaceholder}
        onEmployeeClick={handleEmployeeClick}
        onComputerClick={handleComputerClick}
        newEmployeeEvent={newEmployeeEvent}
        newComputerEvent={newComputerEvent}
      />
    );
  }

  return (
    <>
      <div className="flex min-h-screen bg-white">
        <Sidebar
          onToggleSearch={handleToggleSearch}
          onAddClick={openAddSelector}
          onUpdateClick={openUpdateSelector}
        />
        <main className="flex-1 ml-20 flex flex-col">
          <Header />
          <FilterBar selected={selected} onSelect={handleFilterSelect} />
          <div className="flex-1 overflow-auto">
            {mainContent}
          </div>
        </main>
      </div>
      {toastNode}
    </>
  );
}

export default App;




















