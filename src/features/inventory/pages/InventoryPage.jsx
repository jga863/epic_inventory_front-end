import React from 'react';
import { useContext } from 'react';
import { UIContext } from '../../../context/uiContext.jsx';
import { ViewContext } from '../../../context/viewContext.jsx';
import { DataContext } from '../../../context/dataContext.jsx';
import { ADD_VIEWS, UPDATE_VIEWS, DELETE_VIEWS } from '../../../constants/views.js';
import FilterBar from '../components/FilterBar';
import InventoryGrid from '../components/InventoryGrid';
import AddEmployeeModal from '../../employees/components/AddEmployeeModal';
import AddComputerForm from '../../computers/components/AddComputerForm';
import AssignPanel from '../../assignments/components/AssignPanel';
import UpdateSelector from '../../../shared/components/UpdateSelector';
import UpdateEmployeePanel from '../../employees/components/UpdateEmployeePanel';
import UpdateComputerPanel from '../../computers/components/UpdateComputerPanel';
import UpdateAssignmentPanel from '../../assignments/components/UpdateAssignmentPanel';
import DeleteSelector from '../../../shared/components/DeleteSelector';
import DeleteEmployeePanel from '../../employees/components/DeleteEmployeePanel';
import DeleteComputerPanel from '../../computers/components/DeleteComputerPanel';
import EmployeeProfile from '../../employees/components/EmployeeProfile';
import ComputerProfile from '../../computers/components/ComputerProfile';
import employeeChoiceIllustration from '../../../assets/epic_employee.png';
import computerChoiceIllustration from '../../../assets/epic_computer.png';
import useNavigation from '../../../hooks/useNavigation';
import useViewManagement from '../../../hooks/useViewManagement';

const InventoryPage = () => {
  const { isSearchVisible } = useContext(UIContext);
  const { selected, selectedEmployee, selectedComputer, addView, updateView, deleteView } = useContext(ViewContext);
  const { searchInput, searchTerm, newEmployeeEvent, newComputerEvent, setSearchInput, handleSearchSubmit, handleSearchClear, searchPlaceholder } = useContext(DataContext);

  const navigation = useNavigation();
  const viewManagement = useViewManagement();

  const handleCloseSearch = () => {
    navigation.toggleSearch();
    viewManagement.handleSearchClear();
  };

  // Conditional rendering logic from original App.jsx
  let mainContent = null;

  if (updateView === UPDATE_VIEWS.SELECTOR) {
    mainContent = (
      <UpdateSelector
        onSelectEmployee={() => navigation.handleSelectUpdate(UPDATE_VIEWS.EMPLOYEE)}
        onSelectComputer={() => navigation.handleSelectUpdate(UPDATE_VIEWS.COMPUTER)}
        onOpenAssignment={navigation.handleOpenUpdateAssignment}
      />
    );
  } else if (updateView === UPDATE_VIEWS.EMPLOYEE) {
    mainContent = (
      <UpdateEmployeePanel
        onBack={navigation.returnToUpdateSelector}
        onSuccess={viewManagement.onEmployeeUpdated}
      />
    );
  } else if (updateView === UPDATE_VIEWS.COMPUTER) {
    mainContent = (
      <UpdateComputerPanel
        onBack={navigation.returnToUpdateSelector}
        onSuccess={viewManagement.onComputerUpdated}
      />
    );
  } else if (updateView === UPDATE_VIEWS.ASSIGNMENT) {
    mainContent = (
      <UpdateAssignmentPanel
        onBack={navigation.returnToUpdateSelector}
        onSuccess={viewManagement.onAssignmentUpdated}
      />
    );
  } else if (deleteView === DELETE_VIEWS.SELECTOR) {
    mainContent = (
      <DeleteSelector
        onSelectEmployee={() => navigation.handleSelectDelete(DELETE_VIEWS.EMPLOYEE)}
        onSelectComputer={() => navigation.handleSelectDelete(DELETE_VIEWS.COMPUTER)}
      />
    );
  } else if (deleteView === DELETE_VIEWS.EMPLOYEE) {
    mainContent = (
      <DeleteEmployeePanel
        onBack={navigation.returnToDeleteSelector}
        onSuccess={viewManagement.onEmployeeDeleted}
      />
    );
  } else if (deleteView === DELETE_VIEWS.COMPUTER) {
    mainContent = (
      <DeleteComputerPanel
        onBack={navigation.returnToDeleteSelector}
        onSuccess={viewManagement.onComputerDeleted}
      />
    );
  } else if (addView === ADD_VIEWS.SELECTOR) {
    mainContent = (
      <div className="flex h-full w-full items-center justify-center px-4 py-12">
        <div className="relative w-full max-w-3xl rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="absolute -left-6 top-1/2 hidden h-28 w-5 -translate-y-1/2 rounded-r-3xl border border-gray-200 bg-white lg:block" />
          <div className="absolute -right-6 top-1/2 hidden h-28 w-5 -translate-y-1/2 rounded-l-3xl border border-gray-200 bg-white lg:block" />
          <div className="rounded-2xl border border-gray-100 bg-gray-50 px-10 py-8 text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.6em] text-yellow-500">
              Add
            </span>
            <h2 className="mt-3 text-center text-lg font-semibold text-gray-800">What would you like to add?</h2>
            <p className="mt-1 text-center text-sm text-gray-500">Please select the correct form.</p>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <button
                type="button"
                onClick={() => navigation.handleSelectAdd(ADD_VIEWS.EMPLOYEE)}
                className="group flex h-full flex-col items-center rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:border-yellow-400 hover:shadow-lg"
              >
                <span className="text-sm font-semibold text-yellow-700 group-hover:text-yellow-800">New Employee</span>
                <div className="mt-4 flex h-32 w-full items-center justify-center rounded-xl bg-gray-100">
                  <img src={employeeChoiceIllustration} alt="Add employee" className="h-24 object-contain" />
                </div>
              </button>
              <button
                type="button"
                onClick={() => navigation.handleSelectAdd(ADD_VIEWS.COMPUTER)}
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
                onClick={navigation.handleOpenAssign}
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
        onClose={navigation.closeAddView}
        onSuccess={viewManagement.onEmployeeCreated}
      />
    );
  } else if (addView === ADD_VIEWS.COMPUTER) {
    mainContent = (
      <AddComputerForm isOpen onClose={navigation.closeAddView} onSuccess={viewManagement.onComputerCreated} />
    );
  } else if (addView === ADD_VIEWS.ASSIGN) {
    mainContent = (
      <AssignPanel
        onClose={navigation.returnToAddSelector}
        onAssignmentCreated={viewManagement.onAssignmentCreated}
      />
    );
  } else if (selectedEmployee) {
    mainContent = (
      <div className="flex-1">
        <EmployeeProfile
          employeeId={selectedEmployee}
          onBack={navigation.handleBackToList}
        />
      </div>
    );
  } else if (selectedComputer) {
    mainContent = (
      <div className="flex-1">
        <ComputerProfile
          computerId={selectedComputer}
          onBack={navigation.handleBackToList}
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
        onEmployeeClick={navigation.handleEmployeeClick}
        onComputerClick={navigation.handleComputerClick}
        newEmployeeEvent={newEmployeeEvent}
        newComputerEvent={newComputerEvent}
      />
    );
  }

  return (
    <>
      <FilterBar selected={selected} onSelect={navigation.handleFilterSelect} />
      {mainContent}
    </>
  );
};

export default InventoryPage;