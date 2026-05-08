import { UIProvider } from '../../context/uiContext.jsx';
import { AuthProvider } from '../../context/authContext.jsx';

const GlobalStateProvider = ({ children }) => {
  return (
    <AuthProvider>
      <UIProvider>
        {children}
      </UIProvider>
    </AuthProvider>
  );
};

export default GlobalStateProvider;
