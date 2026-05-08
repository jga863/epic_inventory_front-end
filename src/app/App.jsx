import { BrowserRouter as Router } from 'react-router-dom';
import GlobalStateProvider from './providers/GlobalStateProvider';
import ApiClientBridge from './ApiClientBridge';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <GlobalStateProvider>
      <Router>
        <ApiClientBridge />
        <AppRoutes />
      </Router>
    </GlobalStateProvider>
  );
}

export default App;
