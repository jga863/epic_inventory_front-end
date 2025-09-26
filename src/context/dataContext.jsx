import React, { createContext, useState } from 'react';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [newEmployeeEvent, setNewEmployeeEvent] = useState(null);
  const [newComputerEvent, setNewComputerEvent] = useState(null);

  const handleSearchSubmit = () => {
    setSearchTerm(searchInput.trim());
  };

  const handleSearchClear = () => {
    setSearchInput("");
    setSearchTerm("");
  };

  const handleEmployeeCreated = (employee) => {
    const displayName = employee?.fullName || [employee?.firstName, employee?.lastName].filter(Boolean).join(" ");
    setNewEmployeeEvent({ employee, ts: Date.now() });
    return displayName;
  };

  const handleEmployeeUpdated = (payload) => {
    const updated = payload?.record;
    if (updated) {
      setNewEmployeeEvent({ employee: updated, ts: Date.now() });
    }
  };

  const handleComputerCreated = (computer) => {
    setNewComputerEvent({ computer, ts: Date.now() });
    return computer?.name;
  };

  const handleComputerUpdated = (payload) => {
    const updated = payload?.record;
    if (updated) {
      setNewComputerEvent({ computer: updated, ts: Date.now() });
    }
  };

  const handleAssignmentCreated = () => {
    // Assignment created logic if needed
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
  };

  const handleEmployeeDeleted = () => {
    // Employee deleted logic if needed
  };

  const handleComputerDeleted = () => {
    // Computer deleted logic if needed
  };

  const value = {
    searchInput,
    searchTerm,
    newEmployeeEvent,
    newComputerEvent,
    setSearchInput,
    setSearchTerm,
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
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};