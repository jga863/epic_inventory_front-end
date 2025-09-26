import { useContext } from 'react';
import { UIContext } from '../context/uiContext.jsx';
import { ViewContext } from '../context/viewContext.jsx';
import { DataContext } from '../context/dataContext.jsx';

const useViewManagement = () => {
  const { showToast } = useContext(UIContext);
  const { selected, selectedEmployee, selectedComputer } = useContext(ViewContext);
  const {
    searchInput,
    searchTerm,
    newEmployeeEvent,
    newComputerEvent,
    setSearchInput,
    handleSearchSubmit,
    handleSearchClear,
    handleEmployeeCreated,
    handleEmployeeUpdated,
    handleComputerCreated,
    handleComputerUpdated,
    handleAssignmentCreated,
    handleAssignmentUpdated,
    handleEmployeeDeleted,
    handleComputerDeleted,
  } = useContext(DataContext);

  const onEmployeeCreated = (employee) => {
    const displayName = handleEmployeeCreated(employee);
    showToast(displayName ? `${displayName} added successfully.` : "Employee added successfully.");
  };

  const onEmployeeUpdated = (payload) => {
    handleEmployeeUpdated(payload);
    showToast("Employee updated successfully.");
  };

  const onComputerCreated = (computer) => {
    const name = handleComputerCreated(computer);
    showToast(name ? `${name} added successfully.` : "Computer added successfully.");
  };

  const onComputerUpdated = (payload) => {
    handleComputerUpdated(payload);
    showToast("Computer updated successfully.");
  };

  const onAssignmentCreated = () => {
    handleAssignmentCreated();
    showToast("Assignment created successfully.");
  };

  const onAssignmentUpdated = (payload) => {
    handleAssignmentUpdated(payload);
    const computer = payload?.summary?.computer;
    const message = computer ? "Assignment updated successfully." : "Computer unassigned successfully.";
    showToast(message);
  };

  const onEmployeeDeleted = () => {
    handleEmployeeDeleted();
    showToast("Employee deleted successfully.");
  };

  const onComputerDeleted = () => {
    handleComputerDeleted();
    showToast("Computer deleted successfully.");
  };

  const searchPlaceholder = selected === "Employee" ? "Search employee by name" : "Search computer by name";

  return {
    selected,
    selectedEmployee,
    selectedComputer,
    searchInput,
    searchTerm,
    newEmployeeEvent,
    newComputerEvent,
    setSearchInput,
    handleSearchSubmit,
    handleSearchClear,
    searchPlaceholder,
    onEmployeeCreated,
    onEmployeeUpdated,
    onComputerCreated,
    onComputerUpdated,
    onAssignmentCreated,
    onAssignmentUpdated,
    onEmployeeDeleted,
    onComputerDeleted,
  };
};

export default useViewManagement;