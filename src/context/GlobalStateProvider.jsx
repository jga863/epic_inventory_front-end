import { UIProvider } from './uiContext.jsx';
import { ViewProvider } from './viewContext.jsx';
import { DataProvider } from './dataContext.jsx';

const GlobalStateProvider = ({ children }) => {
  return (
    <UIProvider>
      <ViewProvider>
        <DataProvider>
          {children}
        </DataProvider>
      </ViewProvider>
    </UIProvider>
  );
};

export default GlobalStateProvider;