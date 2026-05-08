/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect } from 'react';

export const UIContext = createContext();

const THEME_STORAGE_KEY = "epic-inventory-theme";

function resolveInitialTheme() {
  if (typeof window === "undefined") {
    return "light";
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export const UIProvider = ({ children }) => {
  const [toast, setToast] = useState(null);
  const [theme, setTheme] = useState(resolveInitialTheme);

  const toggleTheme = () => setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));

  const showToast = (message, type = 'success') => {
    setToast({
      id: Date.now(),
      type,
      message,
    });
  };

  const dismissToast = () => setToast(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const value = {
    toast,
    theme,
    toggleTheme,
    showToast,
    dismissToast,
    setTheme,
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

export const useUI = () => React.useContext(UIContext);
