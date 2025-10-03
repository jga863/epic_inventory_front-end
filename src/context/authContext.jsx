import React, { createContext, useState, useEffect, useContext } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    const storedUsername = sessionStorage.getItem('username');
    const storedRoles = sessionStorage.getItem('roles');
    if (token && storedUsername && storedRoles) {
      setIsAuthenticated(true);
      setUsername(storedUsername);
      setRoles(JSON.parse(storedRoles));
    }
  }, []);

  const login = async (username, password) => {
    const credentials = btoa(`${username}:${password}`);
    const authHeader = `Basic ${credentials}`;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': authHeader,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(true);
        setUsername(data.username);
        setRoles(data.roles);
        sessionStorage.setItem('authToken', authHeader);
        sessionStorage.setItem('username', data.username);
        sessionStorage.setItem('roles', JSON.stringify(data.roles));
        return { success: true };
      } else if (response.status === 401) {
        return { success: false, error: 'Invalid credentials' };
      } else {
        return { success: false, error: 'Login failed' };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setRoles([]);
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('roles');
  };

  const hasRole = (role) => roles.includes(role);

  const value = {
    isAuthenticated,
    username,
    roles,
    login,
    logout,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);