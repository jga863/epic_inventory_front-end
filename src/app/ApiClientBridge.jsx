import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { registerUnauthorizedHandler } from "../services/api/apiClient";
import { useAuth } from "../context/authContext";
import { useUI } from "../context/uiContext";

function ApiClientBridge() {
  const navigate = useNavigate();
  const location = useLocation();
  const locationRef = useRef(location.pathname);
  const handlerRef = useRef(() => {});
  const { logout } = useAuth();
  const { showToast } = useUI();

  useEffect(() => {
    locationRef.current = location.pathname;
  }, [location.pathname]);

  useEffect(() => {
    handlerRef.current = () => {
      logout();
      showToast("Session expired", "error");
      if (locationRef.current !== "/login") {
        navigate("/login", { replace: true });
      }
    };
  }, [logout, navigate, showToast]);

  useEffect(() => {
    registerUnauthorizedHandler(() => handlerRef.current());
    return () => registerUnauthorizedHandler(null);
  }, []);

  return null;
}

export default ApiClientBridge;
