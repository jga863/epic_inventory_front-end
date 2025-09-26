import React, { createContext, useState } from 'react';
import { ADD_VIEWS, UPDATE_VIEWS, DELETE_VIEWS, CATEGORIES } from '../constants/views.js';

export const ViewContext = createContext();

export const ViewProvider = ({ children }) => {
  const [selected, setSelected] = useState(CATEGORIES.COMPUTERS);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedComputer, setSelectedComputer] = useState(null);
  const [addView, setAddView] = useState(ADD_VIEWS.NONE);
  const [updateView, setUpdateView] = useState(UPDATE_VIEWS.NONE);
  const [deleteView, setDeleteView] = useState(DELETE_VIEWS.NONE);

  const resetSelections = () => {
    setSelectedEmployee(null);
    setSelectedComputer(null);
  };

  const openAddSelector = () => {
    resetSelections();
    setUpdateView(UPDATE_VIEWS.NONE);
    setDeleteView(DELETE_VIEWS.NONE);
    setAddView(prev => prev === ADD_VIEWS.SELECTOR ? ADD_VIEWS.NONE : ADD_VIEWS.SELECTOR);
  };

  const handleSelectAdd = (type) => {
    resetSelections();
    setUpdateView(UPDATE_VIEWS.NONE);
    if (type === ADD_VIEWS.EMPLOYEE) {
      setSelected(CATEGORIES.EMPLOYEE);
      setAddView(ADD_VIEWS.EMPLOYEE);
    } else if (type === ADD_VIEWS.COMPUTER) {
      setSelected(CATEGORIES.COMPUTERS);
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

  const openUpdateSelector = () => {
    resetSelections();
    setAddView(ADD_VIEWS.NONE);
    setDeleteView(DELETE_VIEWS.NONE);
    setUpdateView(prev => prev === UPDATE_VIEWS.SELECTOR ? UPDATE_VIEWS.NONE : UPDATE_VIEWS.SELECTOR);
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

  const openDeleteSelector = () => {
    resetSelections();
    setAddView(ADD_VIEWS.NONE);
    setUpdateView(UPDATE_VIEWS.NONE);
    setDeleteView(prev => prev === DELETE_VIEWS.SELECTOR ? DELETE_VIEWS.NONE : DELETE_VIEWS.SELECTOR);
  };

  const handleSelectDelete = (type) => {
    resetSelections();
    setAddView(ADD_VIEWS.NONE);
    setUpdateView(UPDATE_VIEWS.NONE);
    setDeleteView(type);
  };

  const closeDeleteView = () => {
    setDeleteView(DELETE_VIEWS.NONE);
  };

  const returnToDeleteSelector = () => {
    resetSelections();
    setDeleteView(DELETE_VIEWS.SELECTOR);
  };

  const handleFilterSelect = (value) => {
    setSelected(value);
    resetSelections();
    setAddView(ADD_VIEWS.NONE);
    setUpdateView(UPDATE_VIEWS.NONE);
    setDeleteView(DELETE_VIEWS.NONE);
  };

  const handleEmployeeClick = (employee) => {
    setAddView(ADD_VIEWS.NONE);
    setUpdateView(UPDATE_VIEWS.NONE);
    setDeleteView(DELETE_VIEWS.NONE);
    setSelectedEmployee(employee.id);
    setSelectedComputer(null);
  };

  const handleComputerClick = (computer) => {
    setAddView(ADD_VIEWS.NONE);
    setUpdateView(UPDATE_VIEWS.NONE);
    setDeleteView(DELETE_VIEWS.NONE);
    setSelectedComputer(computer.id);
    setSelectedEmployee(null);
  };

  const handleBackToList = () => {
    resetSelections();
    setAddView(ADD_VIEWS.NONE);
    setUpdateView(UPDATE_VIEWS.NONE);
    setDeleteView(DELETE_VIEWS.NONE);
  };

  const value = {
    selected,
    selectedEmployee,
    selectedComputer,
    addView,
    updateView,
    deleteView,
    setSelected,
    setSelectedEmployee,
    setSelectedComputer,
    resetSelections,
    openAddSelector,
    handleSelectAdd,
    handleOpenAssign,
    closeAddView,
    returnToAddSelector,
    openUpdateSelector,
    handleSelectUpdate,
    handleOpenUpdateAssignment,
    closeUpdateView,
    returnToUpdateSelector,
    openDeleteSelector,
    handleSelectDelete,
    closeDeleteView,
    returnToDeleteSelector,
    handleFilterSelect,
    handleEmployeeClick,
    handleComputerClick,
    handleBackToList,
  };

  return <ViewContext.Provider value={value}>{children}</ViewContext.Provider>;
};