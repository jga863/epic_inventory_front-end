import { useContext } from 'react';
import { UIContext } from '../context/uiContext.jsx';
import { ViewContext } from '../context/viewContext.jsx';

const useNavigation = () => {
  const { toggleSidebar, toggleSearch } = useContext(UIContext);
  const {
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
  } = useContext(ViewContext);

  return {
    toggleSidebar,
    toggleSearch,
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
};

export default useNavigation;