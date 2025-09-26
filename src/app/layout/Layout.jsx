import { Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { UIContext } from '../../context/uiContext.jsx';
import Header from './Header';
import Sidebar from './Sidebar/Sidebar';

const Layout = () => {
  const { isSidebarOpen, toggleSidebar, toggleSearch, isSearchVisible, toast } = useContext(UIContext);

  const toastNode = toast ? (
    <div className="fixed top-6 right-6 z-50 rounded bg-green-100 px-4 py-2 text-sm font-medium text-green-800 shadow">
      {toast.message}
    </div>
  ) : null;

  return (
    <>
      <div className="flex min-h-screen bg-white">
        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={toggleSidebar}
        />
        <main className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-20' : 'ml-0'}`}>
          <Header onMenuClick={toggleSidebar} />
          <div className="flex-1 overflow-auto">
            <Outlet />
          </div>
        </main>
      </div>
      {toastNode}
    </>
  );
};

export default Layout;