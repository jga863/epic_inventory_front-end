import { Navigate } from "react-router-dom";
import AppEmptyState from "../../shared/feedback/AppEmptyState";
import AppLoadingState from "../../shared/feedback/AppLoadingState";
import { useAuth } from "../../context/authContext";

function ProtectedRoute({
  children,
  permission,
  permissions = [],
  requireAny = false,
  fallbackTitle = "Access restricted",
  fallbackDescription = "Your role does not have access to this section.",
}) {
  const { isAuthenticated, isAuthResolved, hasPermission, hasAnyPermission } = useAuth();

  if (!isAuthResolved) {
    return (
      <div className="px-4 py-10 md:px-8">
        <AppLoadingState label="Checking access..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const requestedPermissions = permission ? [permission] : permissions;
  const isAuthorized =
    requestedPermissions.length === 0
      ? true
      : requireAny
        ? hasAnyPermission(requestedPermissions)
        : requestedPermissions.every(({ module, action }) => hasPermission(module, action));

  if (!isAuthorized) {
    return (
      <div className="px-4 py-10 md:px-8">
        <div className="app-card p-8">
          <AppEmptyState title={fallbackTitle} description={fallbackDescription} />
        </div>
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;
