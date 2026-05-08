import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/authContext.jsx';
import Header from './Header';
import PrimaryNav from './PrimaryNav';
import Login from '../Login';
import AppToast from '../../shared/feedback/AppToast.jsx';
import AppLoadingState from '../../shared/feedback/AppLoadingState.jsx';
import { useUI } from '../../context/uiContext.jsx';

const Layout = () => {
  const { isAuthenticated, isAuthResolved } = useAuth();
  const { toast } = useUI();

  if (!isAuthResolved) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <AppLoadingState label="Restoring session..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <>
      <div className="app-shell flex min-h-screen flex-col">
        <Header />
        <PrimaryNav />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
      <AppToast toast={toast} />
    </>
  );
};

export default Layout;
