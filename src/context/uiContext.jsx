import React, { createContext, useState, useEffect } from 'react';

export const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [toast, setToast] = useState(null);

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  const toggleSearch = () => setIsSearchVisible(prev => !prev);

  const showToast = (message, type = 'success') => {
    setToast({
      id: Date.now(),
      type,
      message,
    });
  };

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const value = {
    isSidebarOpen,
    isSearchVisible,
    toast,
    toggleSidebar,
    toggleSearch,
    showToast,
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};