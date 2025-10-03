import { UIProvider } from './uiContext.jsx';
import { ViewProvider } from './viewContext.jsx';
import { DataProvider } from './dataContext.jsx';
import { AuthProvider } from './authContext.jsx';

const GlobalStateProvider = ({ children }) => {
  return (
    <AuthProvider>
      <UIProvider>
        <ViewProvider>
          <DataProvider>
            {children}
          </DataProvider>
        </ViewProvider>
      </UIProvider>
    </AuthProvider>
  );
};

export default GlobalStateProvider;